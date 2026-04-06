export interface BookForm {
  title: string;
  author: string;
  year?: number | null;
  genre?: string;
  coverUrl?: string | null;
  rating?: number | null;
  status: string;
}

export interface Book extends BookForm {
  id: string;
  createdAt: string;
}
