import { getToken } from "@utils/auth"
import { checkPermission } from "@utils/permission"

const whiteList = ["/login", "/refresh", "/register"] // no redirect whitelist

export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
      if (to.path === "/login") {
        // if is logged in, redirect to the home page
        next({ path: "/inicio" })
      } else {
        // get the roles, and if it doesn't have the roles, fetch them (ie, force GET to a page, will have the token buy not the permissions setted)
        let rolesUser = store.getters["auth/roles"]
        if (!rolesUser || rolesUser.length === 0) {
          const { roles } = await store.dispatch("auth/getInfo")
          rolesUser = roles
        }

        if (rolesUser && rolesUser.length > 0) {
          // check if it have the permission to access
          const rolesNeeded = to.meta && to.meta.roles
          if (rolesNeeded && rolesNeeded.length > 0) {
            const canAccess = checkPermission(rolesNeeded, rolesUser)
            if (!canAccess) {
              await store.dispatch("auth/logout")
              next(`/login?redirect=${to.path}`)
            } else {
              next()
            }
          } else {
            next()
          }
        } else {
          // remove token and go to login page to re-login
          await store.dispatch("auth/logout")
          next(`/login?redirect=${to.path}`)
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
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
