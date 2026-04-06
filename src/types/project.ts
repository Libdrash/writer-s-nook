import type {
  FirestoreArrayValue,
  FirestoreMapValue,
  FirestoreStringValue,
  FirestoreValue,
} from "./firestore";

// Базовый интерфейс
export interface BaseNode {
  id: string;
  title: string;
}

// Лист
export interface ProjectLeaf extends BaseNode {
  type: "leaf";
  content: string;
}

// Сцена: только листы
export interface ProjectScene extends BaseNode {
  type: "scene";
  content: ProjectLeaf[];
}

// Глава: листы или сцены (не может содержать главы или тома)
export interface ProjectChapter extends BaseNode {
  type: "chapter";
  content: (ProjectLeaf | ProjectScene)[];
}

// Том: листы, сцены или главы
export interface ProjectVolume extends BaseNode {
  type: "volume";
  content: (ProjectLeaf | ProjectScene | ProjectChapter)[];
}

// Книга: листы, сцены, главы или тома
export interface ProjectBook extends BaseNode {
  type: "book";
  content: (ProjectLeaf | ProjectScene | ProjectChapter | ProjectVolume)[];
}

export type ProjectNodeType = "leaf" | "scene" | "chapter" | "volume" | "book";

export type ProjectBookType = "leaf" | "scene" | "chapter" | "volume";

export type ProjectNode =
  | ProjectLeaf
  | ProjectScene
  | ProjectChapter
  | ProjectVolume
  | ProjectBook;

export type ProjectBookNode = Exclude<ProjectNode, ProjectBook>;

export type Project = ProjectBook | ProjectLeaf;

export type ProjectFromFirestore = Project & {
  createTime: string;
  updateTime: string;
  author?: string;
  year?: string;
  genre?: string;
  coverUrl?: string;
  sourceProjectId?: string;
  publicProjectId?: string;
  authorUid?: string;
};

export type ContainerWithoutBook =
  | ProjectVolume
  | ProjectChapter
  | ProjectScene;

export interface FirestoreDocumentFields {
  [key: string]: FirestoreValue;
}

// Узел в Firestore формате (для content)
export interface FirestoreNodeFields extends FirestoreDocumentFields {
  id: FirestoreStringValue;
  title: FirestoreStringValue;
  type: FirestoreStringValue;
  content: FirestoreStringValue | FirestoreArrayValue;
}

export type FirestoreNode = FirestoreMapValue & {
  mapValue: {
    fields: FirestoreNodeFields;
  };
};

// Поля для проекта типа leaf
export interface FirestoreLeafFields extends FirestoreDocumentFields {
  title: FirestoreStringValue;
  type: FirestoreStringValue; // "leaf"
  content: FirestoreStringValue;
}

// Поля для проекта типа book
export interface FirestoreBookFields extends FirestoreDocumentFields {
  title: FirestoreStringValue;
  type: FirestoreStringValue; // "book"
  content: FirestoreArrayValue; // массив узлов
}

// Документ Firestore
export interface FirestoreDocument {
  name: string;
  fields: FirestoreLeafFields | FirestoreBookFields;
  createTime: string;
  updateTime: string;
}

// Ответ на создание документа
export type FirestoreCreateResponse = FirestoreDocument;

// Ответ на получение списка документов
export interface FirestoreListResponse {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
}

export interface PublicProject {
  project: Project;
  author: string;
  year: string;
  coverUrl?: string;
  genre: string;
  id: string;
  createdAt: string;
}

export interface PublicProjectForm {
  title: string;
  author: string;
  year: string;
  genre: string;
  coverUrl?: string;
}
