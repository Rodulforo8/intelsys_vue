<template>
  <v-container>
    <v-col md="12" cols="12">
      <v-card id="outer-card" elevation="6">
        <v-card id="inner-title-card" elevation="6">
          <v-col id="inner-title-card-col">
            <v-icon id="inner-card-icon" large color="white">mdi-account-search</v-icon>Buscar usuarios
          </v-col>
        </v-card>
        <v-row>
          <v-col md="5" cols="12">
            <v-container>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar usuario"
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

        <v-col v-if="permissionVariables.list" cols="12">
          <h2>Usuarios encontrados:</h2>
          <v-data-table
            :loading="dataTableLoader"
            :headers="headers"
            :items="allowedUsers"
            :search="search"
             no-data-text="La compañía no posee usuarios registrados"
          >
            <template v-slot:item.action="{ item }">
              <v-icon medium color="blue" class="mr-2" @click="editItem(item)">edit</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import mixin from "../../../mixins";
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
          value: "user_id",
          class: "#52887e --text title"
        },
        { text: "Nombre", value: "first_name", class: "#52887e --text title" },
        { text: "Apellido", value: "last_name", class: "#52887e --text title" },
        { text: "Usuario", value: "username", class: "#52887e --text title" },
        { text: "Email", value: "email", class: "#52887e --text title" },
        // { text: "Grupo", value: "groups" },
        {
          text: "Editar",
          value: "action",
          sortable: false,
          class: "#52887e --text title"
        }
      ],
      users: []
    };
  },
  created(){
this.fetchAllUsers()
  },
  computed: {
    ...mapGetters([
      "showUserForm",
      "allUsers",
      "updatingUser",
      "oneUser",
      "dataTableLoader",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    allowedUsers: function() {
      if (this.permissionVariables.list) {
        return this.allUsers;
      } else {
        return [];
      }
    }
  },
  methods: {
    ...mapActions(["addUserState", "fetchAllUsers"]),
    editItem(item) {
      this.addUserState(item);
    },
    
  }
};
</script>

<style>
</style>
