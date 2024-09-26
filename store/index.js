export const state = () => ({
  BASE_URL: process.env.OBJECT_STORAGE_URL,
  HALL_LIST: ['A', 'B'],
  deviceInfo: {
    isPC: false,
    isMobile: false,
    isApp: false,
    isIOS: false,
    isAndroid: false
  },
  isHasBottomMenu: false
});

export const actions = {
  async nuxtServerInit({ dispatch, commit, getters, $axios }, { route, redirect }) {}
};

export const getters = {};

export const mutations = {
  setDeviceInfo(state, info) {
    state.deviceInfo = info;
  },
  setIsHasBottomMenu(state, isHasMenu) {
    state.isHasBottomMenu = isHasMenu;
  }
};
