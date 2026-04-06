export interface NoteForm {
  title: string;
  content?: string;
}

export interface Note extends NoteForm {
  id: string;
  createdAt: string;
}
