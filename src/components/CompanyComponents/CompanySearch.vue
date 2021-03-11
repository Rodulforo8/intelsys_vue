<template>
  <v-col md="12" lg="12" xl="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-card id="inner-title-card" elevation="6">
        <v-col id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">assignment_turned_in</v-icon>Buscar compañía
        </v-col>
      </v-card>
      <v-row>
        <v-col md="5" cols="12">
          <v-container>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar compañía"
              single-line
              :color="fieldColor"
              @keyup="renderCompanies()"
              hide-details
            ></v-text-field>
          </v-container>
          <br>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
          <transition name="slide-fade">
            <v-col v-if="permissionVariables.list" cols="12">
              <h2>Compañías encontradas</h2>
              <v-data-table
                :loading="dataTableLoader"
                :headers="headers"
                :items="allCompanies"
                :search="search"
                no-data-text="No hay registros de compañías"
              >
                <template v-slot:item.action="{ item }">
                  <v-icon medium color="blue" class="mr-2" @click="editCompany(item)">edit</v-icon>
                </template>
              </v-data-table>
            </v-col>
          </transition>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import mixin from "@/mixins";
export default {
  props: ["fieldColor"],
  data() {
    return {
      search: null,
      creationText: "Esta seguro, quiere crear el proyecto?",
      updatingText: "Esta seguro, quiere actualizar el proyecto?",
      headers: [
           {
          text: "Editar",
          value: "action",
          sortable: false,
          class: "#52887e --text title"
        },
        {
          text: "Id",
          align: "left",
          sortable: true,
          value: "id",
         class: "#52887e --text title"
        },
        { text: "Nombre", value: "cnamecia", class: "#52887e--text title" },
        { text: "Grupo", value: "cnameagru", class: "#52887e --text title" },
        {
          text: "Indentificador",
          value: "cidentificador",
          class: "#52887e --text title"
        },
        { text: "Email", value: "cemail", class: "#52887e --text title" },
        { text: "Telefono", value: "ctelefono", class: "#52887e --text title" },
        { text: "Celular", value: "ccelular", class: "#52887e --text title" },
        // { text: "Pais", value: "cpais" },
        // { text: "Provincia", value: "cprovincia" },
        {
          text: "Fecha",
          value: "cfecsaldo",
          class: "#52887e --text title"
        },
        {
          text: "Direccion",
          value: "cdireccion",
          class: "#52887e --text title"
        },
        { text: "zipcode", value: "apartado", class: "#52887e --text title" },
        { text: "Estatus", value: "cstatus", class: "#52887e --text title" },
        {
          text: "Proyectos",
          value: "proyectos.length",
          class: "#52887e --text title"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "allCompanies",
      "dataTableLoader",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ])
    // allowedCompanies: function() {
    //   if (this.permissionVariables.list) {
    //     return this.allCompanies;
    //   } else {
    //     return [];
    //   }
    // }
  },
  methods: {
    ...mapActions(["updatingCompanyData"]),
    editCompany(item) {
      this.updatingCompanyData(item);
    }
  }
};
</script>

<style lang="scss" scoped>
.test {
  color: red;
}
</style>
