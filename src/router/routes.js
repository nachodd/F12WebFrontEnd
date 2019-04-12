const routes = [
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        path: "inicio",
        component: () => import("pages/Index.vue"),
        meta: {
          title: "Inicio - F12",
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
