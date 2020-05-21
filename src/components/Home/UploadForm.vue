<template>
  <div id="upload_form">
    <v-card :loading="loading" class="mx-auto">
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="uploadFile" ref="settingsForm">
          <v-row v-if="error">
            <v-col cols="12">
              <v-alert type="error">{{ error }}</v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <ImgCropper @cropped_img="load_cropped_img" />
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <span v-if="cropped_img_data">
                <v-card class="mt-n6">
                  <v-img :src="cropped_img_data" class="shades" height="256" width="256">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-card>
              </span>
              <span class="subtitle-1 text-center" v-else>Please select and CROP the image.</span>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="deep-purple accent-4 white--text"
          :disabled="loading || !valid || !cropped_img_data"
          raised
          large
          @click="uploadFile"
        >Submit Meme</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import ImgCropper from "@/components/Home/ImgCropper";

export default {
  name: "UploadForm",
  components: {
    ImgCropper
  },
  props: ["uid"],
  data: () => ({
    loading: false,
    valid: false,
    error: null,
    cropped_img_data: null
  }),
  methods: {
    load_cropped_img(img_data) {
      this.cropped_img_data = img_data;
    },
    uploadFile() {
      this.error = null;
      this.loading = true;
      const timestamp = new Date();
      const payload = {
        image_data: this.cropped_img_data,
        payload: {
          upvote: [this.uid],
          downvote: [],
          id: +timestamp,
          timestamp: timestamp,
          uid: this.uid
        }
      };

      this.$store
        .dispatch("submitMeme", payload)
        .then(() => {
          this.loading = false;
          this.cropped_img_data = null;
          this.$emit("success");
        })
        .catch(error => {
          this.error = "Network error, please try again.";
          this.loading = false;
          this.$emit("failed");
        });
    }
  }
};
</script>