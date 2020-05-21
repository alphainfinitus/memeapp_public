<template>
  <v-container id="userinfo" fill-height class="d-flex justify-center">
    <v-snackbar v-model="snackbar">{{ snackbarText }}</v-snackbar>
    <v-row>
      <v-col cols="12">
        <v-card :loading="loading" class="mx-auto pa-md-3">
          <v-card-text>
            <p class="title text--primary">College Info Settings</p>
            <v-form v-model="valid" @submit.prevent="saveSettings" ref="settingsForm">
              <v-row v-if="error">
                <v-col cols="12">
                  <v-alert type="error">{{ error }}</v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    autofocus
                    outlined
                    prepend-inner-icon="mdi-account-outline"
                    color="deep-purple accent-4"
                    v-model="fullName"
                    type="text"
                    :rules="nameRules"
                    label="Full Name"
                    :disabled="loading"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    outlined
                    prepend-inner-icon="mdi-clipboard-account-outline"
                    color="deep-purple accent-4"
                    v-model="collegeID"
                    :rules="nameRules"
                    type="number"
                    label="College ID"
                    :disabled="loading"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    prepend-inner-icon="mdi-checkbox-multiple-blank-outline"
                    v-model="course_branch"
                    :items="course_branch_list"
                    color="deep-purple accent-4"
                    label="Course - Branch"
                    :disabled="loading"
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    prepend-inner-icon="mdi-checkbox-multiple-marked-outline"
                    v-model="year"
                    :items="['1st', '2nd', '3rd', '4th']"
                    color="deep-purple accent-4"
                    label="Year"
                    :disabled="loading"
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    prepend-inner-icon="mdi-checkbox-multiple-marked-outline"
                    v-model="section"
                    :items="['A', 'B', 'C', 'D', 'E']"
                    color="deep-purple accent-4"
                    label="Section"
                    :disabled="loading"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="deep-purple accent-4 white--text"
              :disabled="loading || !valid"
              raised
              large
              @click="saveSettings"
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card :loading="loading" class="mx-auto pa-md-3">
          <v-card-text>
            <p class="title text--primary">Account Settings</p>
            <v-dialog :loading="loading" v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="deep-purple accent-4"
                  :disabled="loading"
                  large
                  v-on="on"
                  class="white--text"
                >Reset Password</v-btn>
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
                            label="Confirm Email"
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
                      :loading="loading"
                      :disabled="loading"
                      raised
                      @click="sendPasswordEmail"
                      class="white--text"
                    >Send Email</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UserInfo",
  data: () => ({
    loading: false,
    snackbar: false,
    snackbarText: "",
    error: null,
    valid: false,
    fullName: "",
    collegeID: "",
    nameRules: [
      value => !!value || "Required.",
      value => value.length >= 6 || "Field should be greater than 5 characters."
    ],
    course_branch: "",
    course_branch_list: [
      "B.Tech - CSE",
      "B.Tech - IT",
      "B.Tech - Mech.",
      "B.Tech - Civil"
    ],
    section: "",
    year: "",
    emailRules: [
      value => !!value || "Required.",
      value =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "Invalid e-mail."
    ],
    dialog: false,
    resetPassEmail: ""
  }),
  methods: {
    saveSettings() {
      if (!this.$refs.settingsForm.validate()) {
        return;
      }
      this.error = null;
      this.loading = true;
      const payload = {
        fullName: this.fullName,
        collegeID: this.collegeID,
        course_branch: this.course_branch,
        section: this.section,
        year: this.year,
        isUserInfoSet: true
      };
      this.$store
        .dispatch("saveSettings", payload)
        .then(() => {
          this.loading = false;
          this.$router.push("/home");
        })
        .catch(error => {
          this.login_error = "Network error, please try again.";
          this.loading = false;
        });
    },
    sendPasswordEmail() {
      if (!this.$refs.resetPassForm.validate()) {
        return;
      }
      this.snackbarText = "";
      this.loading = true;
      this.$store
        .dispatch("resetPassword", this.resetPassEmail)
        .then(() => {
          this.loading = false;
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
          this.loading = false;
        });
    }
  },
  mounted() {
    const userdata = this.$store.getters.userData;
    this.fullName = userdata.fullName;
    this.collegeID = userdata.collegeID;
    this.course_branch = userdata.course_branch;
    this.section = userdata.section;
    this.year = userdata.year;
  }
};
</script>