import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
  reports:[],
  report :null,
  trxType : null,
  showCalcReportForm: false,
  calcReport :{
    initDate:"",
    finalDate:"",
    projectId:'',
    paymentTime:"",
    trxType: "",
    trxId: ""
  }
}

const getters = {
  showCalcReportForm: state => state.showCalcReportForm,
  allTrxTypes : state => state.trxType,
  oneCalcReport : state => state.calcReport
}

const actions = {
  //* **************************************[ GET ]************************************************* */
  async fetchTrxType({commit, getters}){
    try{

      const response = await axios.get(
        window.resourceSrv + `tipo_trx/`,
        getters.authHeader
      )

        commit('setTrxTypes', response.data.data)

    }catch(error){
      console.log(error)
    }

  },
  renderCalcReportForm ({ commit }, boolean) {
    commit('setShowCalcReportForm', boolean)
  },
  resetCalcReportState({commit}){
    commit('resetCalcReportState')
    commit('setShowCalcReportForm', false)
  }
}

const mutations = {
  setShowCalcReportForm: (state , boolean) => (state.showCalcReportForm = boolean),
  setTrxTypes: (state,data) => (state.trxType = data),
  resetCalcReportState: (state) =>(state.calcReport = {
    initDate:"",
    finalDate:"",
    projectId:'',
    paymentTime:"",
    trxType: "",
    trxId: ""
  })
}

export default {
  state,
  getters,
  actions,
  mutations
}
