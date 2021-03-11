import axios from 'axios'
import router from '../router'
const state = {
  drawer: true,
  countries: [],
  provinces: [],
  provinceLoader: false,
  groups: [],
  circularPreloader: false,
  dataTableLoader: true,
  sidebarData: []
}

const getters = {
  drawer: state => state.drawer,
  allCountries: state => state.countries,
  allProvinces: state => state.provinces,
  provinceLoader: state => state.provinceLoader,
  dataTableLoader: state => state.dataTableLoader,
  allGroups: state => state.groups,
  circularPreloader: state => state.circularPreloader
}

const actions = {
  showCircularPreloader ({ commit, dispatch }, bool) {
    commit('setCircularPreloader', bool)
  },
  changeDrawer ({ commit }) {
    commit('setDrawer')
  },
  async fetchCountries ({ commit, getters }) {
    const response = await axios.get(
      window.resourceSrv + 'pais',
      getters.authHeader
    )
    commit('setCountries', response.data.data)
  },
  async fetchProvinces ({ commit, getters }, id) {
    commit('setProvinceLoader', true)
    try {
      const response = await axios.get(
        window.resourceSrv + `obtener_provincias_por_pais/${id}`,
        getters.authHeader
      )
      commit('setProvinces', response.data.data.provincias)
      commit('setProvinceLoader', false)
    } catch (error) {
      console.log(error)
      commit('setProvinceLoader', false)
    }
  },
  async fetchGroups ({ commit, getters }) {
    const response = await axios.get(
      window.resourceSrv + 'agrupacion/',
      getters.authHeader
    )
    commit('setGroups', response.data.data)
  },
  // async sayHello ({ getters }) {

    
  //   // var token = localStorage.getItem('token')

  //   var header = {
  //     Authorization: `Bearer ` + localStorage.getItem('token')
  //   }
  //   console.log(header)
  //   const response = await axios.get(window.resourceSrv + `say_hello/`, header)
  //   console.log(response)
  // },
  resetProvinces ({ commit }) {
    commit('setProvinces', [])
  }
}

const mutations = {
  setDrawer: state => (state.drawer = !state.drawer),
  setCountries: (state, countries) => (state.countries = countries),
  setProvinces: (state, provinces) => (state.provinces = provinces),
  setGroups: (state, groups) => (state.groups = groups),
  setCircularPreloader: (state, bool) => (state.circularPreloader = bool),
  setProvinceLoader: (state, boolean) => (state.provinceLoader = boolean),
  setdataTableLoader: (state, boolean) => (state.dataTableLoader = boolean)
}

export default {
  state,
  getters,
  actions,
  mutations
}
