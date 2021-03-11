<template>
  <v-col md="12" cols="12">
<br>
<br>
    <v-card id="outer-card" elevation="6">
      <v-col cols="12" style="position: absolute;text-align: right;color: #113d4c;">1/1</v-col>
      <v-card id="inner-title-card" elevation="6">
        <v-col v-if="!updatingCompany" id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">assignment_turned_in</v-icon>Crear compañía
        </v-col>
        <v-col v-else id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">assignment_turned_in</v-icon>Editar compañía
        </v-col>
      </v-card>
      <v-container>
        <v-form v-model="valid" ref="companyForm" lazy-validation>
          <v-row>
            <v-col align="right" class="form-col" md="4" cols="12">
              <v-autocomplete
                :color="fieldColor"
                prepend-icon="work"
                v-model="company.cstatus"
                :items="status"
                item-text="text"
                item-value="value"
                dense
                required
                filled
                label="Estatus de la compañía :"
              ></v-autocomplete>
            </v-col>
            <v-col class="form-col" md="4" cols="12">
              <v-text-field
                id="search-bar"
                v-model="company.cidentificador"
                label="Identificador unico"
                name="Identificador unico"
                prepend-icon="vpn_key"
                type="number"
                :color="fieldColor"
              ></v-text-field>
            </v-col>

            <v-col class="form-col" md="4" cols="12">
              <v-text-field
                id="search-bar"
                v-model="company.cnamecia"
                label="Nombre de la compañía"
                name="Nombre de la compañía"
                prepend-icon="perm_identity"
                :color="fieldColor"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col class="form-col" md="4" cols="12">
              <v-menu
                v-model="groupMenu.menu2"
                :close-on-content-click="false"
                :nudge-right="20"
                transition="scale-transition"
                offset-y
                allow-overflow
                min-width="500px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="company.cnameagru"
                    label="Agrupación"
                    prepend-icon="group"
                    name="Agrupación"
                    v-on="on"
                    :color="fieldColor"
                    @keyup="groupMenu2 = true"
                  ></v-text-field>
                </template>
                <v-card>
                  <v-container>
                    <v-data-table
                      :headers="groupsHeader"
                      :items="allGroups"
                      :search="company.cnameagru"
                    >
                      <template v-slot:item.action="{ item }">
                        <v-icon
                          @click="setGroupName(item.nameagru)"
                          medium
                          color="green"
                          class="mr-2"
                        >add_circle</v-icon>
                      </template>
                    </v-data-table>
                  </v-container>
                </v-card>
              </v-menu>
              <!-- <v-autocomplete
                v-model="company.cnameagru"
                :items="allGroups"
                item-text="cnameagru"
                :search-input.sync="search"
                item-value="cnameagru"
                label="Agrupación"
                prepend-icon="group"
                clearable
              ></v-autocomplete> -->
            </v-col>

            <v-col class="form-col" md="4" cols="12">
              <!-- <v-select
                :items="allCountries"
                v-model="company.cpais_id"
                item-text="nombre"
                item-value="id"
                :color="fieldColor"
                prepend-icon="flag"
                label="País"
                outlined
                @change="getProvinces()"
                name="País"
                required
                :rules="[rules.required]"
              ></v-select>-->
              <v-autocomplete
                :color="fieldColor"
                v-model="company.cpais_id"
                prepend-icon="flag"
                :items="allCountries"
                item-text="nombre"
                item-value="id"
                @change="getProvinces()"
                dense
                filled
                required
                :rules="[rules.required]"
                label="País"
              ></v-autocomplete>
            </v-col>
            <v-col class="form-col" md="4" cols="12">
              <!-- <v-select
                :items="allProvinces"
                v-model="company.cprovincia_id"
                item-text="nombre"
                item-value="id"
                :color="fieldColor"
                prepend-icon="flag"
                label="Provincia"
                outlined
                name="Provincia"
                required
                :loading="provinceLoader"
                :rules="[rules.required]"
              ></v-select>-->
              <v-select
                :items="allProvinces"
                v-model="company.cprovincia_id"
                item-text="nombre"
                item-value="id"
                :color="fieldColor"
                prepend-icon="flag"
                label="Provincia"
                name="Provincia"
                required
                filled
                :loading="provinceLoader"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col class="form-col" md="6" cols="12">
              <v-text-field
                class="field-text"
                v-model="company.cemail"
                label="Email"
                prepend-icon="email"
                required
                   :rules="[rules.required, rules.email]"
                :color="fieldColor"
                name="Email"
              ></v-text-field>
            </v-col>
            <v-col class="form-col" md="3" cols="12">
              <v-text-field
                v-model="company.ctelefono"
                label="Telefono"
                :color="fieldColor"
                type="number"
                prepend-icon="phone"
                required
                name="Telefono"
                dense
              ></v-text-field>
            </v-col>
            <v-col class="form-col" md="3" cols="12">
              <v-text-field
                v-model="company.ccelular"
                label="Celular"
                :color="fieldColor"
                type="number"
                prepend-icon="phone"
                required
                dense
                name="Celular"
              ></v-text-field>
            </v-col>
            <v-col class="form-col" cols="12" md="6">
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
                    v-model="company.cfecsaldo"
                    label="Fecha de inicio de saldo"
                    prepend-icon="event"
                    :color="fieldColor"
                    v-on="on"
                    required
                    :rules="[rules.required]"
                    name="Fecha"
                    hint="Nota: Si sus empleados poseen totales o acumulados anteriores,
coloque la última fecha de cálculo o sumatoria de dichos acumulados."
                    persistent-hint
                  ></v-text-field>
                </template>
                <v-date-picker
                  :color="fieldColor"
                  v-model="company.cfecsaldo"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col class="form-col" md="8" cols="12">
              <v-text-field
                style="padding:0;"
                class="field-text"
                v-model="company.cdireccion"
                label="Dirección"
                prepend-icon="search"
                :color="fieldColor"
                required
                name="Dirección"
              ></v-text-field>
            </v-col>

            <v-col class="form-col" md="4" cols="12">
              <v-text-field
                class="field-text"
                v-model="company.apartado"
                label="Apartado postal"
                prepend-icon="room"
                :color="fieldColor"
                required
                name="Apartado postal"
              ></v-text-field>
            </v-col>
             <v-col md="12" cols="12"  v-if="!updatingCompany">
               <h3>Crear usuario de la compañía: </h3>
             </v-col>

              <v-col md="6" cols="12"  v-if="!updatingCompany">
            <v-text-field
              v-model="user.first_name"
              prepend-inner-icon="person"
              label="Nombres"
              required
              :color="fieldColor"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12"  v-if="!updatingCompany">
            <v-text-field
              v-model="user.last_name"
              prepend-inner-icon="people"
              required
              :color="fieldColor"
              label="Apellidos"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="4" cols="12"  v-if="!updatingCompany">
            <v-text-field
              v-model="userName"
              prepend-inner-icon="person"
              readonly
              required
              :color="fieldColor"
              label="Nombre de usuario"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="4" cols="12"  v-if="!updatingCompany">
            <v-text-field
              v-model="company.cemail"
              prepend-inner-icon="email"
              required
              readonly
              :color="fieldColor"
              label="Correo"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </v-col>
          <v-col md="4" cols="12"  v-if="!updatingCompany">
            <v-text-field
              v-model="user.password"
              prepend-inner-icon="lock"
              required
                  maxlength="10"
              :color="fieldColor"
              label="Contraseña"
              :rules="[rules.required, rules.passwordLength, rules.passwordUpperCase, rules.passwordNumber, rules.passwordSpecialChar]"
            ></v-text-field>
          </v-col>
           
                <v-col class="form-col" cols="12" v-if="!updatingCompany">
                     <h3>Seleccionar roles de la compañía:</h3>
            <v-combobox
    v-model="chips"
    :items="chipItems"
    item-text="nombre"
    item-value="id"
    chips
    clearable
    label="Seleccionar roles de la compania"
    multiple
    prepend-icon="filter_list"
    solo
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click="select"
        @click:close="remove(item)"
      >
        <strong>{{ item.nombre }}</strong>&nbsp;
 
      </v-chip>
    </template>
  </v-combobox>
   </v-col>
            <v-col class="form-col" cols="12">
              <v-textarea
                outlined
                v-model="company.cnota"
                prepend-inner-icon="description"
                label="Notas"
                :color="fieldColor"
                required
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <transition id="bottom" name="slide-fade">
        <ProjectListAndForm v-if="updatingCompany"/>
      </transition>
    </v-card>
  </v-col>
</template>
<script>
const Swal = require("sweetalert2");
import mixin from "@/mixins";
import { mapActions, mapGetters } from "vuex";
import ProjectListAndForm from "@/components/CompanyComponents/ProjectForm.vue";
export default {
  mixins: [mixin],
  props: ["fieldColor"],
  components: {
    ProjectListAndForm
  },
  data() {
    return {
      status: [
        {
          text: "Activo",
          value: "A"
        },
        {
          text: "Inactivo",
          value: "I"
        }
      ],
      user: {},
      creationText: "Esta seguro, quiere crear la compañía?",
      updatingText: "Esta seguro, quiere actualizar la compañía?",
      menu: false,
      modal: false,
      menu2: false,
      valid: true,
      showField: false,
      switch1: true,
      company: {
        cnamecia: "",
        cnameagru: "",
        cidentificador: "",
        cemail: "",
        ctelefono: "",
        ccelular: "",
        cfecsaldo: "",
        cpais_id: "",
        cprovincia_id: "",
        cdireccion: "",
        apartado: "",
        cstatus: "A",
        cnota: "",
        cx: 0.0,
        cy: 0.0,
        projects: [],
        roles:[]
      },
      items: ["Activo", "Inactivo"],
      chips: [],
      chipItems: [],
      countries: [],
      provinces: [],
      groupsHeader: [
        {
          text: "Id",
          align: "left",
          sortable: true,
          value: "id"
        },
        { text: "Nombre", value: "nameagru" },
        { text: "Estatus", value: "agestatus" },
        { text: "Agregar", value: "action", sortable: false }
      ],
      groups: [],
      groupMenu: {
        menu: false,
        modal: false,
        menu2: false
      }
    };
  },

  created() {
    this.$bus.on("submitCompanyForm", () => {
      this.submitForm();
    });
    this.initialize();
    if (this.updatingCompany) {
      this.fetchProvinces(this.oneCompany.cpais_id);
    }
    this.fetchGroups();
    this.chipItems = this.defaultRoles
  },
  beforeDestroy() {
    this.$bus.off("submitCompanyForm");
  },

  computed: {
    ...mapGetters([
      "oneCompany",
      "companyUser",
      "companyStepperValue",
      "allCountries",
      "updatingCompany",
      "allGroups",
      "allProvinces",
      "provinceLoader",
      "permissionVariables",
      "defaultRoles"
    ]),

    companyName() {
      return this.company.cnamecia;
    },
    companyGroup() {
      return this.company.cnameagru;
    },
    companyStatus() {
      return this.company.cstatus;
    },
      userName: function () {
      // `this` apunta a la instancia vm
      var username = this.companyName + '_admin'
      this.user.username = username
      this.user.email = this.company.cemail
      return username
    },
    fixedRoles : function(){
      var rolesArray = []
      var roles = this.chips.map(roles => rolesArray.push(roles.id))
      return rolesArray
    },
    companyStatus: function() {
      var status = this.company.cstatus ? "Activa" : "Inactivassss";
      return status;
    },
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || "n/a"
        };
      });
    },
    items() {
      return this.entries.map(entry => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + "..."
            : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    }
  },
  methods: {
    ...mapActions([
      "fetchProvinces",
      "createCompany",
      "updateCompany",
      "fetchCountries",
      "fetchGroups"
    ]),
    initialize() {
      this.company = this.oneCompany;
      this.user = this.companyUser
      this.fetchCountries();
    },
    submitForm() {
      var text = this.updatingCompany ? this.updatingText : this.creationText;
      if (this.$refs.companyForm.validate()) {
        Swal.fire({
          title: text,
          text: text + this.oneCompany.cnamecia,
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          showCancelButton: true
        }).then(result => {
              if(this.fixedRoles.length = 0){
      Swal.fire({
                type: 'error',
                title: 'Debe elegir al menos un rol para la compañía ',
                showConfirmButton: false,
                timer: 1500
            })
         }
          else if (result.value) {
            if (this.company.cnameagru === "") {
              this.company.cnameagru = this.company.cnamecia;
            }
            this.company.roles = this.fixedRoles
            this.updatingCompany ? this.updateCompany() : this.createCompany();
            this.bottom();
          }
        });
      }
    },
       remove (item) {
        this.chips.splice(this.chips.indexOf(item), 1)
        this.chips = [...this.chips]
      },
    getProvinces() {
      this.fetchProvinces(this.company.cpais_id);
    },
    setGroupName(groupName) {
      this.company.cnameagru = groupName;
      this.groupMenu.menu2 = false;
    },
    top() {
    document.getElementById( 'outer-card' ).scrollIntoView();    
},
 bottom() {
    document.getElementById( 'bottom' ).scrollIntoView();
    window.setTimeout( function () { top(); }, 2000 );
}
  },
  watch: {
    companyName() {
      this.company.cnamecia = this.upperCaseString(this.company.cnamecia);
    },
    companyGroup() {
      this.company.cnameagru = this.upperCaseString(this.company.cnameagru);
    },
  }
};
</script>
<style lang="scss" scoped>
.col {
  margin: auto;
}
.v-input_icon--append .v-icon {
  color: red;
}

.field-text {
  padding: 0;
}
.my-text-style >>> .v-text-field__slot input {
  color: red;
}

.v-input__slot {
  border-color: rgba(0, 200, 0, 0.42);
  border: 2px solid rgba(17, 255, 17, 0.42);
}

.v-text-field {
  .theme--light.v-text-field .v-input__control .v-input__slot:before {
    border-color: rgba(243, 55, 55, 0.42);
  }
}
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
I