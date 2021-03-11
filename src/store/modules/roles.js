import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
    audit: {
        module: 'Roles'
    },
    roles: [],
    role: {
        id: null,
        nombre: null,
        permisos: []
    },
    aditionalPermissions: [],
    updatedPermissions: [],
    showRoleForm: false,
    updating: false
}

const getters = {
    allRoles: state => state.roles,
    roleName: state => state.role.nombre,
    oneRole: state => state.role,
    showRoleForm: state => state.showRoleForm,
    updatingRole: state => state.updating,
    aditionalPermissions: state => state.aditionalPermissions,
    updatedPermissions: state => state.updatedPermissions
}

const actions = {
    //* *************************************[  GET  ]***************************************** */
    async fetchRoles({ commit, getters }) {
        try {
            const response = await axios.get(
                window.resourceSrv +
                `roles_de_compania/${getters.authUserSelectedCompany.id}/`, getters.authHeader
            )

            commit('setRoles', response.data.data)
            commit('setdataTableLoader', false)
        } catch (error) {

            commit('setdataTableLoader', false)
            commit('setRoles', [])
                //  if (error.response.status === 404) {
                //     commit('setRoles', [])
                //   }
        }
    },
    async fetchLocalizeRoles({ commit, getters }, id) {
        try {
            const response = await axios.get(
                window.resourceSrv +
                `roles_de_compania/${id}/`, getters.authHeader
            )

            commit('setRoles', response.data.data)
            commit('setdataTableLoader', false)
        } catch (error) {

            commit('setdataTableLoader', false)
            commit('setRoles', [])
                //  if (error.response.status === 404) {
                //     commit('setRoles', [])
                //   }
        }
    },
    //* *************************************[  POST  ]***************************************** */
    async createRole({ commit, dispatch, getters }) {
        state.audit.action = 'Creó el rol ' + state.role.nombre
        dispatch('showCircularPreloader', true)

        try {
            const response = await axios.post(
                'http://165.22.44.163:9100/roles/',
                state.role, getters.authHeader
            )

            var bodyFormData = new FormData()

            bodyFormData.set('role_id', response.data.data.id)
            bodyFormData.set('company_id', getters.authUserSelectedCompany.id)

            await axios.post(
                window.resourceSrv + `relacion_compania_roles/`,
                bodyFormData, getters.authHeader
            )

            commit('addRole', response.data.data)
            dispatch('resetRoleState')
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Rol creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            if (error.response.status === 400) {
                dispatch('addRoleName', '')
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: 'Ya existe un rol con este nombre!'
                })
            } else {
                Swal.fire('Error de comunicacion con el servidor (roles)', '', 'error')
            }
        }
    },
    //* *************************************[  PATCH, POST, UPDATE ]***************************************** */
    async updateRole({ commit, dispatch, getters }) {
        state.audit.action = 'Actualizó el rol ' + state.role.nombre
        dispatch('showCircularPreloader', true)
        try {
            state.role.permisos = []

            await axios.patch(
                `http://165.22.44.163:9100/roles/${state.role.id}/`,
                state.role, getters.authHeader
            )

            if (state.updatedPermissions.length > 0) {
                await axios.put(
                    window.resourceSrv + `permisos_en_lote/`,
                    state.updatedPermissions, getters.authHeader
                )
            }

            // if (state.aditionalPermissions.length > 0) {
            //   state.aditionalPermissions = {
            //     ...state.aditionalPermissions,
            //     roles_id: state.role.id
            //   }

            //   const response = await axios.put(
            //     window.resourceSrv + `permisos_en_lote/`,
            //     state.aditionalPermissions
            //   )
            //   console.log(response)
            // }

            dispatch('resetRoleState')
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
                // Refresco los permisos de usuario
                //* ********Refresco Sidebar******** */
            dispatch('fetchUserPermissions')
                //* ******************************* */
            Swal.fire({
                type: 'success',
                title: 'Rol actualizado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
                // if (error.response.status === 400) {
                //   dispatch('fetchRoles')

            //   Swal.fire({
            //     type: 'error',
            //     title: 'Error',
            //     text: 'Ya existe un rol con este nombre!'
            //   })
            // } else {
            //   Swal.fire('Error de comunicacion con el servidor', '', 'error')
            // }
        }
    },
    //* *************************************[  DELETE  ]***************************************** */
    async deleteRole({ commit, dispatch, getters }) {
        state.audit.action = 'Eliminó el rol ' + state.role.nombre
        dispatch('showCircularPreloader', true)
        try {
            const response = await axios.delete(
                `http://165.22.44.163:9100/roles/${state.role.id}/`, getters.authHeader
            )
            dispatch('fetchUserPermissions')
            dispatch('resetRoleState')
            dispatch('auditLog', state.audit)
            commit('removeRole', state.role.id)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Rol eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            Swal.fire('Error de comunicacion con el servidor (roles)', '', 'error')
            dispatch('showCircularPreloader', false)
        }
    },
    addRole({ commit }, role) {
        commit('setRole', role)
    },
    addPermissions({ commit }, permisos) {
        if (state.updating) {
            var bool = false

            for (var i in state.role.permisos) {
                if (state.role.permisos[i].id === permisos.id) {
                    bool = true
                    break
                }
            }

            if (bool) {
                // ingresar en que se esta actualizando
                var index = state.updatedPermissions.indexOf(permisos)
                if (index !== -1) {
                    Object.assign(state.updatedPermissions[index], permisos)
                } else {
                    commit('setUpdatingPermission', permisos)
                }
            } else {
                // ingresar que se esta agregando uno nuevo
                var index = state.aditionalPermissions.indexOf(permisos)
                if (index !== -1) {
                    Object.assign(state.aditionalPermissions[index], permisos)
                } else {
                    commit('setAditionalPermission', permisos)
                }
            }
        } else {
            // SI NO ESTA ACTUALIZANDO
            var index = state.role.permisos.indexOf(permisos)
            if (index !== -1) {
                Object.assign(state.role.permisos[index], permisos)
            } else {
                commit('setPermission', permisos)
            }
        }
    },
    changeRoleView({ commit }, boolean) {
        commit('setRoleView', boolean)
    },
    changeUpdatingRole({ commit }, boolean) {
        commit('setUpdatingRole', boolean)
    },
    // SET UPDATE ROLE
    updatingRoleData({ commit, dispatch }, role) {
        commit('setUpdatingRoleData', role)
        commit('setUpdatingRole', true)
        commit('setRoleView', true)
    },
    resetRoleState({ commit, dispatch }) {
        dispatch('fetchRoles')
        commit('resetRole')
        commit('setRoleView', false)
        commit('resetAditionalPermissions')
        commit('resetpdatingPermissions')
        commit('setUpdatingRole', false), commit('setUpdatingRole', false)
    }
}

const mutations = {
    setRoles: (state, roles) => (state.roles = roles),
    addRole: (state, role) => state.roles.push(role),
    setRole: (state, role) => (state.role = role),
    setRoleView: (state, boolean) => (state.showRoleForm = boolean),
    setUpdatingRole: (state, boolean) => (state.updating = boolean),
    setUpdatingRoleData: (state, role) => (state.role = role),
    removeRole: (state, id) =>
        (state.roles = state.roles.filter(role => role.id !== id)),
    resetRole: (state, role) =>
        (state.role = {
            id: null,
            nombre: null,
            permisos: []
        }),
    resetAditionalPermissions: state => (state.aditionalPermissions = []),
    resetpdatingPermissions: state => (state.updatedPermissions = []),
    setPermission: (state, permisos) => state.role.permisos.push(permisos),
    setAditionalPermission: (state, permisos) =>
        state.aditionalPermissions.push(permisos),
    setUpdatingPermission: (state, permisos) =>
        state.updatedPermissions.push(permisos)
}

export default {
    state,
    getters,
    actions,
    mutations
}