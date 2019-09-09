// import MisRequerimientosCrudModal from "comp/MisRequerimientos/MisRequerimientosCrudModal"

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Login.vue"),
  },
  {
    path: "/login-horus",
    name: "login-horus",
    component: () => import("pages/LoginHorus.vue"),
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
          pageTitle: "Inicio - F12",
          headerTitle: "Inicio",
          // roles: ["menu_sistemas"],
        },
      },
      {
        path: "/mis-requerimientos",
        name: "mis-requerimientos",
        component: () => import("pages/MisRequerimientos.vue"),
        meta: {
          pageTitle: "Mis Requerimientos - F12",
          headerTitle: "Mis Requerimientos",
        },
      },
      {
        path: "/priorizar-requerimientos",
        name: "priorizar-requerimientos",
        component: () => import("pages/PriorizarRequerimientos.vue"),
        meta: {
          pageTitle: "Priorizar Requerimientos - F12",
          headerTitle: "Priorizar Requerimientos",
        },
      },
      {
        path: "/asignar-requerimientos",
        name: "asignar-requerimientos",
        component: () => import("pages/AsignarRequerimientos.vue"),
        meta: {
          pageTitle: "Asignar Requerimientos - F12",
          headerTitle: "Asignar Requerimientos",
          checkHasResponsabilities: true,
        },
      },
      {
        path: "/requerimientos-asignados",
        name: "requerimientos-asignados",
        component: () => import("pages/RequerimientosAsignados.vue"),
        meta: {
          pageTitle: "Requerimientos Asignados - F12",
          headerTitle: "Requerimientos Asignados",
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
