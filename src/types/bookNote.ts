export interface BookNote {
  id: string;
  bookId: string;
  bookTitle: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookNoteForm {
  bookId: string;
  title: string;
  content: string;
}

export interface BookWithNotes {
  id: string;
  title: string;
  author: string;
  year?: number | null;
  rating?: number | null;
  genre?: string;
  coverUrl?: string | null;
  status: string;
  createdAt: string;
  notes: BookNote[]; // ← Заметки этой книги
  notesCount: number; // ← Количество заметок для быстрого отображения
}
