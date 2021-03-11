import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
  audit: {
    module: 'Admin modulos'
  },
  formattedModuleData: [],
  defaultModulePermissions: [],
  modules: [],
  module: {
    id: '',
    dependencia: 0,
    nombre: '',
    descripcion: '',
    icon: 'note_add',
    estatus: 0
  },
  showModuleForm: false,
  updating: false
}

const getters = {
  allModules: state => state.modules,
  oneModule: state => state.module,
  showModuleForm: state => state.showModuleForm,
  updatingModule: state => state.updating,
  formattedModuleData: state => state.formattedModuleData,
  defaultModulePermissions: state => state.defaultModulePermissions
}

const actions = {
  //* *************************************[  GET  ]***************************************** */
  async fetchModules ({ commit, dispatch, getters }) {
    commit('setdataTableLoader', true)
    try {
      const response = await axios.get(window.resourceSrv + `modulos/`, getters.authHeader)
      commit('setModules', response.data.data)
      // MODULOS FORMATEADOS PARA EL SIDEBAR
      dispatch('setFormattedModuleData', response.data.data)
      // PERMISOS Y MODULOS POR DEFECTO
      dispatch('addDefaultModulePermissions', response.data.data)
      commit('setdataTableLoader', false)
    } catch (error) {
      console.log(error)
      commit('setdataTableLoader', false)
    }
  },
  //* *************************************[  POST  ]***************************************** */
  async createModule ({ commit, dispatch, getters }) {
    state.audit.action = 'Creó el modulo ' + state.module.nombre
    dispatch('showCircularPreloader', true)
    try {
      const response = await axios.post(
        window.resourceSrv + `modulos/`,
        state.module, getters.authHeader
      )
      commit(`addModule`, state.module)
      dispatch('resetModuleState')
      dispatch('auditLog', state.audit)
      dispatch('showCircularPreloader', false)
      Swal.fire({
        type: 'success',
        title: 'Modulo creado exitosamente',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.log(error)
      dispatch('showCircularPreloader', false)
      Swal.fire({
        type: 'error',
        title: `error ${error}`,
        showConfirmButton: false,
        timer: 1500
      })
    }
  },
  //* *************************************[  PATCH  ]***************************************** */
  async updateModule ({ commit, dispatch, getters }) {
 
    state.audit.action = 'Actualizó el modulo ' + state.module.nombre
    dispatch('showCircularPreloader', true)
    try {
      await axios.patch(
        window.resourceSrv + `modulos/${state.module.id}/`,
        getters.oneModule, getters.authHeader
      )

      // var index = getters.allModules.indexOf(getters.oneModule)

      // commit('setUpdatedModule', index)

      dispatch('resetModuleState')
      dispatch('auditLog', state.audit)
      dispatch('showCircularPreloader', false)
      Swal.fire({
        type: 'success',
        title: 'Modulo actualizado exitosamente',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.log(error)
      dispatch('showCircularPreloader', false)
      // Swal.fire({
      //   type: 'error',
      //   title: `error ${error}`,
      //   showConfirmButton: false,
      //   timer: 1500
      // })
    }
  },
  //* *************************************[  DELETE  ]***************************************** */
  async deleteModule ({ commit, dispatch, getters }) {
    state.audit.action = 'Eliminó el modulo ' + state.module.nombre
    dispatch('showCircularPreloader', true)
    try {
      await axios.delete(window.resourceSrv + `modulos/${state.module.id}`, getters.authHeader )

      dispatch('resetModuleState')
      dispatch('auditLog', state.audit)
      dispatch('showCircularPreloader', false)
      Swal.fire({
        type: 'success',
        title: 'Modulo eliminado exitosamente',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.log(error)
      dispatch('showCircularPreloader', false)
      Swal.fire({
        type: 'error',
        title: `error ${error}`,
        showConfirmButton: false,
        timer: 1500
      })
    }
  },
  setModuleEdit ({ commit }, module) {
    commit('setUpdatingModule', true)
    commit('setModule', module)
    commit('setModulesView', true)
  },
  changeModulesView ({ commit }, boolean) {
    commit('setModulesView', boolean)
    commit('resetModule')
  },
  resetModuleState ({ commit, dispatch }) {
    dispatch('fetchModules')
    commit('resetModule')
    commit('setUpdatingModule', false)
    commit('setModulesView', false)
  },
  setFormattedModuleData ({ commit, getters }, modules) {
    var parent = []
    var child = []

    // LE AGREGO EL VALOR DE LA RUTA Y LE AGREGO LOS PERMISOS DE ACCESO
    var newModules = []
    for (var i in modules) {
      var nombre = modules[i].nombre.toLowerCase()
      nombre = nombre.split(' ').join('_')
      modules[i] = { ...modules[i], route: `/${nombre}` }
      // Esto le coloca los permisos de acceso
      //* ********************** */
      for (
        var j = 0;
        j < getters.authUserSelectedCompany.permissions.length;
        j++
      ) {
        var permisos = getters.authUserSelectedCompany.permissions[j]
        if (modules[i].id === permisos.module_id) {
          modules[i].access = permisos.access === 1? true : false
        }
      }
      //* ********************** */
      newModules.push(modules[i])
    }

    for (var i = 0; i < newModules.length; i++) {
      newModules[i] = { ...newModules[i], child: [] }
      if (newModules[i].dependencia === 0) {
        parent.push(newModules[i])
      } else {
        child.push(newModules[i])
      }
    }

    var finalArray = []
    // CREA EL JSON COMPLEJO PARA EL SIDEBAR
    for (var i = 0; i < parent.length; i++) {
      for (var j = 0; j < child.length; j++) {
        if (child[j].dependencia === parent[i].id) {
          parent[i].child.push(child[j])
        } else {
          for (var x = 0; x < parent[i].child.length; x++) {
            if (child[j].dependencia === parent[i].child[x].id) {
              parent[i].child[x].child.push(child[j])
            }
          }
        }
      }
      finalArray.push(parent[i])
    }

    commit('addFormattedModuleData', finalArray)
  },

  addDefaultModulePermissions ({ commit }, data) {
    var array = []

    for (var i in data) {
      var module = data[i]
      var json = {
        module_id: module.id,
        nombre: module.nombre,
        action_access: 0,
        action_create: 0,
        action_retrieve: 0,
        action_list: 0,
        action_delete: 0,
        action_update: 0
      }
      array.push(json)
    }

    commit('setDefaultModulePermissions', array)
  }
}

const mutations = {
  setModulesView: (state, boolean) => (state.showModuleForm = boolean),
  setModules: (state, modules) => (state.modules = modules),
  setModule: (state, module) => (state.module = module),
  addModule: (state, module) => state.modules.push(module),
  resetModule: (state, module) =>
    (state.module = {
      id: '',
      dependencia: 0,
      nombre: '',
      descripcion: '',
      icon: '',
      estatus: 0
    }),
  setUpdatingModule: (state, boolean) => (state.updating = boolean),
  addFormattedModuleData: (state, modules) =>
    (state.formattedModuleData = modules),
  setDefaultModulePermissions: (state, modules) =>
    (state.defaultModulePermissions = modules),
  setUpdatedModule: (state, index) =>
    Object.assign(state.modules[index], state.module)
}

export default {
  state,
  getters,
  actions,
  mutations
}
