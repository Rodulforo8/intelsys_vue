import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
  reports: [],
  showForm: false,
  updating: false,
  report: {
    reproyec: '',
    reacre: '',
    reperiododec: '',
    erdesde: '',
    erhasta: '',
    ernpresta: '',
    erdeduc: '',
    eremcode: ''
  }
}

const getters = {
  oneReportEmployee: state => state.report,
  showReportEmployeeForm: state => state.showForm
}

const actions = {
  //* *************************************[  GET  ]***************************************** */
  async fetchEmployeeReport ({ commit }) {
    try {
    } catch (error) {}
  },
  renderReportEmployeeForm ({ commit }, boolean) {
    commit('setEmployeeReportView', boolean)
  },
  resetReportEmployeeState ({ commit, dispatch }) {
    commit('resetReportEmployeeVariable')
    commit('setEmployeeReportView', false)
    dispatch('resetCompanyProjects')
   
  }
}

const mutations = {
  setEmployeeReportView: (state, boolean) => (state.showForm = boolean),
  resetReportEmployeeVariable: state =>
    (state.report = {
      reproyec: '',
      reacre: '',
      reperiododec: '',
      erdesde: '',
      erhasta: '',
      ernpresta: '',
      erdeduc: '',
      eremcode: ''
    })
}

export default {
  state,
  getters,
  actions,
  mutations
}
