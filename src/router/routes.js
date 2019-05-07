const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Login.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [
      {
        path: "",
        redirect: { name: "inicio" },
      },
      {
        path: "/inicio",
        name: "inicio",
        component: () => import("pages/Index.vue"),
        meta: {
          title: "Inicio - F12",
          roles: ["menu_sistemas"],
        },
      },
      {
        path: "/nuevo-requerimiento",
        name: "nuevo-requerimiento",
        component: () => import("pages/NuevoRequerimiento.vue"),
        meta: {
          title: "Nuevo Requerimiento - F12",
          roles: ["menu_sistemas"],
        },
      },
      {
        path: "/mis-requerimientos",
        name: "mis-requerimientos",
        component: () => import("pages/MisRequerimientos.vue"),
        meta: {
          title: "Mis Requerimientos - F12",
          roles: ["menu_sistemas"],
        },
      },
      {
        path: "/priorizar-requerimientos",
        name: "priorizar-requerimientos",
        component: () => import("pages/PriorizarRequerimientos.vue"),
        meta: {
          title: "Priorizar Requerimientos - F12",
          roles: ["menu_sistemas"],
        },
      },
    ],
  },
]

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue"),
  })
}

export default routes
