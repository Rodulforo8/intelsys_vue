<template>
  <v-row>
    <v-col md="12" cols="12">
      <v-card id="outer-card" elevation="6">
        <v-card id="inner-title-card" elevation="6">
          <v-col id="inner-title-card-col">
            <v-icon id="inner-card-icon" large color="white">attach_money</v-icon>Buscar descuentos
          </v-col>
        </v-card>
        <v-row>
          <v-col md="5" cols="12">
            <v-container>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar descuento"
                single-line
                :color="fieldColor"
                hide-details
              ></v-text-field>
            </v-container>
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <transition name="slide-fade">
          <v-col v-if="permissionVariables.list" cols="12">
            <h2>Descuentos encontrados</h2>
            <v-data-table
              :headers="headers"
              :loading="dataTableLoader"
              :items="allDiscounts"
              :search="search"
               no-data-text="La compañía no posee descuentos registrados"
            >
              <template v-slot:item.action="{ item }">
                <v-icon medium color="blue" class="mr-2" @click="editDiscount(item)">edit</v-icon>
              </template>
            </v-data-table>
          </v-col>
        </transition>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["fieldColor"],
  data() {
    return {
      search: null,
      headers: [
        { text: "Editar", value: "action", sortable: false },
        {
          text: "id",
          align: "left",
          sortable: true,
          value: "id",
       
        },
        { text: "Monto inicial", value: "demontoini" },
        { text: "Referencia", value: "refprestamo" },
        { text: "Monto total", value: "depagado" },
        { text: "Saldo total", value: "desaldo" },
        { text: "Fecha de inicio", value: "defini" },
        { text: "Fecha", value: "defechadesc" },
        { text: "Estatus", value: "destatus" },
      ]
    };
  },
  created() {
    this.fetchAllDiscounts();
  },
  computed: {
    ...mapGetters(["permissionVariables", "allDiscounts", "dataTableLoader"])
  },
  methods: {
    ...mapActions(["fetchAllDiscounts", "updatingDiscountData"]),
        editDiscount(item) {
      this.updatingDiscountData(item);
    }
  }
};
</script>

<style>
</style>
