import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/library",
    name: "Library",
    component: () => import("../views/Library.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/workshop",
    name: "Workshop",
    component: () => import("../views/Workshop.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/workshop/create",
    name: "CreateProject",
    component: () => import("../views/UpdateProject.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/workshop/edit/:id",
    name: "EditProject",
    component: () => import("../views/UpdateProject.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/notes",
    name: "Notes",
    component: () => import("../views/Notes.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
    children: [
      {
        path: "create",
        name: "CreateNote",
        component: () => import("../views/CreateNote.vue"),
        meta: {
          layout: "main",
          auth: true,
        },
      },
      {
        path: "edit-book-note/:bookId/edit-note/:id",
        name: "EditBookNoteById",
        component: () => import("../views/BookNote.vue"),
        meta: {
          layout: "main",
          auth: true,
        },
      },
      {
        path: "create-book-note/:id",
        name: "CreateBookNoteById",
        component: () => import("../views/CreateNote.vue"),
        meta: {
          layout: "main",
          auth: true,
        },
      },

      {
        path: "create-book-note",
        name: "CreateBookNote",
        component: () => import("../views/CreateNote.vue"),
        meta: {
          layout: "main",
          auth: true,
        },
      },
      {
        path: ":id",
        name: "Note",
        component: () => import("../views/Note.vue"),
        meta: {
          layout: "main",
          auth: true,
        },
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("../views/Auth.vue"),
    meta: {
      layout: "auth",
      auth: false,
    },
  },
  {
    path: "/registration",
    name: "Registration",
    component: () => import("../views/Registration.vue"),
    meta: {
      layout: "auth",
      auth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
    meta: {
      layout: "main",
      auth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "active",
});

router.beforeEach((to, _, next) => {
  const requiredAuth = to.meta.auth;
  const authStore = useAuthStore();

  // Пропуск Google callback
  if (to.path === "/auth/google-callback") {
    next();
    return;
  }

  // Если пользователь авторизован и пытается зайти на страницы auth/registration
  if (authStore.isAuth && (to.name === "Auth" || to.name === "Registration")) {
    next("/");
    return;
  }

  // Если требуется авторизация и пользователь авторизован
  if (requiredAuth && authStore.isAuth) {
    next();
    return;
  }

  // Если требуется авторизация и пользователь НЕ авторизован
  if (requiredAuth && !authStore.isAuth) {
    next("/auth?message=auth");
    return;
  }

  // Все остальные случаи
  next();
});

export default router;
