export const state = () => ({
  /**
   * {
   *  name: string;
   *  phone: boolean;
   *  password: number;
   * } | null
   */
  userData: null,
  /**
   * {
   *   message: 'code',
   *   nonce: '20230728173745875',
   *   mac: 'vTb1GW5qJn+XF6GO8+QvNHw0igZqG5crZczmtgteXmU=',
   * }
   */
  hanaQueryData: null,
  /**
   * {
   *   hanaBankUuid: '123456789',
   *   name: '장원준',
   *   email: 'jang@spadecompany.kr',
   *   phone: '01029354191'
   * }
   */
  hanaDecryptData: null,
  // kind: "NON_MEMBER" | "HANA" | null
  kind: null
});

export const actions = {
  clearState({ commit }) {
    commit('setUserData', null);
    commit('setHanaQueryData', null);
    commit('setHanaDecryptData', null);
    commit('setKind', null);
  }
};

export const getters = {
  getUserData(state) {
    return state.userData;
  },
  getHanaQueryData(state) {
    return state.hanaQueryData;
  },
  getHanaDecryptData(state) {
    return state.hanaDecryptData;
  },
  getKind(state) {
    return state.kind;
  }
};

export const mutations = {
  setUserData(state, data) {
    state.userData = data;
  },
  setHanaQueryData(state, data) {
    state.hanaQueryData = data;
  },
  setHanaDecryptData(state, data) {
    state.hanaDecryptData = data;
  },
  setKind(state, data) {
    state.kind = data;
  }
};
