<template>
  <v-container id="home" fill-height class="d-flex justify-center">
    <v-snackbar v-model="snackbar">{{ snackbarText }}</v-snackbar>
    <v-row>
      <v-col class="pa-0">
        <v-card v-if="!userdata.isUserInfoSet" class="mx-auto pa-3 mb-4">
          <v-alert class="subtitle-1 mb-0 text-center" prominent color="red darken-2">
            <router-link class="white--text" to="/settings">
              Please
              <u>update your information</u> in order to vote for and/or upload memes.
            </router-link>
            <v-btn to="/settings" class="ml-md-2">Update</v-btn>
          </v-alert>
        </v-card>

        <div v-else>
          <UploadForm
            :uid="userdata.uid"
            @success="showMessage(true)"
            @failed="showMessage(false)"
          />

          <v-divider class="mt-5"></v-divider>
          <MemeFeed :uid="userdata.uid" />
          <v-card class="mx-auto pa-3 mt-3" max-width="512">
            <v-card-subtitle class="text-center">
              <v-icon class="mr-1">mdi-code-tags</v-icon>Developed By Mridul Kumar
            </v-card-subtitle>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UploadForm from "@/components/Home/UploadForm";
import MemeFeed from "@/components/Home/MemeFeed";

export default {
  name: "Login",
  components: {
    UploadForm,
    MemeFeed
  },
  data: () => ({
    loading: false,
    snackbar: false,
    snackbarText: "",
    userdata: {}
  }),
  methods: {
    showMessage(e) {
      this.snackbar = true;
      if (e) {
        //onsuccess
        this.snackbarText = "Meme uploaded successfully! We hope you win :)";
      } else {
        //onfailure
        this.snackbarText = "Network error, please try again :(";
      }
    }
  },
  mounted() {
    this.userdata = this.$store.getters.userData;
  }
};
</script>