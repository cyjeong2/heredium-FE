export const state = () => ({
  isAgreeDone: false,
  /**
   * {
   *  id: string;
   *  isFree: boolean;
   *  kind: "EXHIBITION" | "PROGRAM"
   *  prices: { id: number; number: number; }[]
   *  roundId: number;
   *  totalPrice: number;
   * }
   */
  payTargetData: null
});

export const actions = {
  clearState({ commit }) {
    commit('setIsAgreeDone', false);
    commit('setPayTargetData', null);
  }
};

export const getters = {
  getIsAgreeDone(state) {
    return state.isAgreeDone;
  },
  getPayTargetData(state) {
    return state.payTargetData;
  }
};

export const mutations = {
  setIsAgreeDone(state, data) {
    state.isAgreeDone = data;
  },
  setPayTargetData(state, data) {
    state.payTargetData = data;
  }
};
