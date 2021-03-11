import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
  modulePermission: {
    list: null,
    create: null,
    update: null,
    deletes: null
  }
}

const getters = {
  permissionVariables: state => state.modulePermission
}

const actions = {
  //* **************************************[ GET ]************************************************* */
  async setPermissionsVariables ({ commit, getters, dispatch } , permissions) {
    dispatch('showCircularPreloader', true)
    var retrieve
    var access
    var list
    var create
    var update
    var deletes

    if (getters.authUserData.super || permissions.list > 0) {
      list = true
    } else {
      list = false
    }

    if (getters.authUserData.super || permissions.create > 0) {
      create = true
    } else {
      create = false
    }

    if (getters.authUserData.super || permissions.update > 0) {
      update = true
    } else {
      update = false
    }

    if (getters.authUserData.super || permissions.delete > 0) {
      deletes = true
    } else {
      deletes = false
    }

    if (getters.authUserData.super || permissions.access > 0) {
      access = true
    } else {
      access = false
    }

    if (
      getters.authUserData.super ||
      permissions.retrieve > 0
    ) {
      retrieve = true
    } else {
      retrieve = false
    }

    const data = {
      list: list,
      create: create,
      update: update,
      delete: deletes,
      retrieve: retrieve,
      access: access
    }

    await commit('setPermissionVariables', data)
    dispatch('showCircularPreloader')
  }
}

const mutations = {
  setPermissionVariables: (state, data) => (state.modulePermission = data)
}

export default {
  state,
  getters,
  actions,
  mutations
}
