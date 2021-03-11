<template>
  <v-col md="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-card id="inner-title-card" elevation="6">
        <v-col id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">mdi-account-search</v-icon>Buscar acreedores
        </v-col>
      </v-card>
      <v-row>
        <v-col md="5" cols="12">
          <v-container>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar acreedor"
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
      <v-col v-if="permissionVariables.list" cols="12">
        <h2>Acreedores encontrados:</h2>
        <v-data-table
          :loading="dataTableLoader"
          :headers="headers"
          :items="allowedCreditors"
          :search="search"
          no-data-text="La compañía no posee acreedores registrados"
        >
          <template v-slot:item.action="{ item }">
            <v-icon medium color="blue" class="mr-2" @click="edit(item)">edit</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["fieldColor"],
  data() {
    return {
      search: null,
      modules: null,
      headers: [
        {
          text: "Id",
          align: "left",
          sortable: true,
          value: "id",
          class: "#52887e --text title"
        },
        { text: "Nombre", value: "acnameacree", class: "#52887e --text title" },
        { text: "Compañía", value: "cnamecia", class: "#52887e --text title" },
             { text: "Estatus", value: "estatus", class: "#52887e --text title" },
        {
          text: "Editar",
          value: "action",
          sortable: false,
          class: "#52887e --text title"
        }
      ]
    };
  },
  created() {},
  computed: {
    ...mapGetters([
      "allCreditors",
      "dataTableLoader",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    allowedCreditors: function() {
      if (this.permissionVariables.list) {
        return this.allCreditors;
      } else {
        return null;
      }
    }
  },
  methods: {
    ...mapActions(["updatingCreditorData"]),
    edit(item) {
      this.updatingCreditorData(item);
    }
  }
};
</script>

<style>
</style>
