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
        path: "/nuevo-ticket",
        name: "nuevo-ticket",
        component: () => import("pages/NuevoTicket.vue"),
        meta: {
          title: "Nuevo Ticket - F12",
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
