<template>
  <v-col md="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-card id="inner-title-card" elevation="6">
        <v-col id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">supervisor_account</v-icon>Roles
        </v-col>
      </v-card>
      <v-row>
        <v-col md="5" cols="12">
          <v-container>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar rol"
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
          <h2>Roles encontrados:</h2>
          <v-data-table
            :loading="dataTableLoader"
            :headers="headers"
            :items="allRoles"
             no-data-text="La compañía no posee roles registrados"
            :search="search"
          >
            <template v-slot:item.action="{ item }">
              <v-icon medium color="blue" class="mr-2" @click="editRole(item)">edit</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </transition>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
export default {
  props: ["fieldColor"],
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Id",
          value: "id",
          align: "left",
          class: "#52887e --text title"
        },
        {
          text: "Nombre",
          align: "left",
          sortable: false,
          value: "nombre",
          align: "center",
          class: "#52887e --text title"
        },
        {
          text: "Actions",
          value: "action",
          sortable: false,
          align: "center",
          class: "#52887e --text title"
        }
      ]
    };
  },
  created(){
    this.fetchRoles()
  },
  computed: {
    ...mapGetters(["allRoles", "dataTableLoader", "permissionVariables"])
  },
  methods: {
    ...mapActions(["updatingRoleData", "fetchRoles"]),
    editRole(item) {
      this.updatingRoleData(item);
    }
  }
};
</script>

<style>
</style>
