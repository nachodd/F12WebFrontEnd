// import NProgress from "nprogress"
// import "nprogress/nprogress.css"
import { getToken } from "src/utils/auth"
import { checkPermission } from "src/utils/permission"

// NProgress.configure({ showSpinner: false })

const whiteList = ["/login"] // no redirect whitelist

// leave the export, even if you don't use it
export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    // start progress bar
    // NProgress.start()

    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
      //if (store.getters["auth/check"]) {
      if (to.path === "/login") {
        // if is logged in, redirect to the home page
        next({ path: "/inicio" })
        // NProgress.done()
      } else {
        let rolesUser = store.getters["auth/roles"]
        /* && store.getters["auth/roles"].length > 0 */

        // determine whether the user has obtained his permission roles through getInfo
        if (!rolesUser) {
          const aux = await store.dispatch("auth/getInfo")
          rolesUser = aux.roles
        }

        if (rolesUser) {
          debugger
          const rolesNeeded = to.meta && to.meta.roles
          if (rolesNeeded && rolesNeeded.length > 0) {
            const canAccess = checkPermission(rolesNeeded, rolesUser)
            if (!canAccess) {
              await store.dispatch("auth/resetToken")
              next(`/login?redirect=${to.path}`)
            } else {
              next()
            }
          } else {
            next()
          }
        } else {
          // remove token and go to login page to re-login
          await store.dispatch("auth/resetToken")
          next(`/login?redirect=${to.path}`)
          // NProgress.done()

          /* try {
            // get user info
            // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
            const { roles } = await store.dispatch("auth/getInfo");
            // generate accessible routes map based on roles
            const accessRoutes = await store.dispatch(
              "permission/generateRoutes",
              roles
            );
            // dynamically add accessible routes
            router.addRoutes(accessRoutes);
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true });
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch("user/resetToken");
            Message.error(error || "Has Error");
            next(`/login?redirect=${to.path}`);
            // NProgress.done();
          } */
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
        // NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    // NProgress.done()
  })
}
