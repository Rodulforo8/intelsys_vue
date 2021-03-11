<template>
  <v-col md="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-card id="inner-title-card" elevation="6">
        <v-col id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">view_module</v-icon>Buscar modulos
        </v-col>
      </v-card>
      <v-row>
        <v-col md="5" cols="12">
          <!-- {{allowedModules}} -->
          <v-container>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar modulo"
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
          <h2>Modulos encontrados:</h2>
          <v-data-table
            :loading="dataTableLoader"
            :headers="headers"
            :items="allowedModules"
            :search="search"
          >
            <template v-slot:item.action="{ item }">
              <v-icon medium color="blue" class="mr-2" @click="editModule(item)">edit</v-icon>
            </template>
            <template v-slot:item.icon="{ item }">
              <v-icon medium color="#1c6255">{{item.icon}}</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </transition>
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
        { text: "Nombre", value: "nombre", class: "#52887e --text title" },
        {
          text: "Descripcion",
          value: "descripcion",
          class: "#52887e --text title"
        },
     
        { text: "Icono", value: "icon", class: "#52887e --text title" },
      ]
    };
  },
  created() {
    this.fetchModules();
    this.buildModuleData();
    
  },
  computed: {
    ...mapGetters([
      "allModules",
      "oneModule",
      "dataTableLoader",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    allowedModules: function() {
      if (this.permissionVariables.list) {
        return this.modules;
      } else {
        return [];
      }
    }
  },
  methods: {
    ...mapActions(["fetchModules", "setModuleEdit"]),
    editModule(item) {
      this.setModuleEdit(item);
    },
    buildModuleData() {
      var array = [];

      for (var i in this.allModules) {
        if (this.allModules[i].estatus === 0) {
          this.allModules[i] = { ...this.allModules[i], status: "Activo" };
          array.push(this.allModules[i]);
        } else {
          this.allModules[i] = { ...this.allModules[i], status: "Inactivo" };
          array.push(this.allModules[i]);
        }
      }
      this.modules = array;
    }
  }
};
</script>

<style>
</style>
