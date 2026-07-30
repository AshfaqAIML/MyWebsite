'use client';

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { PDFAnnotation, AnnotationTool } from '@/lib/study/pdf-annotations';

interface PDFViewerProps {
  pdfUrl: string;
  page: number;
  totalPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onTotalPages: (total: number) => void;
  onZoomChange: (zoom: number) => void;
  activeTool: AnnotationTool;
  activeColor: string;
  strokeWidth: number;
  annotations: PDFAnnotation[];
  onAnnotationCreate: (annotation: PDFAnnotation) => void;
  continuousScroll: boolean;
  darkMode: boolean;
  containerClassName?: string;
}

export interface PDFViewerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  rotate: () => void;
}

function PDFCanvas({
  pageNum, pdfDoc, scale, darkMode, annotations, activeTool, activeColor, strokeWidth, onAnnotationCreate,
}: {
  pageNum: number; pdfDoc: any; scale: number; darkMode: boolean;
  annotations: PDFAnnotation[]; activeTool: AnnotationTool; activeColor: string;
  strokeWidth: number; onAnnotationCreate: (a: PDFAnnotation) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [rendered, setRendered] = useState(false);

  const pageAnnotations = annotations.filter(a => a.page === pageNum);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!pdfDoc || !canvasRef.current) return;
      setRendered(false);
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        canvas.width = viewport.width * devicePixelRatio;
        canvas.height = viewport.height * devicePixelRatio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext('2d')!;
        ctx.scale(devicePixelRatio, devicePixelRatio);

        await page.render({
          canvasContext: ctx, viewport,
          background: darkMode ? '#1a1a2e' : '#ffffff',
        }).promise;

        if (cancelled) return;

        const textContent = await page.getTextContent();
        const textLayer = textLayerRef.current;
        if (!textLayer) return;
        textLayer.innerHTML = '';
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.height = `${viewport.height}px`;

        const textItems = textContent.items as any[];
        textItems.forEach((item: any) => {
          const span = document.createElement('span');
          span.textContent = item.str;
          const fontSize = item.fontSize || 16;
          const fontName = item.fontName;
          span.style.position = 'absolute';
          span.style.left = `${item.transform[4]}px`;
          span.style.top = `${item.transform[5] - fontSize}px`;
          span.style.fontSize = `${fontSize}px`;
          span.style.color = darkMode ? '#c8c8d8' : '#1a1a2e';
          span.style.whiteSpace = 'pre';
          span.style.transformOrigin = 'left center';
          span.style.opacity = '0.45';
          span.style.pointerEvents = 'auto';
          span.style.cursor = 'text';
          textLayer.appendChild(span);
        });

        if (!cancelled) setRendered(true);
      } catch (err) {
        console.error('PDF render error for page', pageNum, err);
      }
    }
    render();
    return () => { cancelled = true; };
  }, [pdfDoc, pageNum, scale, darkMode]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool !== 'pen' && activeTool !== 'eraser') return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    svg.dataset.drawing = 'true';
    svg.dataset.points = JSON.stringify([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  }, [activeTool]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg || svg.dataset.drawing !== 'true') return;
    const rect = svg.getBoundingClientRect();
    const points = JSON.parse(svg.dataset.points || '[]');
    points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    svg.dataset.points = JSON.stringify(points);
    let path = svg.querySelector('.active-drawing') as SVGPathElement;
    if (!path) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('active-drawing');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', activeColor);
      path.setAttribute('stroke-width', String(strokeWidth));
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(path);
    }
    const d = points.map((p: any, i: number) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');
    path.setAttribute('d', d);
  }, [activeColor, strokeWidth]);

  const handleMouseUp = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || svg.dataset.drawing !== 'true') return;
    svg.dataset.drawing = 'false';
    const path = svg.querySelector('.active-drawing');
    if (path) path.remove();
    const pointsStr = svg.dataset.points;
    if (!pointsStr) return;
    const points = JSON.parse(pointsStr);
    svg.dataset.points = '';
    if (points.length < 2) return;
    if (activeTool === 'pen') {
      onAnnotationCreate({
        id: `dr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        bookId: '', type: 'drawing', color: activeColor, strokeWidth, points, page: pageNum,
        createdAt: new Date().toISOString(),
      } as any);
    }
  }, [activeTool, activeColor, strokeWidth, pageNum, onAnnotationCreate]);

  const handleTextSelection = useCallback(() => {
    if (activeTool !== 'highlight' && activeTool !== 'underline' && activeTool !== 'strikethrough' && activeTool !== 'squiggly') return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const textLayer = textLayerRef.current;
    if (!textLayer || !textLayer.contains(range.commonAncestorContainer)) return;
    const text = sel.toString().trim();
    if (!text) return;
    const containerRect = textLayer.getBoundingClientRect();
    const rects = range.getClientRects();
    if (rects.length === 0) return;
    const firstRect = rects[0];
    const lastRect = rects[rects.length - 1];
    const position = {
      page: pageNum,
      x: (firstRect.left - containerRect.left) / (containerRect.width || 1),
      y: (firstRect.top - containerRect.top) / (containerRect.height || 1),
      w: (lastRect.right - firstRect.left) / (containerRect.width || 1),
      h: (lastRect.bottom - firstRect.top) / (containerRect.height || 1),
    };
    const annotationType = activeTool === 'underline' ? 'underline'
      : activeTool === 'strikethrough' ? 'strikethrough'
      : activeTool === 'squiggly' ? 'squiggly' : 'highlight';
    onAnnotationCreate({
      id: `${annotationType[0]}l_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      bookId: '', type: annotationType, color: activeColor, text, position, page: pageNum, note: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    } as any);
    sel.removeAllRanges();
  }, [activeTool, activeColor, pageNum, onAnnotationCreate]);

  return (
    <div className="relative mx-auto shadow-xl shadow-black/20" style={{ minHeight: '500px' }}>
      <canvas ref={canvasRef} className="block" style={{ opacity: rendered ? 1 : 0.3, transition: 'opacity 0.2s' }} />
      <div ref={textLayerRef} className="absolute inset-0" onMouseUp={handleTextSelection} />
      <svg ref={svgRef} className="absolute inset-0"
        style={{ pointerEvents: activeTool === 'pen' || activeTool === 'eraser' ? 'auto' : 'none' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {pageAnnotations.map(ann => {
          if ((ann.type === 'highlight' || ann.type === 'underline' || ann.type === 'strikethrough' || ann.type === 'squiggly') && 'position' in ann) {
            const a = ann as any; const r = a.position;
            if (ann.type === 'highlight') return <rect key={a.id} x={`${r.x*100}%`} y={`${r.y*100}%`} width={`${r.w*100}%`} height={`${r.h*100}%`} fill={a.color} opacity={0.4} />;
            if (ann.type === 'underline') return <line key={a.id} x1={`${r.x*100}%`} y1={`${(r.y+r.h)*100}%`} x2={`${(r.x+r.w)*100}%`} y2={`${(r.y+r.h)*100}%`} stroke={a.color} strokeWidth={2} />;
            if (ann.type === 'strikethrough') return <line key={a.id} x1={`${r.x*100}%`} y1={`${(r.y+r.h/2)*100}%`} x2={`${(r.x+r.w)*100}%`} y2={`${(r.y+r.h/2)*100}%`} stroke={a.color} strokeWidth={2} />;
          }
          if (ann.type === 'drawing') {
            const a = ann as any;
            const d = a.points.map((p: any, i: number) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
            return <path key={a.id} d={d} fill="none" stroke={a.color} strokeWidth={a.strokeWidth||3} strokeLinecap="round" strokeLinejoin="round" />;
          }
          if ((ann.type === 'rectangle' || ann.type === 'circle') && 'position' in ann) {
            const a = ann as any; const r = a.position;
            return ann.type === 'circle'
              ? <ellipse key={a.id} cx={`${(r.x+r.w/2)*100}%`} cy={`${(r.y+r.h/2)*100}%`} rx={`${(r.w/2)*100}%`} ry={`${(r.h/2)*100}%`} fill="none" stroke={a.color} strokeWidth={a.strokeWidth||2} />
              : <rect key={a.id} x={`${r.x*100}%`} y={`${r.y*100}%`} width={`${r.w*100}%`} height={`${r.h*100}%`} fill="none" stroke={a.color} strokeWidth={a.strokeWidth||2} />;
          }
          if (ann.type === 'sticky') {
            const a = ann as any;
            return <g key={a.id}><rect x={a.position.x-12} y={a.position.y-12} width={24} height={24} fill={a.color} rx={3} opacity={0.9} /><text x={a.position.x} y={a.position.y+4} textAnchor="middle" fontSize={12} fill="#1a1a1a">📌</text></g>;
          }
          return null;
        })}
      </svg>
      <div className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-white/50">{pageNum}</div>
    </div>
  );
}

const PDFViewer = forwardRef<PDFViewerHandle, PDFViewerProps>(function PDFViewer(props, ref) {
  const {
    pdfUrl, page, totalPages, zoom, onPageChange, onTotalPages, onZoomChange,
    activeTool, activeColor, strokeWidth, annotations, onAnnotationCreate,
    continuousScroll, darkMode, containerClassName,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const scale = 0.01 * (zoom + 100);

  useEffect(() => {
    let cancelled = false;
    async function loadPDF() {
      setLoading(true);
      setError(null);
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const doc = await pdfjs.getDocument(pdfUrl).promise;
        if (cancelled) return;
        setPdfDoc(doc);
        onTotalPages(doc.numPages);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load PDF');
      }
      if (!cancelled) setLoading(false);
    }
    loadPDF();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => onZoomChange(Math.min(200, zoom + 10)),
    zoomOut: () => onZoomChange(Math.max(25, zoom - 10)),
    fitToWidth: () => {
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth - 40;
        onZoomChange(Math.round(Math.max(25, Math.min(200, (cw / 612) * 100))));
      }
    },
    fitToPage: () => {
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth - 40;
        const ch = containerRef.current.clientHeight - 40;
        onZoomChange(Math.round(Math.max(25, Math.min(200, Math.min((cw/612)*100, (ch/792)*100)))));
      }
    },
    rotate: () => setRotation(r => (r + 90) % 360),
  }), [zoom, onZoomChange, containerRef]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${darkMode ? 'bg-[#0f0f13]' : 'bg-zinc-50'}`}>
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto" />
          <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-black/40'}`}>Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${darkMode ? 'bg-[#0f0f13]' : 'bg-zinc-50'}`}>
        <div className="text-center max-w-md">
          <div className={`w-14 h-14 rounded-full ${darkMode ? 'bg-red-500/10' : 'bg-red-50'} flex items-center justify-center mx-auto mb-4`}>
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white/70' : 'text-black/70'}`}>Failed to load PDF</p>
          <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-black/40'}`}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center py-8 ${darkMode ? 'bg-[#0f0f13]' : 'bg-zinc-50'} ${containerClassName || ''}`}
      style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' }}>
      <div key={`page-${page}-zoom-${zoom}`} className="animate-pdf-fade space-y-6">
        <PDFCanvas
          pageNum={page}
          pdfDoc={pdfDoc}
          scale={scale}
          darkMode={darkMode}
          annotations={annotations}
          activeTool={activeTool}
          activeColor={activeColor}
          strokeWidth={strokeWidth}
          onAnnotationCreate={onAnnotationCreate}
        />
      </div>
    </div>
  );
});

export default PDFViewer;
