// import MisRequerimientosCrudModal from "@comp/MisRequerimientos/MisRequerimientosCrudModal"

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
          // roles: ["menu_sistemas"],
        },
      },

      /* {
        path: "/nuevo-requerimiento",
        name: "nuevo-requerimiento",
        components: {
          modal: MisRequerimientosCrudModal,
        },
        meta: {
          title: "Nuevo Requerimiento - F12",
        },
      },
      {
        path: "/editar-requerimiento/:id",
        name: "editar-requerimiento",
        components: {
          modal: MisRequerimientosCrudModal,
        },
        meta: {
          title: "Editar Requerimiento - F12",
        },
      }, */
      {
        path: "/mis-requerimientos",
        name: "mis-requerimientos",
        component: () => import("pages/MisRequerimientos.vue"),
        meta: {
          title: "Mis Requerimientos - F12",
        },
      },
      {
        path: "/priorizar-requerimientos",
        name: "priorizar-requerimientos",
        component: () => import("pages/PriorizarRequerimientos.vue"),
        meta: {
          title: "Priorizar Requerimientos - F12",
        },
      },
      {
        path: "/asignar-requerimientos",
        name: "asignar-requerimientos",
        component: () => import("pages/AsignarRequerimientos.vue"),
        meta: {
          title: "Asignar Requerimientos - F12",
          checkHasResponsabilities: true,
        },
      },
      {
        path: "/requerimientos-asignados",
        name: "requerimientos-asignados",
        component: () => import("pages/RequerimientosAsignados.vue"),
        meta: {
          title: "Requerimientos Asignados - F12",
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
