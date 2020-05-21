<template>
  <v-container id="register" fill-height class="d-flex justify-center">
    <v-row>
      <v-col>
        <v-card :loading="loading" class="mx-auto pa-md-4" max-width="500">
          <v-card-text>
            <p class="title text--primary">Create a new account</p>
            <v-form v-model="valid" @submit.prevent="register" ref="registerForm">
              <v-container>
                <v-row v-if="register_error">
                  <v-col cols="12">
                    <v-alert type="error">{{ register_error }}</v-alert>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      autofocus
                      color="deep-purple accent-4"
                      v-model="email"
                      type="email"
                      :rules="emailRules"
                      label="E-mail"
                      :disabled="loading"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      color="deep-purple accent-4"
                      v-model="password"
                      :rules="passRules"
                      type="password"
                      label="Password"
                      :disabled="loading"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      color="deep-purple accent-4"
                      v-model="password_confirm"
                      :rules="passConfirmRules"
                      type="password"
                      label="Confirm Password"
                      v-on:keydown.enter.prevent="register"
                      :disabled="loading"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="deep-purple accent-4 white--text"
              :disabled="loading || !valid"
              raised
              large
              @click="register"
            >Submit</v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mx-auto mt-2 pa-5" max-width="500">
          <v-row>
            <v-col cols="12" sm="12" class="d-flex align-center">
              <v-btn :disabled="loading" color="deep-purple accent-4" to="/" block text>Sign In</v-btn>
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
    register_error: null,
    email: "",
    password: "",
    password_confirm: "",
    passRules: [
      value => !!value || "Required.",
      value =>
        value.length >= 8 ||
        "Field should be greater than 7 characters.align-content-center"
    ],
    passConfirmRules: [
      value => !!value || "Required.",
      value => value.length >= 8 || "Field should match the password field"
    ],
    emailRules: [
      value => !!value || "Required.",
      value =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "Invalid e-mail."
    ],
    dialog: false,
    resetPassEmail: null,
    resetPassloading: false
  }),
  methods: {
    register() {
      if (!this.$refs.registerForm.validate()) {
        return;
      }
      if (this.password != this.password_confirm) {
        this.register_error = "Both passwords should match.";
        return;
      }
      this.register_error = null;
      this.loading = true;
      const payload = {
        email: this.email,
        password: this.password
      };
      this.$store
        .dispatch("register", payload)
        .then(() => {
          this.loading = false;
          this.$router.push("home");
        })
        .catch(error => {
          if (
            error == "auth/user-not-found" ||
            error == "auth/wrong-password"
          ) {
            this.register_error = "Invalid Email Or Password";
          } else if (error == "auth/too-many-requests") {
            this.register_error =
              "Too many incorrect attempts. Please try again later.";
          } else {
            this.register_error = "Network error, please try again.";
          }
          this.password = "";
          this.loading = false;
        });
    }
  }
};
</script>