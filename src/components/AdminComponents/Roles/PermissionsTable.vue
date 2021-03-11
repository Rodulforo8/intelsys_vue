<template>
  <v-container>
    {{check}}
    <v-col cols="12" md="12">
      <v-col md="5" cols="12">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Buscar permiso"
          single-line
          :color="fieldColor"
          hide-details
        ></v-text-field>
      </v-col>
      <v-data-table :headers="headers" :items="modules" :search="search" class="elevation-0">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title id="text">
              <h2>Permisos del rol: {{roleName}}</h2>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:item.action_access="{ item }">
          <v-checkbox color="#1c6255" @change="buildPayload(item)" v-model="item.action_access"></v-checkbox>
        </template>
        <template v-slot:item.action_create="{ item }">
          <v-checkbox
            large
            color="#1c6255"
            @change="buildPayload(item)"
            v-model="item.action_create"
          ></v-checkbox>
        </template>
        <template v-slot:item.action_retrieve="{ item }">
          <v-checkbox color="#1c6255" @change="buildPayload(item)" v-model="item.action_retrieve"></v-checkbox>
        </template>
        <template v-slot:item.action_list="{ item }">
          <v-checkbox color="#1c6255" @change="buildPayload(item)" v-model="item.action_list"></v-checkbox>
        </template>
        <template v-slot:item.action_update="{ item }">
          <v-checkbox color="#1c6255" @change="buildPayload(item)" v-model="item.action_update"></v-checkbox>
        </template>
        <template v-slot:item.action_delete="{ item }">
          <v-checkbox color="#1c6255" @change="buildPayload(item)" v-model="item.action_delete"></v-checkbox>
        </template>
        <template v-slot:item.action="{ item }">
          <v-checkbox  @change="selectAll(item)" v-model="item.check" color="#1c6255"></v-checkbox>
        </template>
      </v-data-table>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      search: "",
      modules: [],
      fieldColor: "#1c6255",
      check: false,
      headers: [
        {
          text: "Modulo",
          align: "left",
          sortable: false,
          value: "nombre"
        },
        { text: "Acceso", value: "action_access" },
        { text: "Crear", value: "action_create" },
        { text: "Modificar", value: "action_update" },
        { text: "Consultar", value: "action_list" },
        { text: "Obtener", value: "action_retrieve" },
        { text: "Eliminar", value: "action_delete", sortable: false },
        { text: "Todo", value: "action", sortable: false }
      ]
    };
  },
  created() {
    this.buildModuleData();
  
  },
  computed: {
    ...mapGetters(["roleName", "allModules", "updatingRole", "oneRole"]),

  },
  methods: {
    ...mapActions(["addPermissions","fetchRoles"]),
    buildPayload(item) {

      // QUITAR ESTO LUEGO
      if (item.action_access) {
        item.action_access = 1;
      } else {
        item.action_access = 0;
      }
      if (item.action_create) {
        item.action_create = 1;
      } else {
        item.action_create = 0;
      }
      if (item.action_retrieve) {
        item.action_retrieve = 1;
      } else {
        item.action_retrieve = 0;
      }
      if (item.action_list) {
        item.action_list = 1;
      } else {
        item.action_list = 0;
      }
      if (item.action_delete) {
        item.action_delete = 1;
      } else {
        item.action_delete = 0;
      }
      if (item.action_update) {
        item.action_update = 1;
      } else {
        item.action_update = 0;
      }

      this.addPermissions(item);
    },

    //pasar al mixin
    buildModuleData() {
            console.log(this.$route.path)
      if (this.updatingRole) {
        this.modules = this.oneRole.permisos.map(data => {
          data.id = data.permission_id
          data.nombre = data.module_name
          return data;

        });
      } else {
        var array = [];
        for (var i in this.allModules) {
          var module = this.allModules[i];
          var json = {
            module_id: module.id,
            nombre: module.nombre,
            action_access: 0,
            action_create: 0,
            action_retrieve: 0,
            action_list: 0,
            action_delete: 0,
            action_update: 0
          };
          array.push(json);
        }

        this.modules = array;
        this.oneRole.permisos = array;
      }

      // if (this.updatingRole) {
      //   for (var i in array) {
      //     for (var j in this.oneRole.permisos) {
      //       if (array[i].module_id === this.oneRole.permisos[j].module_id) {
      //         Object.assign(array[i], this.oneRole.permisos[j]);
      //       }
      //     }
      //   }
      // }
    },
    selectAll(item) {
    
      var index = this.modules.indexOf(item);

      if (item.check == true) {
        item.action_access = 1;
        item.action_create = 1;
        item.action_retrieve = 1;
        item.action_list = 1;
        item.action_delete = 1;
        item.action_update = 1;

        Object.assign(this.modules[index], item);
      } else {
            item.action_access = 0;
        item.action_create = 0;
        item.action_retrieve = 0;
        item.action_list = 0;
        item.action_delete = 0;
        item.action_update = 0;

        Object.assign(this.modules[index], item);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
