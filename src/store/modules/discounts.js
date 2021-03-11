import axios from 'axios'
const Swal = require("sweetalert2");

const state = {
    showDiscountForm: false,
    discounts: [],
    deductionTypes: [],
    discount: {
        deidproy: 0,
        // decedula: "string",
        empleado_id: 0,
        acreedor_id: 0,
        refprestamo: "",
        demontoini: "",
        depagado: "",
        desaldo: "",
        defini: "",
        destatus: "",
        detipodeduc: "",
        demontopla: "0",
        deporcentaje: "0",
        dedic: "",
        monp1: "0",
        monp2: "0",
        monp3: "0",
        monp4: "0",
        deendeci: "string",
        defechadesc: "",
        agrupacion_id: 0
    },
    updating: false
}

const getters = {
    showDiscountForm: state => state.showDiscountForm,
    allDeductionTypes: state => state.deductionTypes,
    allDiscounts: state => state.discounts,
    oneDiscount: state => state.discount,
    updatingDiscount: state => state.updating,
}

const actions = {
    //********************************************[ GET ]************************************************/
    async fetchDeductionTypes({ commit, getters }) {
        try {

            const response = await axios.get(window.resourceSrv + `tipo_deduccion/`, getters.authHeader)

            commit('setDeductionTypes', response.data.data)

        } catch (error) {
            console.log(error)
        }

    },
    async fetchAllDiscounts({ commit, getters }) {
        try {

            const response = await axios.get(
                window.resourceSrv + `descuentos_por_compania/${getters.authUserSelectedCompany.id}`,
                getters.authHeader
            )

            commit('setDiscounts', response.data.data)

        } catch (error) {
            console.log(error)
        }
    },
    //********************************************[ POST ]************************************************/
    async createDiscount({ commit, getters }, discount) {
        try {
            // console.log(getters.authHeader)

            const response = await axios.post(
                window.resourceSrv + `descuento/`,
                discount,
                getters.authHeader
            )

            commit('addDiscount', response.data.data)
            commit('setDiscountView', false)
            Swal.fire({
                type: 'success',
                title: 'Descuento creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
        }
    },
    //********************************************[ PATCH ]************************************************/
    async updateDiscount({ commit, getters }, discount) {
        try {
            // console.log(getters.authHeader)

            const response = await axios.patch(
                window.resourceSrv + `descuento/${discount.id}`,
                discount,
                getters.authHeader
            )

            Swal.fire({
                type: 'success',
                title: 'Descuento actualizado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
        }
    },
    //********************************************[ DELETE ]************************************************/
    async deleteDiscount({ commit, getters }, id) {
        try {
            // console.log(getters.authHeader)

            const response = await axios.post(
                window.resourceSrv + `descuento/${id}`,
                getters.authHeader
            )


            Swal.fire({
                type: 'success',
                title: 'Descuento eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
        }
    },
    updatingDiscountData({ commit }, discount) {
        commit('setUpdatingDiscount', true)
        commit('setDiscountView', true)
        commit('setDiscount', discount)
    },
    changeDiscountView({ commit }, boolean) {
        commit('setDiscountView', boolean)
    },
    resetDiscountState({ commit }) {
        commit('setUpdatingDiscount', false)
        commit('setDiscountView', false)
        commit('resetDiscount')
    }
}

const mutations = {
    setDiscountView: (state, boolean) => (state.showDiscountForm = boolean),
    setDeductionTypes: (state, data) => (state.deductionTypes = data),
    setDiscounts: (state, data) => (state.discounts = data),
    setDiscount: (state, data) => (state.discount = data),
    addDiscount: (state, data) => (state.discounts.push(data)),
    setUpdatingDiscount: (state, boolean) => (state.updating = boolean),
    resetDiscount: (state, data) => (state.discount = {
        deidproy: "",
        empleado_id: "",
        acreedor_id: "",
        refprestamo: "",
        demontoini: "",
        depagado: "",
        desaldo: "",
        defini: "",
        destatus: "",
        detipodeduc: "",
        demontopla: "0",
        deporcentaje: "0",
        dedic: "",
        monp1: "0",
        monp2: "0",
        monp3: "0",
        monp4: "0",
        deendeci: "string",
        defechadesc: "",
        agrupacion_id: 0
    })
}

export default {
    state,
    getters,
    actions,
    mutations
}