<template>
  <v-container id="login" fill-height class="d-flex justify-center">
    <v-snackbar v-model="snackbar">{{ snackbarText }}</v-snackbar>
    <v-row>
      <v-col>
        <v-card :loading="loading" class="mx-auto pa-md-4" max-width="500">
          <v-card-text>
            <p class="title text--primary">Login</p>
            <v-form @submit.prevent="login" v-model="valid" ref="loginForm">
              <v-container>
                <v-row v-if="login_error">
                  <v-col cols="12">
                    <v-alert type="error">{{ login_error }}</v-alert>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      autofocus
                      color="deep-purple accent-4"
                      v-model="email"
                      :type="'email'"
                      :rules="emailRules"
                      label="E-mail"
                      v-on:keydown.enter.prevent="login"
                      :disabled="loading"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      color="deep-purple accent-4"
                      v-model="password"
                      :rules="passRules"
                      :type="'password'"
                      label="Password"
                      v-on:keydown.enter.prevent="login"
                      :disabled="loading"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-dialog :loading="loading" v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="deep-purple accent-4"
                  :disabled="loading"
                  small
                  text
                  v-on="on"
                >Forgot Password ?</v-btn>
              </template>
              <v-card class="pa-md-4">
                <v-form v-model="valid" @submit.prevent="sendPasswordEmail" ref="resetPassForm">
                  <v-card-title>
                    <span class="headline">Reset Password</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="resetPassEmail"
                            :rules="emailRules"
                            type="email"
                            label="Email"
                            v-on:keydown.enter.prevent="sendPasswordEmail"
                            :disabled="loading"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="deep-purple accent-4" text @click="dialog = false">Close</v-btn>
                    <v-btn
                      color="deep-purple accent-4"
                      :loading="resetPassloading"
                      :disabled="resetPassloading"
                      raised
                      @click="sendPasswordEmail"
                      class="white--text"
                    >Send Email</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

            <v-spacer></v-spacer>
            <v-btn
              color="deep-purple accent-4 white--text"
              :disabled="loading || !valid"
              raised
              large
              @click="login"
            >Submit</v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mx-auto mt-2 pa-5" max-width="500">
          <v-row>
            <v-col cols="12" sm="12" class="d-flex align-center">
              <v-btn
                color="deep-purple accent-4"
                to="/register"
                :disabled="loading"
                text
                block
              >Create an account</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    loading: false,
    valid: false,
    login_error: null,
    email: "",
    password: "",
    passRules: [
      value => !!value || "Required.",
      value => value.length >= 8 || "Field should be greater than 7 characters"
    ],
    emailRules: [
      value => !!value || "Required.",
      value =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "Invalid e-mail."
    ],
    dialog: false,
    snackbar: false,
    snackbarText: "",
    resetPassEmail: "",
    resetPassloading: false
  }),
  methods: {
    login() {
      if (!this.$refs.loginForm.validate()) {
        return;
      }
      this.login_error = null;
      this.loading = true;
      const payload = {
        email: this.email,
        password: this.password
      };
      this.$store
        .dispatch("login", payload)
        .then(() => {
          this.loading = false;
          this.$router.push("home");
        })
        .catch(error => {
          if (
            error == "auth/user-not-found" ||
            error == "auth/wrong-password"
          ) {
            this.login_error = "Invalid Email Or Password";
          } else if (error == "auth/too-many-requests") {
            this.login_error =
              "Too many incorrect attempts. Please try again later.";
          } else {
            this.login_error = "Network error, please try again.";
          }
          this.password = "";
          this.loading = false;
        });
    },
    sendPasswordEmail() {
      if (!this.$refs.resetPassForm.validate()) {
        return;
      }
      this.snackbarText = "";
      this.resetPassloading = true;
      this.$store
        .dispatch("resetPassword", this.resetPassEmail)
        .then(() => {
          this.resetPassloading = false;
          this.dialog = false;
          this.snackbar = true;
          this.snackbarText =
            "Password reset link sent, please check your email.";
        })
        .catch(error => {
          if (error == "auth/user-not-found") {
            this.snackbar = true;
            this.snackbarText = "Wrong email address, please check again!";
          } else {
            this.snackbar = true;
            this.snackbarText = "Error, please try again :(";
          }
          this.resetPassloading = false;
        });
    }
  }
};
</script>