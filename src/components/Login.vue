<template>
  <v-col v-if="authToken === null" id="body">
    <v-row>
      <v-col id="main-container" cols="11" md="9">
        <v-card class="rounded-card" elevation="10">
          <v-img
            class="white--text align-end"
            id="panama-wallpaper"
            height="200px"
            src="../assets/fondo_ciudad/Panama-4.jpg"
          >
            <v-card-title>
              <v-img
                src="../assets/logointelsys/Logo V.B.png"
                lazy-src="../assets/logointelsys/Logo V.B.png"
                aspect-ratio="1"
                contain
                max-width="200"
                max-height="180"
              ></v-img>
            </v-card-title>
          </v-img>
          <v-card-text class="text--primary">
            <v-form v-model="valid" ref="formLogin" lazy-validation>
              <v-col id="text-field-col" md="5">
                <v-text-field
                  label="Nombre de usuario"
                  v-model="username"
                  prepend-inner-icon="perm_identity"
                  required
                  :color="fieldColor"
                  :rules="[rules.required]"
                  placeholder="Username"
                  dense
                ></v-text-field>
                <br>
                <v-text-field
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  label="Contraseña"
                  v-model="password"
                  counter
                  :color="fieldColor"
                  maxlength="10"
                  prepend-inner-icon="vpn_key"
                  placeholder="Password"
                  class="input-group--focused"
                  @click:append="show2 = !show2"
                  :rules="[rules.required]"
                  required
                  dense
                ></v-text-field>
                <!-- <p style="color:#1c6255; font-size:15px;text-align:right;">Olvido la contraseña?</p> -->
              </v-col>
              <v-col class="login-btn-container" md="12">
                <v-btn @click.prevent="login(false)" type="submit" id="login-btn">LOGIN</v-btn>
              </v-col>
              <v-col class="login-btn-container" md="12">
                <v-btn @click.prevent="login(true)" type="submit" id="login-btn">SUPER</v-btn>
              </v-col>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins";

export default {
  mixins: [mixin],
  data() {
    return {
      fieldColor: "#1c6255",
      show2: true,
      valid: true,
      // loginError: false,
      username: null,
      password: null,
      snackbar: false,
      users: []
    };
  },

  beforeCreate() {},
  computed: {
    ...mapGetters(["authUserData", "authToken"])
  },
  methods: {
    ...mapActions(["authAddToken", "authAddUser", "authLogin"]),
    login(boolean) {
      if (this.$refs.formLogin.validate()) {
        const user = {};
        user.username = this.username;
        user.password = this.password;
        user.super = boolean;
        user.title = user.super ? "Super usuario" : "Usuario";

        this.authLogin(user);
      }
    }
  }
};
</script>
<style lang="scss" scoped >
#body {
  text-align: center;
  background: #1c62554d;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  padding: 0;
  min-height: 100vh;
}
#main-container {
  margin: auto;
}

#login-btn {
  background-color: #1c6255;
  color: white;
  width: 40%;
}

.rounded-card {
  border-radius: 50px;
  margin-top: 3em;
}

#text-field-col {
  margin: auto;
}
</style>
