export interface AnnotationPosition {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HighlightAnnotation {
  id: string;
  bookId: string;
  type: 'highlight';
  color: string;
  text: string;
  note: string;
  position: AnnotationPosition;
  page: number;
  createdAt: string;
  updatedAt: string;
}

export interface UnderlineAnnotation {
  id: string;
  bookId: string;
  type: 'underline';
  color: string;
  text: string;
  position: AnnotationPosition;
  page: number;
  createdAt: string;
}

export interface SquigglyAnnotation {
  id: string;
  bookId: string;
  type: 'squiggly';
  color: string;
  text: string;
  position: AnnotationPosition;
  page: number;
  createdAt: string;
}

export interface StrikeAnnotation {
  id: string;
  bookId: string;
  type: 'strikethrough';
  color: string;
  text: string;
  position: AnnotationPosition;
  page: number;
  createdAt: string;
}

export interface DrawingAnnotation {
  id: string;
  bookId: string;
  type: 'drawing';
  color: string;
  strokeWidth: number;
  points: { x: number; y: number }[];
  page: number;
  createdAt: string;
}

export interface ShapeAnnotation {
  id: string;
  bookId: string;
  type: 'rectangle' | 'circle' | 'arrow' | 'line';
  color: string;
  strokeWidth: number;
  position: AnnotationPosition;
  page: number;
  createdAt: string;
}

export interface StickyNoteAnnotation {
  id: string;
  bookId: string;
  type: 'sticky';
  color: string;
  content: string;
  position: { page: number; x: number; y: number };
  page: number;
  createdAt: string;
  updatedAt: string;
}

export interface TextBoxAnnotation {
  id: string;
  bookId: string;
  type: 'textbox';
  color: string;
  content: string;
  fontSize: number;
  position: AnnotationPosition;
  page: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentAnnotation {
  id: string;
  bookId: string;
  type: 'comment';
  text: string;
  position: AnnotationPosition;
  page: number;
  replies: CommentReply[];
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentReply {
  id: string;
  text: string;
  createdAt: string;
}

export interface CalloutAnnotation {
  id: string;
  bookId: string;
  type: 'callout';
  text: string;
  targetPosition: { page: number; x: number; y: number };
  calloutPosition: { x: number; y: number };
  page: number;
  createdAt: string;
}

export type PDFAnnotation =
  | HighlightAnnotation
  | UnderlineAnnotation
  | SquigglyAnnotation
  | StrikeAnnotation
  | DrawingAnnotation
  | ShapeAnnotation
  | StickyNoteAnnotation
  | TextBoxAnnotation
  | CommentAnnotation
  | CalloutAnnotation;

export type AnnotationTool =
  | 'select'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'squiggly'
  | 'pen'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'sticky'
  | 'comment'
  | 'callout'
  | 'textbox';

export type StampType = 'approved' | 'rejected' | 'draft' | 'final' | 'confidential';

export const ANNOTATION_COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Red', value: '#fecaca' },
  { name: 'Cyan', value: '#a5f3fc' },
];

export const DRAWING_COLORS = [
  { name: 'Black', value: '#1a1a1a' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#8b5cf6' },
];

export function createHighlight(bookId: string, text: string, color: string, position: AnnotationPosition): HighlightAnnotation {
  return {
    id: `hl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    bookId, type: 'highlight', color, text, note: '',
    position, page: position.page,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createDrawing(bookId: string, color: string, strokeWidth: number, points: { x: number; y: number }[], page: number): DrawingAnnotation {
  return {
    id: `dr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    bookId, type: 'drawing', color, strokeWidth, points, page,
    createdAt: new Date().toISOString(),
  };
}
