import type {
  FirestoreArrayValue,
  FirestoreStringValue,
  FirestoreValue,
} from "../types/firestore";
import type {
  Project,
  ProjectBookNode,
  ProjectLeaf as ProjectLeafType,
  ProjectScene,
  ProjectChapter,
  FirestoreDocument,
  FirestoreBookFields,
  FirestoreNode,
  FirestoreLeafFields,
  FirestoreCreateResponse,
  ProjectFromFirestore,
} from "../types/project";

const isFirestoreStringValue = (
  value: FirestoreValue | undefined,
): value is FirestoreStringValue => {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    "stringValue" in value &&
    typeof value.stringValue === "string"
  );
};

const isFirestoreArrayValue = (
  value: FirestoreValue | undefined,
): value is FirestoreArrayValue => {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    "arrayValue" in value &&
    value.arrayValue !== null &&
    typeof value.arrayValue === "object"
  );
};

const toStringValue = (
  value: FirestoreValue | undefined,
  fieldName: string,
): string => {
  if (!isFirestoreStringValue(value)) {
    throw new Error(`Invalid Firestore string field: ${fieldName}`);
  }
  return value.stringValue;
};

const toArrayValues = (
  value: FirestoreValue | undefined,
  fieldName: string,
): FirestoreValue[] => {
  if (!isFirestoreArrayValue(value)) {
    throw new Error(`Invalid Firestore array field: ${fieldName}`);
  }
  return value.arrayValue.values ?? [];
};

const toOptionalStringValue = (
  fields: Record<string, FirestoreValue>,
  fieldName: string,
): string | undefined => {
  const value = fields[fieldName];
  if (!isFirestoreStringValue(value)) return undefined;

  const preparedValue = value.stringValue.trim();
  return preparedValue.length ? preparedValue : undefined;
};

const isProjectLeaf = (node: ProjectBookNode): node is ProjectLeafType => {
  return node.type === "leaf";
};

const isProjectLeafOrScene = (
  node: ProjectBookNode,
): node is ProjectLeafType | ProjectScene => {
  return node.type === "leaf" || node.type === "scene";
};

const isProjectLeafSceneOrChapter = (
  node: ProjectBookNode,
): node is ProjectLeafType | ProjectScene | ProjectChapter => {
  return (
    node.type === "leaf" || node.type === "scene" || node.type === "chapter"
  );
};

// Проверка, является ли документ leaf
export const isLeafDocument = (
  doc: FirestoreDocument,
): doc is FirestoreDocument & { fields: FirestoreLeafFields } => {
  return doc.fields.type.stringValue === "leaf";
};

// Проверка, является ли документ book
export const isBookDocument = (
  doc: FirestoreDocument,
): doc is FirestoreDocument & { fields: FirestoreBookFields } => {
  return doc.fields.type.stringValue === "book";
};

// Проверка, является ли значение узлом
export const isFirestoreNode = (value: unknown): value is FirestoreNode => {
  return (
    value !== null &&
    typeof value === "object" &&
    "mapValue" in value &&
    value.mapValue !== null &&
    typeof value.mapValue === "object" &&
    "fields" in value.mapValue &&
    value.mapValue.fields !== null &&
    typeof value.mapValue.fields === "object" &&
    "type" in value.mapValue.fields
  );
};

// Проверка типа узла
export const isLeafNode = (node: FirestoreNode): boolean => {
  return node.mapValue.fields.type.stringValue === "leaf";
};

export const isSceneNode = (node: FirestoreNode): boolean => {
  return node.mapValue.fields.type.stringValue === "scene";
};

export const isChapterNode = (node: FirestoreNode): boolean => {
  return node.mapValue.fields.type.stringValue === "chapter";
};

export const isVolumeNode = (node: FirestoreNode): boolean => {
  return node.mapValue.fields.type.stringValue === "volume";
};

// Конвертация Project в Firestore формат
export const projectToFirestore = (
  project: Project,
): { fields: Record<string, FirestoreValue> } => {
  const fields: Record<string, FirestoreValue> = {
    title: { stringValue: project.title },
    type: { stringValue: project.type },
  };

  if (project.type === "leaf") {
    fields.content = { stringValue: project.content };
  } else {
    fields.content = {
      arrayValue: {
        values: project.content.map(nodeToFirestoreValue),
      },
    };
  }

  return { fields };
};

// Конвертация узла Project в Firestore значение
const nodeToFirestoreValue = (node: ProjectBookNode): FirestoreValue => {
  const fields: Record<string, FirestoreValue> = {
    id: { stringValue: node.id },
    title: { stringValue: node.title },
    type: { stringValue: node.type },
  };

  if (node.type === "leaf") {
    fields.content = { stringValue: node.content };
  } else {
    fields.content = {
      arrayValue: {
        values: node.content.map(nodeToFirestoreValue),
      },
    };
  }

  return { mapValue: { fields } };
};

///////////////////////////////////

// Конвертация Firestore документа в Project
export const firestoreToProject = (
  doc: FirestoreDocument | FirestoreCreateResponse,
  id: string,
): ProjectFromFirestore => {
  const { fields } = doc;
  const title = toStringValue(fields.title, "title");
  const type = toStringValue(fields.type, "type");
  const rawFields = fields as Record<string, FirestoreValue>;

  // Берем системные поля из документа
  const createTime = doc.createTime;
  const updateTime = doc.updateTime;
  const publicMetaFields = {
    author: toOptionalStringValue(rawFields, "author"),
    year: toOptionalStringValue(rawFields, "year"),
    genre: toOptionalStringValue(rawFields, "genre"),
    coverUrl: toOptionalStringValue(rawFields, "coverUrl"),
    sourceProjectId: toOptionalStringValue(rawFields, "sourceProjectId"),
    publicProjectId: toOptionalStringValue(rawFields, "publicProjectId"),
    authorUid: toOptionalStringValue(rawFields, "authorUid"),
  };

  if (type === "leaf") {
    const content = toStringValue(
      (fields as FirestoreLeafFields).content,
      "content",
    );

    return {
      id,
      title,
      type: "leaf",
      content,
      createTime,
      updateTime,
      ...publicMetaFields,
    };
  }

  if (type !== "book") {
    throw new Error(`Unknown project type: ${type}`);
  }

  const content = toArrayValues(
    (fields as FirestoreBookFields).content,
    "content",
  ).map(firestoreValueToNode);

  return {
    id,
    title,
    type: "book",
    content,
    createTime,
    updateTime,
    ...publicMetaFields,
  };
};

// Конвертация Firestore значения в узел Project
const firestoreValueToNode = (value: FirestoreValue): ProjectBookNode => {
  if (!isFirestoreNode(value)) {
    throw new Error("Invalid node structure");
  }

  const fields = value.mapValue.fields;
  const id = toStringValue(fields.id, "node.id");
  const title = toStringValue(fields.title, "node.title");
  const type = toStringValue(fields.type, "node.type");

  // Обработка leaf
  if (type === "leaf") {
    const content = toStringValue(fields.content, "node.content");

    return {
      id,
      title,
      type: "leaf",
      content,
    };
  }

  // Обработка scene
  if (type === "scene") {
    const content = toArrayValues(fields.content, "node.content").map(
      firestoreValueToNode,
    );
    if (!content.every(isProjectLeaf)) {
      throw new Error("Invalid scene content: only leaf nodes are allowed");
    }

    return {
      id,
      title,
      type: "scene",
      content,
    };
  }

  // Обработка chapter
  if (type === "chapter") {
    const content = toArrayValues(fields.content, "node.content").map(
      firestoreValueToNode,
    );
    if (!content.every(isProjectLeafOrScene)) {
      throw new Error(
        "Invalid chapter content: only leaf and scene nodes are allowed",
      );
    }

    return {
      id,
      title,
      type: "chapter",
      content,
    };
  }

  // Обработка volume
  if (type === "volume") {
    const content = toArrayValues(fields.content, "node.content").map(
      firestoreValueToNode,
    );
    if (!content.every(isProjectLeafSceneOrChapter)) {
      throw new Error(
        "Invalid volume content: only leaf, scene and chapter nodes are allowed",
      );
    }

    return {
      id,
      title,
      type: "volume",
      content,
    };
  }

  throw new Error(`Unknown node type: ${type}`);
};

export const firestoreToPublicProject = (
  doc: FirestoreDocument | FirestoreCreateResponse,
  id: string,
): ProjectFromFirestore => {
  return firestoreToProject(doc, id);
};
