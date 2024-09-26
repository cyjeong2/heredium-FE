export const state = () => ({
  accessToken: null,
  userInfo: null,
  adminAccessToken: null,
  adminUserInfo: null
});

export const actions = {
  userLogout({ commit }) {
    commit('setAccessToken', null);
    commit('setUserInfo', null);
  },
  adminLogout({ commit }) {
    commit('setAdminAccessToken', null);
    commit('setAdminUserInfo', null);
  }
};

export const getters = {
  getAccessToken(state) {
    return state.accessToken;
  },
  getUserInfo(state) {
    return state.userInfo;
  },
  getAdminAccessToken(state) {
    return state.adminAccessToken;
  },
  getAdminUserInfo(state) {
    return state.adminUserInfo;
  }
};

export const mutations = {
  setAccessToken(state, token) {
    state.accessToken = token;
  },
  setUserInfo(state, data) {
    state.userInfo = data;
  },
  setAdminAccessToken(state, token) {
    state.adminAccessToken = token;
  },
  setAdminUserInfo(state, data) {
    state.adminUserInfo = data;
  }
};
