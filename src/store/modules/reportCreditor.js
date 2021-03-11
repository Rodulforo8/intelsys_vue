import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
  reports: [],
  showForm: false,
  updating: false,
  report: {
    raproyec: '',
    raacre: '',
    raeriododec: '',
    radesde: '',
    rahasta: '',
    ranpresta: '',
    radeduc: '',
    raemcode: ''
  }
}

const getters = {
  oneReportCreditor: state => state.report,
  showReportCreditorForm: state => state.showForm
}

const actions = {
  //* *************************************[  GET  ]***************************************** */
  async fetchCreditorReport ({ commit }) {
    try {
    } catch (error) {}
  },
  renderReportCreditorForm ({ commit }, boolean) {
    commit('setCreditorReportView', boolean)
  },
  resetReportCreditorState ({ commit, dispatch }) {
    commit('resetReportCreditorVariable')
    commit('setCreditorReportView', false)
    dispatch('resetCompanyProjects')
   
  }
}

const mutations = {
  setCreditorReportView: (state, boolean) => (state.showForm = boolean),
  resetReportCreditorVariable: state =>
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
