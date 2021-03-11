<template>
  <v-container>
    <v-row>
      <v-col md="12" cols="12">
        <v-card id="outer-card" elevation="6">
          <v-card id="inner-title-card" elevation="6">
            <v-col id="inner-title-card-col">
              <v-icon id="inner-card-icon" large color="white">mdi-account-search</v-icon>Buscar empleados
            </v-col>
          </v-card>
          <v-row>
            <v-col md="5" cols="12">
              <v-container>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar empleado"
                  single-line
                  :color="fieldColor"
                  @keyup="renderUserList()"
                  hide-details
                ></v-text-field>
              </v-container>
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="12">
            <h2>Empleados encontrados:</h2>
            <v-data-table
              :loading="dataTableLoader"
              :headers="headers"
              :items="allEmployees"
              :search="search"
              no-data-text="La compañía no posee empleados registrados"
            >
              <template v-slot:item.action="{ item }">
                <v-icon medium color="blue" class="mr-2" @click="edit(item)">edit</v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["fieldColor"],
  data() {
    return {
      search: null,
      headers: [
        {
          text: "Id",
          align: "left",
          sortable: true,
          value: "id",
          class: "#52887e --text title"
        },
        { text: "Nombre", value: "nombre", class: "#52887e --text title" },
        { text: "Apellido", value: "apellido1", class: "#52887e --text title" },

        { text: "Cedula", value: "cedula", class: "#52887e --text title" },

        { text: "Correo", value: "correo", class: "#52887e --text title" },
        { text: "Genero", value: "sexo", class: "#52887e --text title" },
        { text: "Cargo", value: "cargo", class: "#52887e --text title" },
        { text: "Editar", value: "action", sortable: false }
      ]
    };
  },
  created() {},
  computed: {
    ...mapGetters(["allEmployees", "dataTableLoader"])
  },
  methods: {
    ...mapActions(["updatingEmployeeData"]),
    edit(item) {
      this.updatingEmployeeData(item.id);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
