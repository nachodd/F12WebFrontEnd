import router from "src/router";
import store from "src/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "src/utils/auth";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles =
        store.getters("auth/roles") && store.getters("auth/roles").length > 0;
      if (hasRoles) {
        next();
      } else {
        // remove token and go to login page to re-login
        await store.dispatch("user/resetToken");
        next(`/login?redirect=${to.path}`);
        NProgress.done();

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
          NProgress.done();
        } */
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
