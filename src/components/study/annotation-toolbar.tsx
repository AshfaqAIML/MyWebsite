'use client';

import { useCallback, useState } from 'react';
import {
  MousePointer2, Highlighter, Underline, Strikethrough,
  Pen, Eraser, Square, Circle, ArrowRight, Minus,
  StickyNote, MessageSquare, Type, Stamp,
  ChevronUp, ChevronDown, Minus as MinusIcon, Plus,
  Expand, Shrink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AnnotationTool } from '@/lib/study/pdf-annotations';
import { ANNOTATION_COLORS, DRAWING_COLORS } from '@/lib/study/pdf-annotations';

interface AnnotationToolbarProps {
  activeTool: AnnotationTool;
  onToolChange: (tool: AnnotationTool) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (w: number) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onFitToWidth: () => void;
  onFitToPage: () => void;
  onFullscreen: () => void;
  darkMode: boolean;
}

const tools: { key: AnnotationTool; icon: LucideIcon; label: string; shortcut?: string }[] = [
  { key: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { key: 'highlight', icon: Highlighter, label: 'Highlight', shortcut: 'H' },
  { key: 'underline', icon: Underline, label: 'Underline', shortcut: 'U' },
  { key: 'strikethrough', icon: Strikethrough, label: 'Strike' },
  { key: 'squiggly', icon: MinusIcon, label: 'Squiggly' },
  { key: 'pen', icon: Pen, label: 'Pen', shortcut: 'P' },
  { key: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  { key: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { key: 'circle', icon: Circle, label: 'Circle' },
  { key: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { key: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
  { key: 'sticky', icon: StickyNote, label: 'Sticky' },
  { key: 'comment', icon: MessageSquare, label: 'Comment' },
  { key: 'textbox', icon: Type, label: 'Text' },
];

export default function AnnotationToolbar({
  activeTool, onToolChange, activeColor, onColorChange,
  strokeWidth, onStrokeWidthChange,
  zoom, onZoomChange, currentPage, totalPages, onPageChange,
  onFitToWidth, onFitToPage, onFullscreen, darkMode,
}: AnnotationToolbarProps) {
  const [showColors, setShowColors] = useState(false);
  const isDrawingTool = activeTool === 'pen' || activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'arrow' || activeTool === 'line';
  const isHighlightTool = activeTool === 'highlight' || activeTool === 'underline' || activeTool === 'strikethrough' || activeTool === 'squiggly';

  const colors = isDrawingTool ? DRAWING_COLORS : ANNOTATION_COLORS;

  return (
    <div className={`flex items-center gap-1 px-3 py-2 rounded-xl border ${
      darkMode ? 'bg-[#1a1a2e]/95 border-white/[0.08]' : 'bg-white/95 border-black/10 shadow-sm'
    }`}>
      {tools.slice(0, 6).map(tool => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.key;
        return (
          <button
            key={tool.key}
            onClick={() => onToolChange(tool.key)}
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            className={`p-1.5 rounded-lg transition-all relative ${
              isActive
                ? darkMode
                  ? 'bg-white/[0.12] text-white'
                  : 'bg-black/10 text-black'
                : darkMode
                  ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                  : 'text-black/40 hover:text-black/60 hover:bg-black/5'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}

      <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-white/[0.06]' : 'bg-black/10'}`} />

      {tools.slice(6, 12).map(tool => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.key;
        return (
          <button
            key={tool.key}
            onClick={() => onToolChange(tool.key)}
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            className={`p-1.5 rounded-lg transition-all ${
              isActive
                ? darkMode
                  ? 'bg-white/[0.12] text-white'
                  : 'bg-black/10 text-black'
                : darkMode
                  ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                  : 'text-black/40 hover:text-black/60 hover:bg-black/5'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}

      <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-white/[0.06]' : 'bg-black/10'}`} />

      <button
        onClick={() => onToolChange('textbox')}
        title="Text Box"
        className={`p-1.5 rounded-lg transition-all ${
          activeTool === 'textbox'
            ? darkMode ? 'bg-white/[0.12] text-white' : 'bg-black/10 text-black'
            : darkMode ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/5'
        }`}
      >
        <Type className="h-3.5 w-3.5" />
      </button>

      <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-white/[0.06]' : 'bg-black/10'}`} />

      <div className="relative">
        <button
          onClick={() => setShowColors(!showColors)}
          title="Annotation Color"
          className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center gap-1"
        >
          <div className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: activeColor }} />
        </button>
        {showColors && (
          <div className={`absolute top-full mt-1 left-0 p-2 rounded-xl border grid grid-cols-4 gap-1 z-50 ${
            darkMode ? 'bg-[#1a1a2e] border-white/[0.08]' : 'bg-white border-black/10 shadow-lg'
          }`}>
            {ANNOTATION_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => { onColorChange(c.value); setShowColors(false); }}
                className="w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
            <div className={`col-span-4 mt-1 pt-1 border-t ${darkMode ? 'border-white/[0.06]' : 'border-black/10'}`}>
              <p className={`text-[10px] mb-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Drawing Colors</p>
              <div className="grid grid-cols-6 gap-1">
                {DRAWING_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => { onColorChange(c.value); setShowColors(false); }}
                    className="w-5 h-5 rounded-md border border-white/10 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isDrawingTool && (
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={() => onStrokeWidthChange(Math.max(1, strokeWidth - 1))}
            className={`p-1 rounded ${darkMode ? 'hover:bg-white/[0.04] text-white/40' : 'hover:bg-black/5 text-black/40'}`}
          >
            <MinusIcon className="h-3 w-3" />
          </button>
          <span className={`text-[10px] w-4 text-center ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{strokeWidth}</span>
          <button
            onClick={() => onStrokeWidthChange(Math.min(12, strokeWidth + 1))}
            className={`p-1 rounded ${darkMode ? 'hover:bg-white/[0.04] text-white/40' : 'hover:bg-black/5 text-black/40'}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-white/[0.06]' : 'bg-black/10'}`} />

      <button onClick={onFitToWidth} title="Fit to Width" className={`p-1.5 rounded-lg ${darkMode ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/5'}`}>
        <Shrink className="h-3.5 w-3.5" />
      </button>
      <button onClick={onFitToPage} title="Fit to Page" className={`p-1.5 rounded-lg ${darkMode ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/5'}`}>
        <Expand className="h-3.5 w-3.5" />
      </button>
      <button onClick={onFullscreen} title="Full Screen" className={`p-1.5 rounded-lg ${darkMode ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/5'}`}>
        <Expand className="h-3.5 w-3.5" />
      </button>

      <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-white/[0.06]' : 'bg-black/10'}`} />

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className={`p-1 rounded ${currentPage <= 1 ? 'opacity-30' : ''} ${darkMode ? 'hover:bg-white/[0.04] text-white/50' : 'hover:bg-black/5 text-black/50'}`}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <span className={`text-[11px] font-medium tabular-nums min-w-[60px] text-center ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={`p-1 rounded ${currentPage >= totalPages ? 'opacity-30' : ''} ${darkMode ? 'hover:bg-white/[0.04] text-white/50' : 'hover:bg-black/5 text-black/50'}`}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-white/[0.06]' : 'bg-black/10'}`} />

      <div className="flex items-center gap-1">
        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 10))}
          className={`p-1 rounded ${darkMode ? 'hover:bg-white/[0.04] text-white/40' : 'hover:bg-black/5 text-black/40'}`}
        >
          <MinusIcon className="h-3 w-3" />
        </button>
        <span className={`text-[11px] font-medium tabular-nums w-10 text-center ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
          {zoom}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(200, zoom + 10))}
          className={`p-1 rounded ${darkMode ? 'hover:bg-white/[0.04] text-white/40' : 'hover:bg-black/5 text-black/40'}`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
