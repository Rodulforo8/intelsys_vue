<template>
  <v-card id="outer-card" elevation="6">
    <v-card id="inner-title-card" elevation="6">
      <v-col id="inner-title-card-col">
        <v-icon id="inner-card-icon" large color="white">assignment</v-icon>Auditoria
      </v-col>
    </v-card>
    <v-col cols="12" md="12">
      <!-- {{this.permissionVariables.list}} -->
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar registro"
            single-line
            @keyup="renderCompanies()"
            hide-details
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col align="center">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            :color="fieldColor"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="field-text"
                v-model="start_date"
                label="Desde"
                prepend-icon="event"
                readonly
                :color="fieldColor"
                v-on="on"
                required
                :rules="[rules.required]"
                name="Desde"
              ></v-text-field>
            </template>
            <v-date-picker
              @change="applyDateFilter"
              v-model="start_date"
              color="#1c6255"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col align="center">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :color="fieldColor"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="field-text"
                label="Hasta"
                v-model="end_date"
                prepend-icon="event"
                readonly
                :color="fieldColor"
                v-on="on"
                required
                :rules="[rules.required]"
                name="Hasta"
                :format="formatDate"
              ></v-text-field>
            </template>
            <v-date-picker
              @change="applyDateFilter"
              v-model="end_date"
              color="#1c6255"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="permissionVariables.list" cols="12">
      <h2>Registros encontrados:</h2>
      <v-col cols="12" md="12">
        <v-data-table
          :loading="dataTableLoader"
          :headers="headers"
          :items="allowedAudits"
          :search="search"
          id="mytable"
          no-data-text="La compañía no posee registros de auditoria"
        >
          <!-- <template v-slot:item.username="{ item }">{{item.username | to-upperCase}}</template> -->
          <template v-slot:item.created_at="{ item }">{{item.created_at | format-date}}</template>
        </v-data-table>
      </v-col>
    </v-col>
    <!--<AutoComplete />-->
  </v-card>

</template>
<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import mixin from "@/mixins";
import AutoComplete from "@/components/AutoComplete"
export default {
  mixins: [mixin],
  components:{
    AutoComplete
  },
  data() {
    return {
      fieldColor: "#1c6255",
      title: "hola",
      search: null,
      menu: false,
      menu2: false,
      start_date: null,
      end_date: null,
      headers: [
        {
          text: "Id",
          align: "left",
          sortable: true,
          value: "id",
          class: "gray--text title"
        },
        {
          text: "Usuario",
          value: "username",
          class: "#52887e --text title",
          sortable: false
        },
        {
          text: "Modulo",
          value: "module",
          class: "#52887e --text title",
          sortable: false
        },
        {
          text: "Accion",
          value: "action",
          align: "center",
          class: "#52887e --text title",
          sortable: false
        },
        {
          text: "Fecha",
          align: "center",
          value: "created_at",
          class: "#52887e --text title",
          sortable: false
        }
      ],
      audits: [
        // {
        //   id: 1,
        //   user: "admin",
        //   module: "Roles",
        //   action: "Agrego el rol Administrador",
        //   date: "05/01/2020"
        // },
        // {
        //   id: 2,
        //   user: "user_2",
        //   module: "Crear compañía",
        //   action: "Creó la compañía intelsys",
        //   date: "05/01/2020"
        // },
        // {
        //   id: 3,
        //   user: "user_1",
        //   module: "Usuarios",
        //   action: "Creó el usuario user_3",
        //   date: "05/01/2020"
        // }
      ]
    };
  },
  created() {},
  computed: {
    ...mapGetters([
      "allAudits",
      "dataTableLoader",
      "authUserSelectedCompany",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    allowedAudits: function() {
      if (this.permissionVariables.list) {
        return this.allAudits;
      } else {
        return [];
      }
    }
  },
  methods: {
    ...mapActions(["fetchAllAudits", "filterAudits"]),
    formatDate(value) {
      var date = moment(value, "YY-MM-DD").format("DD-MM-Y");
      return date;
    },
    applyDateFilter() {
      if (this.end_date === null) {
        this.end_date = this.start_date;
      }
      if (this.start_date !== null && this.end_date !== null) {
        var date_start = this.formatDate(this.start_date);
        var date_end = this.formatDate(this.end_date);
        console.log(date_start);
        var payload = {
          company_id: null,
          start_date: date_start,
          end_date: date_end,
          user_id: null
        };

        this.filterAudits(payload);
      }
    }
  }
};
</script>
<style  scoped>
#mytable table thead tr th:nth-child(1) {
  background: green;
}
#mytable table thead tr th:nth-child(2) {
  background: red;
}
</style>