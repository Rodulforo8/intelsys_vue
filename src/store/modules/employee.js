import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
    audit: {
        module: 'Empleados'
    },
    employees: [],
    employee: {
        proyecto_id: '',
        ecedula: '',
        refnumemple: '',
        efac: '',
        eprovincia: '',
        esub: '',
        etipoemple: '',
        ehex: '',
        estatus: '',
        edepto: '',
        ecargo: '',
        etipopag: '',
        esalario: '',
        ebh: '',
        enombre: '',
        eapellido1: '',
        eapellido2: '',
        eapellidoc: '',
        ehxperiodo: '',
        edv: '',
        eperiodo: '',
        eperx: 0,
        ecorreo: '',
        ecss: '',
        ecprelaborada: '',
        eir: '',
        eviati: '',
        eanexo03: '',
        esin: '',
        ecomisi: '',
        eprimap: '',
        enss: '',
        esexo: '',
        ediav: '',
        emesv: '',
        eanouv: '',
        eacumprp: '',
        eacumtsa: '',
        eacumtva: '',
        eacumtvi: '',
        eacumtco: '',
        eacumtxiii: '',
        eacumgr: '',
        eacumss: '',
        eacumvac: '',
        eacumxiii: '',
        eacumse: '',
        eacumre: '',
        eacumbru: '',
        eirm: '',
        eacumcom: '',
        eprimap: '',
        eviaticos: '',
        esin: '',
        eesvac: '',
        efentrada: '',
        efcontrato: '',
        efvencecont: '',
        ecivil: '',
        edependient: '',
        eclaveir: '',
        efechanac: '',
        eanouv: '',
        eformapag: '',
        efecucom: '',
        enoctaban: '',
        enoctaba1: '',
        ecalyear: '',
        ecalmes: '',
        ecalper: '',
        descue: 'string'
    },
    showEmployeeForm: false,
    employeeCountryLoader: false,
    employeeProyectLoader: false,
    employeeStepperValue: 1,
    updating: false
}

const getters = {
    allEmployees: state => state.employees,
    oneEmployee: state => state.employee,
    showEmployeeForm: state => state.showEmployeeForm,
    updatingEmployee: state => state.updating,
    oneEmployee: state => state.employee,
    employeeStepperValue: state => state.employeeStepperValue,
    employeeCountryLoader: state => state.employeeCountryLoader,
    employeeProyectLoader: state => state.employeeProyectLoader
}

const actions = {
    setEmployeeCountryLoader({ commit }, bool) {
        commit('changeEmployeeCountryLoader', bool)
    },
    setEmployeeProyectLoader({ commit }, bool) {
        commit('changeEmployeeProyectLoader', bool)
    },
    //* *************************************[  GET  ]***************************************** */
    async fetchEmployees({ commit, getters }) {
        try {
            const response = await axios.get(
                window.resourceSrv +
                `empleados_por_compania/${getters.authUserSelectedCompany.id}/`,
                getters.authHeader
            )
            commit('setEmployees', response.data.data)
            commit('setdataTableLoader', false)
        } catch (error) {
            commit('setEmployees', [])
        }
    },
    async fetchEmployeeProvince({ commit, getters }) {
        try {
            const response = await axios.get(
                window.resourceSrv +
                `company/${getters.authUserSelectedCompany.id}/`,
                getters.authHeader
            )

            commit('setEmployeeProvince', response.data.data)

        } catch (error) {
            commit('setEmployees', [])
        }
    },
    //* *************************************[  POST  ]***************************************** */
    async createEmployee({ commit, getters, dispatch }, employee) {
        state.audit.action = 'Creó un empleado'
        dispatch('showCircularPreloader', true)
        try {
            await axios.post(
                window.resourceSrv + `empleados/`,
                employee,
                getters.authHeader
            )

            dispatch('resetEmployeeState')
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Empleado creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'Algo salio mal',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* *************************************[  PATCH  ]***************************************** */
    async updateEmployee({ commit, getters, dispatch }, employee) {
        state.audit.action = 'Actualizó un empleado'
        dispatch('showCircularPreloader', true)

        try {

            employee.descue = 'S'
            await axios.patch(
                window.resourceSrv + `empleados/${employee.id}/`,
                employee,
                getters.authHeader
            )

            dispatch('resetEmployeeState')
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Empleado actualizado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            console.log(error)
            Swal.fire({
                type: 'error',
                title: 'Algo salio mal',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* **********************************[  DELETE  ]***************************************** */
    async deleteEmployee({ commit, getters, dispatch }, id) {
        state.audit.action = 'Eliminó un empleado'
        dispatch('showCircularPreloader', true)
        try {

            await axios.delete(
                window.resourceSrv + `empleados/${id}`, getters.authHeader
            )

            dispatch('resetEmployeeState')
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Empleado eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'Algo salio mal',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    changeEmployeeView({ commit }, boolean) {
        commit('setEmployeeView', boolean)
    },
    employeeStepFoward({ commit, getters }) {
        var value = getters.employeeStepperValue
        value = value + 1
        commit('setStepValue', value)
    },
    employeeStepBackward({ commit, getters }) {
        var value = getters.employeeStepperValue
        value = value - 1
        commit('setStepValue', value)
    },

    //* ***************************************[STEP ONE - PERSONAL DATA]************************************************/
    async fetchDepartmentData({ getters, dispatch }) {
        const foundedCompany = await axios.get(
            window.resourceSrv + `company/${getters.authUserSelectedCompany.id}`,
            getters.authHeader
        )
        await dispatch('fetchProvinces', foundedCompany.data.data.cpais_id)
    },
    addEmployeePersonalData({ commit }, data) {
        commit('setEmployeePersonalData', data)
    },
    //* *************************************************************************************************************** */
    async updatingEmployeeData({ commit, getters, dispatch }, id) {
        dispatch('showCircularPreloader', true)
        try {

            const response = await axios.get(
                window.resourceSrv + `empleados/${id}/`,
                getters.authHeader
            )
            commit('setUpdatingEmployeeData', response.data.data)
            commit('setUpdatingEmployee', true)
            commit('setEmployeeView', true)
            dispatch('showCircularPreloader', false)
        } catch (error) {
            dispatch('showCircularPreloader', false)
            console.log(error)
            Swal.fire({
                type: 'error',
                title: 'Algo salio mal',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    resetEmployeeState({ commit, dispatch }) {
        commit('setStepValue', 1)
        commit('resetEmployeeData')
        commit('setUpdatingEmployee', false)
        commit('setEmployeeView', false)
        dispatch('fetchEmployees')
    }
}

const mutations = {
    changeEmployeeCountryLoader: (state, bool) => (state.employeeCountryLoader = bool),
    changeEmployeeProyectLoader: (state, bool) => (state.employeeProyectLoader = bool),
    setEmployees: (state, employees) => (state.employees = employees),
    setEmployeeView: (state, boolean) => (state.showEmployeeForm = boolean),
    setUpdatingEmployee: (state, boolean) => (state.updating = boolean),
    setStepValue: (state, value) => (state.employeeStepperValue = value),
    setEmployeePersonalData: (state, data) => (state.employeePersonalData = data),
    setUpdatingEmployeeData: (state, data) => (state.employee = data),
    resetEmployeeData: (state) => (state.employee = {
        proyecto_id: '',
        ecedula: '',
        refnumemple: '',
        efac: '',
        eprovincia: '',
        esub: '',
        etipoemple: '',
        ehex: '',
        estatus: '',
        edepto: '',
        ecargo: '',
        etipopag: '',
        esalario: '',
        ebh: '',
        enombre: '',
        eapellido1: '',
        eapellido2: '',
        eapellidoc: '',
        ehxperiodo: '',
        edv: '',
        eperiodo: '',
        eperx: 0,
        ecorreo: '',
        ecss: '',
        ecprelaborada: '',
        eir: '',
        eviati: '',
        eanexo03: '',
        esin: '',
        ecomisi: '',
        eprimap: '',
        enss: '',
        esexo: '',
        ediav: '',
        emesv: '',
        eacumprp: '',
        eacumtsa: '',
        eacumtva: '',
        eacumtvi: '',
        eacumtco: '',
        eacumtxiii: '',
        eacumgr: '',
        eacumss: '',
        eacumvac: '',
        eacumxiii: '',
        eacumse: '',
        eacumre: '',
        eacumbru: '',
        eirm: '',
        eacumcom: '',
        eprimap: '',
        eviaticos: '',
        esin: '',
        eesvac: '',
        efentrada: '',
        efcontrato: '',
        efvencecont: '',
        ecivil: '',
        edependient: '',
        eclaveir: '',
        efechanac: '',
        eanouv: '',
        eformapag: '',
        efecucom: '',
        enoctaban: '',
        enoctaba1: '',
        ecalyear: '',
        ecalmes: '',
        ecalper: ''
    })
}

export default {
    state,
    getters,
    actions,
    mutations
}