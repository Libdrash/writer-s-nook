import { defineStore } from "pinia";
import type {
  FirestoreCreateResponse,
  FirestoreDocument,
  FirestoreListResponse,
  Project,
  ProjectBookNode,
  ProjectBookType,
  ProjectFromFirestore,
  ProjectLeaf,
  ProjectNode,
  ProjectNodeType,
  PublicProjectForm,
} from "../types/project";
import type { FirestoreValue } from "../types/firestore";
import { ref } from "vue";
import { useAlertStore } from "./useAlertStore";
import { useAuthStore } from "./useAuthStore";
import { bookAxios } from "../axios/book";
import {
  firestoreToProject,
  projectToFirestore,
} from "../utils/firestoreConverters";
import { useRouter } from "vue-router";

type FirestoreRunQueryItem = {
  document?: FirestoreDocument;
};

const generateId = () => {
  return crypto.randomUUID();
};

// Доступы к дочерним узлам
const allowedChildren: Record<ProjectNodeType, ProjectBookType[]> = {
  book: ["volume", "chapter", "scene", "leaf"],
  volume: ["chapter", "scene", "leaf"],
  chapter: ["scene", "leaf"],
  scene: ["leaf"],
  leaf: [],
};

// Чекаем, является ли узел контейнером, а не листом
const isContainer = (
  node: ProjectNode,
): node is Exclude<ProjectNode, ProjectLeaf> => {
  return node.type !== "leaf";
};

const findNodeById = (
  node: ProjectNode,
  nodeId: string,
): ProjectNode | null => {
  if (node.id === nodeId) return node;
  if (!isContainer(node)) return null;

  for (const child of node.content) {
    const found = findNodeById(child, nodeId);
    if (found) return found;
  }

  return null;
};

export const useProjectsStore = defineStore("projects", () => {
  const projects = ref<ProjectFromFirestore[]>([]);
  const publicProjects = ref<ProjectFromFirestore[]>([]);
  const projectToUpdate = ref<Project | null>(null);
  const router = useRouter();

  const startCreateLeaf = () => {
    projectToUpdate.value = {
      id: generateId(),
      title: "",
      type: "leaf",
      content: "",
    };
  };
  const startCreateBook = () => {
    projectToUpdate.value = {
      id: generateId(),
      title: "",
      type: "book",
      content: [],
    };
  };
  const cancelUpdateProject = () => {
    projectToUpdate.value = null;
  };

  const createBookNode = (partType: ProjectBookType): ProjectBookNode => {
    const base = {
      id: generateId(),
      title: ``,
    };

    switch (partType) {
      case "leaf":
        return { ...base, type: "leaf", content: "" };
      default:
        return { ...base, type: partType, content: [] };
    }
  };

  const addChild = (parentId: string, childType: ProjectBookType) => {
    if (!projectToUpdate.value || projectToUpdate.value.type === "leaf") return;

    const parentNode = findNodeById(projectToUpdate.value, parentId);
    if (!parentNode || !isContainer(parentNode)) return;

    const allowedArray = allowedChildren[parentNode.type];
    if (!allowedArray.includes(childType)) {
      console.error(`Нельзя добавить ${childType} в ${parentNode.type}`);
      return;
    }

    const newNode = createBookNode(childType);

    switch (parentNode.type) {
      case "scene":
        if (newNode.type !== "leaf") return;
        parentNode.content.push(newNode);
        return;
      case "chapter":
        if (newNode.type !== "leaf" && newNode.type !== "scene") return;
        parentNode.content.push(newNode);
        return;
      case "volume":
        if (newNode.type === "volume") return;
        parentNode.content.push(newNode);
        return;
      case "book":
        parentNode.content.push(newNode);
        return;
    }
  };

  const updateNodeTitle = (nodeId: string, title: string) => {
    if (!projectToUpdate.value) return;

    const node = findNodeById(projectToUpdate.value, nodeId);
    if (!node) return;

    node.title = title;
  };
  const removeNode = (parentId: string, nodeId: string) => {
    if (!projectToUpdate.value) return;
    const parentNode = findNodeById(projectToUpdate.value, parentId);

    if (!parentNode || !isContainer(parentNode)) {
      console.error(`Родительский узел с айди ${parentId} не найден`);
      return;
    }

    const childIndex = parentNode.content.findIndex(
      (child) => child.id === nodeId,
    );
    if (childIndex === -1) {
      console.error(
        `Элемент с таким айди ${nodeId} не найден в родительском узле ${parentId}`,
      );
      return;
    }
    parentNode.content.splice(childIndex, 1);
  };

  const updateLeafContent = (nodeId: string, content: string) => {
    if (!projectToUpdate.value) return;

    const node = findNodeById(projectToUpdate.value, nodeId);
    if (!node || node.type !== "leaf") return;

    node.content = content;
  };

  const createRoot = (type: "book" | "leaf") => {
    if (type === "book") startCreateBook();
    else startCreateLeaf();
  };

  // РАБОТА С ФАЙРБЕЙС
  const alertStore = useAlertStore();
  const authStore = useAuthStore();
  const isUpdateProjectLoading = ref(false);
  const isFetchProjectsLoading = ref(false);
  const isFetchProjectLoading = ref(false);
  const isRemoveProjectLoading = ref(false);

  const createProject = async () => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    if (!projectToUpdate.value) {
      alertStore.showErrorAlert("Нет данных для создания проекта");
      return;
    }

    isUpdateProjectLoading.value = true;

    try {
      const firestoreData = projectToFirestore(projectToUpdate.value);

      const response = await bookAxios.post<FirestoreCreateResponse>(
        `/users/${userId}/projects`,
        firestoreData,
      );

      alertStore.setAlert({
        type: "primary",
        message: "Проект успешно создан!",
      });

      cancelUpdateProject();

      router.push({ name: "Workshop" });

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message || "Не удалось создать проект",
      );
      throw error;
    } finally {
      isUpdateProjectLoading.value = false;
    }
  };

  const updateProjectWithId = async (projectId: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    if (!projectToUpdate.value) {
      alertStore.showErrorAlert("Нет данных для обновления проекта");
      return;
    }

    isUpdateProjectLoading.value = true;

    try {
      const firestoreData = projectToFirestore(projectToUpdate.value);

      const response = await bookAxios.patch<FirestoreDocument>(
        `/users/${userId}/projects/${projectId}`,
        {
          fields: firestoreData.fields,
        },
      );

      alertStore.setAlert({
        type: "primary",
        message: "Проект успешно обновлён!",
      });

      cancelUpdateProject();

      router.push({ name: "Workshop" });

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message || "Не удалось обновить проект",
      );
      throw error;
    } finally {
      isUpdateProjectLoading.value = false;
    }
  };

  const fetchProjects = async () => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    isFetchProjectsLoading.value = true;

    try {
      const response = await bookAxios.get<FirestoreListResponse>(
        `/users/${userId}/projects`,
      );

      const documents = response.data.documents || [];

      const fetchedProjects = documents.map((doc) => {
        const documentId = doc.name.split("/").pop();
        if (!documentId) throw new Error("Invalid document ID");
        return firestoreToProject(doc, documentId);
      });

      projects.value = fetchedProjects;

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message || "Не удалось загрузить проекты",
      );
      throw error;
    } finally {
      isFetchProjectsLoading.value = false;
    }
  };
  const fetchProjectById = async (id: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    isFetchProjectLoading.value = true;

    try {
      const response = await bookAxios.get<FirestoreDocument>(
        `/users/${userId}/projects/${id}`,
      );

      const documentId = response.data.name.split("/").pop();
      if (!documentId) {
        return alertStore.showErrorAlert(
          "Невалидный ID проекта, не удалось загрузить проекты",
        );
      }

      const project = firestoreToProject(response.data, documentId);

      projectToUpdate.value = project;

      return project;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message || "Не удалось загрузить проект",
      );
      throw error;
    } finally {
      isFetchProjectLoading.value = false;
    }
  };

  const removeProject = async (projectId: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    isRemoveProjectLoading.value = true;

    try {
      const response = await bookAxios.delete(
        `/users/${userId}/projects/${projectId}`,
      );

      alertStore.setAlert({
        type: "primary",
        message: "Рабочий проект успешно удален!",
      });

      projects.value = projects.value.filter(
        (project) => project.id !== projectId,
      );

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось удалить рабочий проект",
      );
      throw error;
    } finally {
      isRemoveProjectLoading.value = false;
    }
  };

  const fetchUserPublicProjects = async () => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    isFetchProjectsLoading.value = true;

    try {
      const response = await bookAxios.get<FirestoreListResponse>(
        `/users/${userId}/public-projects`,
      );

      const documents = response.data.documents || [];

      const fetchedProjects = documents.map((doc) => {
        const documentId = doc.name.split("/").pop();
        if (!documentId) throw new Error("Invalid document ID");
        return firestoreToProject(doc, documentId);
      });

      projects.value = fetchedProjects;

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось загрузить ваши опубликованыне проекты",
      );
      throw error;
    } finally {
      isFetchProjectsLoading.value = false;
    }
  };

  const fetchPublicProjects = async () => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    isFetchProjectsLoading.value = true;

    try {
      const response = await bookAxios.get<FirestoreListResponse>(
        `/public-projects`,
      );

      const documents = response.data.documents || [];

      const fetchedProjects = documents.map((doc) => {
        const documentId = doc.name.split("/").pop();
        if (!documentId) throw new Error("Invalid document ID");
        return firestoreToProject(doc, documentId);
      });

      publicProjects.value = fetchedProjects;

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось загрузить опубликованные проекты",
      );
      throw error;
    } finally {
      isFetchProjectsLoading.value = false;
    }
  };

  const publishProject = async (
    project: Project,
    formData: PublicProjectForm,
  ) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    try {
      const projectFields = projectToFirestore(project).fields;
      const projectTypeField = projectFields.type;
      const projectContentField = projectFields.content;

      if (!projectTypeField || !projectContentField) {
        return alertStore.showErrorAlert(
          "Невалидные данные проекта для публикации",
        );
      }

      const fields: Record<string, FirestoreValue> = {
        title: {
          stringValue: formData.title.trim() || project.title,
        },
        type: projectTypeField,
        content: projectContentField,
        author: {
          stringValue: formData.author.trim(),
        },
        year: {
          stringValue: formData.year || new Date().getFullYear().toString(),
        },
        genre: {
          stringValue: formData.genre.trim(),
        },
        sourceProjectId: {
          stringValue: project.id,
        },
        authorUid: {
          stringValue: userId,
        },
      };

      if (formData.coverUrl?.trim()) {
        fields.coverUrl = {
          stringValue: formData.coverUrl.trim(),
        };
      }

      const response = await bookAxios.post<FirestoreCreateResponse>(
        `/public-projects`,
        { fields },
      );

      alertStore.setAlert({
        type: "primary",
        message: "Проект успешно опубликован!",
      });

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось опубликовать проект",
      );
      throw error;
    }
  };

  const createUserPublicProject = async (
    project: Project,
    formData: PublicProjectForm,
    publicProjectId?: string,
  ) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    try {
      const projectFields = projectToFirestore(project).fields;
      const projectTypeField = projectFields.type;
      const projectContentField = projectFields.content;

      if (!projectTypeField || !projectContentField) {
        return alertStore.showErrorAlert(
          "Невалидные данные проекта для публикации",
        );
      }

      const fields: Record<string, FirestoreValue> = {
        title: {
          stringValue: formData.title.trim() || project.title,
        },
        type: projectTypeField,
        content: projectContentField,
        author: {
          stringValue: formData.author.trim(),
        },
        year: {
          stringValue: formData.year || new Date().getFullYear().toString(),
        },
        genre: {
          stringValue: formData.genre.trim(),
        },
        sourceProjectId: {
          stringValue: project.id,
        },
        authorUid: {
          stringValue: userId,
        },
      };

      if (formData.coverUrl?.trim()) {
        fields.coverUrl = {
          stringValue: formData.coverUrl.trim(),
        };
      }

      if (publicProjectId) {
        fields.publicProjectId = {
          stringValue: publicProjectId,
        };
      }

      const response = await bookAxios.post<FirestoreCreateResponse>(
        `/users/${userId}/public-projects`,
        { fields },
      );

      return response.data;
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось создать публичный проект пользователя",
      );
      throw error;
    }
  };

  const removeUserPublicProject = async (params: {
    userPublicProjectId: string;
    sourceProjectId?: string;
    publicProjectId?: string;
  }) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      alertStore.showErrorAlert("Вы не авторизованы");
      return;
    }

    isRemoveProjectLoading.value = true;

    try {
      const documentsUrl = bookAxios.defaults.baseURL?.replace(/\/+$/, "");

      if (!documentsUrl) {
        throw new Error("Не удалось определить путь к Firestore");
      }

      await bookAxios.delete(
        `/users/${userId}/public-projects/${params.userPublicProjectId}`,
      );

      let commonPublicProjectId = params.publicProjectId?.trim();
      const sourceProjectId = params.sourceProjectId?.trim();
      let isGlobalDeleteDenied = false;

      if (!commonPublicProjectId && sourceProjectId) {
        const runQueryResponse = await bookAxios.post<FirestoreRunQueryItem[]>(
          `${documentsUrl}:runQuery`,
          {
            structuredQuery: {
              from: [{ collectionId: "public-projects" }],
              where: {
                fieldFilter: {
                  field: { fieldPath: "sourceProjectId" },
                  op: "EQUAL",
                  value: { stringValue: sourceProjectId },
                },
              },
              limit: 1,
            },
          },
        );

        const foundCommonProject = runQueryResponse.data.find(
          (item) => item.document,
        )?.document;

        if (foundCommonProject?.name) {
          commonPublicProjectId = foundCommonProject.name.split("/").pop();
        }
      }

      if (commonPublicProjectId) {
        try {
          await bookAxios.delete(`/public-projects/${commonPublicProjectId}`);
        } catch (error: any) {
          if (error?.response?.status === 403) {
            isGlobalDeleteDenied = true;
          } else {
            throw error;
          }
        }
      }

      projects.value = projects.value.filter(
        (project) => project.id !== params.userPublicProjectId,
      );

      if (commonPublicProjectId && !isGlobalDeleteDenied) {
        publicProjects.value = publicProjects.value.filter(
          (project) => project.id !== commonPublicProjectId,
        );
      }

      alertStore.setAlert({
        type: "primary",
        message: isGlobalDeleteDenied
          ? "Удалено из ваших публикаций. Для удаления из общих публикаций не хватает прав."
          : "Публикация успешно удалена!",
      });
    } catch (error: any) {
      alertStore.showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось удалить опубликованный проект",
      );
      throw error;
    } finally {
      isRemoveProjectLoading.value = false;
    }
  };

  return {
    projects,
    publicProjects,
    projectToUpdate,
    isUpdateProjectLoading,
    isFetchProjectsLoading,
    isRemoveProjectLoading,
    isFetchProjectLoading,
    updateProjectWithId,
    fetchProjectById,
    removeProject,
    removeNode,
    fetchProjects,
    createProject,
    cancelUpdateProject,
    addChild,
    updateNodeTitle,
    updateLeafContent,
    createRoot,
    fetchUserPublicProjects,
    fetchPublicProjects,
    publishProject,
    createUserPublicProject,
    removeUserPublicProject,
  };
});
