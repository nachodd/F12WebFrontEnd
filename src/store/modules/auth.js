import { login, logout, getInfo } from "src/api/user";
import { getToken, setToken, removeToken } from "src/utils/auth";
import { resetRouter } from "src/router";
// import axios from "axios";
// import Cookies from "js-cookie";
// import * as types from "../mutation-types";

// state
const state = {
  token: getToken(),
  user: null,
  roles: []
};

// getters
const getters = {
  token: state => state.token,
  user: state => state.user,
  roles: state => state.roles,
  check: state => state.user !== null
};

// mutations
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

// actions
const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { email, password } = userInfo;
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await login(userInfo);
        commit("SET_TOKEN", data.token);
        setToken(data.token);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await getInfo(state.token);
        if (!data) {
          reject("Verification failed, please Login again.");
        }
        const { roles, user } = data;
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject("getInfo: roles must be a non-null array!");
        }

        commit("SET_ROLES", roles);
        commit("SET_USER", user);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        await logout(state.token);
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        removeToken();
        resetRouter();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  }

  // Dynamically modify permissions
  /* changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });
      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      resolve();
    });
  } */
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
