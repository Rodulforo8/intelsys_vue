<template>
  <v-data-table
    :loading="dataTableLoader"
    :headers="headers"
    :items="items"
    no-data-text="El usuario no posee permisos"
    sort-by="calories"
    class="elevation-1"
    pagination.sync="pagination"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>
          <h2>Permisos:</h2>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog persistent v-model="dialog" overlay-opacity="0" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn id="btn" v-on="on" v-if="updatingUser">
              <v-icon large color="white">note_add</v-icon>Agregar Permiso
            </v-btn>
            <v-btn id="btn" v-on="on" v-else>
              <v-icon large color="white">note_add</v-icon>Agregar Compañía
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">
                <h3 v-if="updatingUser">Agregar Permiso</h3>
                <h3 v-else>Agregar Compañía</h3>
              </span>
            </v-card-title>
            <v-card-text>
              <v-form valid ref="companyUserForm" lazy-validation>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-autocomplete
                        v-if="updatingUser"
                        :items="allRoles"
                        prepend-inner-icon="person"
                        v-model="payload.role_id"
                        label="Rol"
                        item-text="nombre"
                        item-value="id"
                        :color="fieldColor"
                        required
                        clearable
                        :rules="[rules.required]"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-if="!updatingUser"
                        :items="allowedCompanies"
                        prepend-inner-icon="work"
                        v-model="companyPayload"
                        label="Compañía"
                        item-text="name"
                        item-value="id"
                        return-object
                        :color="fieldColor"
                        required
                        clearable
                        :rules="[rules.required]"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#52887e" text @click="close">Cancelar</v-btn>
              <v-btn color="#52887e" v-if="updatingUser" text @click="save">Guardar</v-btn>
              <v-btn color="#52887e" v-else text @click="add">Agregar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <!-- <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon> -->
      <v-icon v-if="updatingUser" color="red" medium @click="deleteItem(item)">delete</v-icon>
      <v-icon v-else color="red" medium @click="deleteItemCreating(item)">delete</v-icon>
    </template>
    <template v-slot:no-data>
      <!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
    </template>
  </v-data-table>
</template>

<script>
import mixin from "../../../mixins";
import { mapGetters, mapActions } from "vuex";
import { thistle } from "color-name";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  data() {
    return {
      valid: true,
      items: [],
      headers: [],
      pagination: { rowsPerPage: 30 },
      selectedRole: "",
      payload: {
        role_id: "",
        status: 0
      },
      companyPayload: "",
      companyDataTable: false,
      search: "",
      dialog: false,
      fieldColor: "#1c6255",
      updatingHeader: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "company_id"
        },
        { text: "Compañía", align: "center", value: "company_name" },
        { text: "Rol", align: "center", value: "role_name" },
        { text: "Actions", value: "action", sortable: false }
      ],
      creatingHeader: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Compañía", align: "left", value: "name" },
        { text: "Actions", value: "action", sortable: false }
      ],

      editedIndex: -1,
      allowedCompanies: ""
    };
  },

  mounted() {},

  computed: {
    ...mapGetters([
      "allRoles",
      "allCompanies",
      "oneUser",
      "dataTableLoader",
      "userCompanies",
      "allActiveCompanies",
      "updatingUser",
      "authPermissions",
      "authUserSelectedCompany"
    ])
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions([
      "fetchAllUserCompanies",
      "createUserCompany",
      "deleteUserCompany",
      "fetchRoles",
      "deleteUserCompanyItem",
      "addUserCompanyItem"
    ]),
    async initialize() {
      this.fetchRoles();
      this.setAllowedCompanies();
      if (this.updatingUser) {
        await this.fetchAllUserCompanies();
        this.headers = this.updatingHeader;
        this.items = this.userCompanies;
      } else {
        this.headers = this.creatingHeader;
        this.items.push({
          id: this.authUserSelectedCompany.id,
          name: this.authUserSelectedCompany.name
        });
        this.addUserCompanyItem(this.authUserSelectedCompany.id);
           this.allowedCompanies = this.allowedCompanies.filter(
            company => company.id !== this.authUserSelectedCompany.id
          );
      }
    },
    watch: {
      dialog(val) {
        val || this.close();
      }
    },
    editItem(item) {
      this.editedIndex = this.userCompanies.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.userCompanies.indexOf(item);

      var payload = {
        id: item.company_user_id,
        index: index
      };

      Swal.fire({
        title: `Esta seguro que quiere eliminar el rol?`,
        text: "Se borrara el permiso y se restringira el acceso",
        type: "question",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.deleteUserCompany(payload);
        }
      });

      // confirm("Are you sure you want to delete this item?") &&
      //   this.userCompanies.splice(index, 1);
    },
    deleteItemCreating(item) {
      this.items = this.items.filter(arrayItem => arrayItem.id !== item.id);
      this.allowedCompanies.push(item);
      this.deleteUserCompanyItem(item.id);
    },
    close() {
      this.dialog = false;
      this.resetUserCompanyData();
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.$refs.companyUserForm.validate()) {
        if (this.editedIndex > -1) {
          this.updateUserCompany();
        } else {
          this.createUserCompany(this.payload);
        }
        this.close();
      }
      this.resetUserCompanyData();
    },
    add() {
      if (
        this.companyPayload.id === "" ||
        this.items.indexOf(this.companyPayload) > -1
      ) {
      } else {
        if (this.$refs.companyUserForm.validate()) {
          this.items.push(this.companyPayload);
          this.allowedCompanies = this.allowedCompanies.filter(
            company => company.id !== this.companyPayload.id
          );
          this.addUserCompanyItem(this.companyPayload.id);
          this.companyPayload = {
            id: "",
            name: ""
          };

          this.close();
        }
      }
    },
    resetCompany() {
      this.companyDataTable = true;
      this.payload.company_id = "";
    },
    resetUserCompanyData() {
      this.payload = {
        role_id: "",
        status: 0
      };
      this.search = "";
    },
    setAllowedCompanies() {
      var array = [];
      for (var i in this.authPermissions.company) {
        var json = {
          id: this.authPermissions.company[i].id,
          name: this.authPermissions.company[i].name
        };

        array.push(json);
      }

      this.allowedCompanies = array;
    }
  }
};
</script>
<style lang="scss" scoped>
#btn {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: #1c6255;
  color: white;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
</style>
