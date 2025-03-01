import { getToken } from "utils/auth"
// import { checkPermission } from "utils/permission"
// NOTE: tal vez, si es necesario mas adelanet, se podria armar una funcion similar a la checkPermission pero qeu chequee si tiene o no determinada responsabilidad

const whiteList = ["/login", "/login-horus", "/refresh", "/register"] // no redirect whitelist

const checkAndSetTitle = meta => {
  if (meta && meta.pageTitle && meta.pageTitle.length > 0) {
    document.title = meta.pageTitle
  } else {
    document.title = "F12"
  }
}

export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
      // Si tiene el token y no tiene seteado el usuario, lo traigo
      if (store.getters["auth/user"] === null) {
        try {
          await store.dispatch("auth/getUserInfo", null, { root: true })
          // chequeamos las notificaciones y dashboard aca, asi setea la bandera correspondiente y no vuelve a chequearlas desde el componente
          await store.dispatch("app/checkNotificacionesYDashboard", null, { root: true })
        } catch (e) {
          await store.dispatch("auth/logout", null, { root: true })
          next(`/login?redirect=${to.path}`)
          return
        }
      }

      if (to.path === "/login") {
        // if is logged in, redirect to the home page
        next({ path: "/inicio" })
      } else {
        const userHasSistemas = store.getters["auth/userEsResponsable"]
        const checkHasResponsabilities = to.meta && to.meta.checkHasResponsabilities

        // if the route need to check for responsabilites, and the user don't have them, logout
        if (checkHasResponsabilities && !userHasSistemas) {
          await store.dispatch("auth/logout", null, { root: true })
          next(`/login?redirect=inicio`)
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
