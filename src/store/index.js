import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    totalNums: 0
  },
  mutations: {
    setTotal(state,num){
      state.totalNums = num
    },
    addTotal(state,num){
      state.totalNums += num
    }
  },
  actions: {
  },
  modules: {
  }
})
