import { getToken } from "@utils/auth"
// import { checkPermission } from "@utils/permission"
// NOTE: tal vez, si es necesario mas adelanet, se podria armar una funcion similar a la checkPermission pero qeu chequee si tiene o no determinada responsabilidad

const whiteList = ["/login", "/refresh", "/register"] // no redirect whitelist

const checkAndSetTitle = meta => {
  if (meta && meta.title && meta.title.length > 0) {
    document.title = meta.title
  } else {
    document.title = "F12"
  }
}

export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
      if (to.path === "/login") {
        // if is logged in, redirect to the home page
        next({ path: "/inicio" })
      } else {
        const userHasResponsabilities = store.getters["auth/userEsResponsable"]
        const checkResponsabilities = to.meta && to.meta.checkResponsabilities

        // if the route need to check for responsabilites, and the user don't have them, logout
        if (checkResponsabilities && !userHasResponsabilities) {
          await store.dispatch("auth/logout")
          next(`/login?redirect=${to.path}`)
        } else {
          checkAndSetTitle(to.meta)
          next()
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        checkAndSetTitle(to.meta)
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    // NProgress.done()
    window.scrollTo(0, 0)
  })
}
