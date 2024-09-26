export const state = () => ({
  /**
   * {
   *   id: string;
   *   isFree: boolean;
   *   title: 'name',
   *   kind: 'EXHIBITION',
   *   roundId: [],
   *   prices: '10000',
   *   totalPrice: 50000
   * }
   */
  targetData: null,
  /**
   * {
   *   hanaBankUuid: '123456789',
   *   name: '장원준',
   *   email: 'jang@spadecompany.kr',
   *   phone: '01029354191'
   * }
   */
  hanaInfo: null,
  hanaQuery: null,
  isHanaPay: null
});

export const actions = {
  clearHanaStore({ commit }) {
    const commitNameList = ['setHanaQuery', 'setIsHanaPay', 'setHanaQuery', 'setHanaInfo'];

    commitNameList.forEach((name) => {
      commit(name, null);
    });
  }
};

export const getters = {
  getTargetData(state) {
    return state.targetData;
  },
  getIsHanaPay(state) {
    return state.isHanaPay;
  },
  getHanaQuery(state) {
    return state.hanaQuery;
  },
  getHanaInfo(state) {
    return state.hanaInfo;
  }
};

export const mutations = {
  setTargetData(state, data) {
    state.targetData = data;
  },
  setIsHanaPay(state, data) {
    state.isHanaPay = data;
  },
  setHanaQuery(state, data) {
    state.hanaQuery = data;
  },
  setHanaInfo(state, data) {
    state.hanaInfo = data;
  }
};
