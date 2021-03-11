import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
  audits: []
}

const getters = {
  allAudits: state => state.audits
}

const actions = {
  //* **************************************[ GET ]************************************************* */
  async fetchAllAudits ({ commit, getters }) {
    commit('setdataTableLoader', true)
    try {
      const response = await axios.get(window.resourceSrv + 'auditoria/', getters.authHeader)
      commit('setAudits', response.data.data)
      commit('setdataTableLoader', false)
    } catch (error) {
      console.log(error)
      commit('setdataTableLoader', false)
      Swal.fire({
        type: 'error',
        title: 'Error de comunicacion con el servidor (auditoiarsdap\
          sds',
        showConfirmButton: false,
        timer: 1500
      })
    }
  },
  //* **********************************[ POST ]************************************************* */
  async auditLog ({ commit, getters }, data) {
    try {
      const auditPayload = {
        user_id: getters.authUserData.user_id,
        username: getters.authUserData.username,
        module: data.module,
        action: data.action
      }
      const response = await axios.post(
        window.resourceSrv + 'auditoria/',
        auditPayload, getters.authHeader
      )
      console.log('audit logged')
    } catch (error) {
      console.log(error)
      Swal.fire({
        type: 'error',
        title: 'Error de comunicacion con el servidor audit store (audits)',
        showConfirmButton: false,
        timer: 1500
      })
    }
  },
  //* **************************************[ GET ]************************************************* */
  async filterAudits ({ commit, getters }, payload) {
    try {
      const response = await axios.post(
        window.resourceSrv + `auditoria_con_filtros/`,
        payload, getters.authHeader
      )

      commit('setAudits', response.data.data)
    } catch (error) {
      console.log(error.response.status)
      if (error.response.status === 404) {
        commit('setAudits', [])
      }
    }
  }
}

const mutations = {
  setAudits: (state, audits) => (state.audits = audits)
}

export default {
  state,
  getters,
  actions,
  mutations
}
