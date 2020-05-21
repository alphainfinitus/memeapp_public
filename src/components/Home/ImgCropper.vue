<template>
  <v-card flat :loading="loading">
    <v-card-title>
      <span class="title">Upload your meme:</span>
    </v-card-title>
    <v-card-text>
      <v-file-input
        :rules="rules"
        class="mx-md-4 mt-2"
        v-model="selectedFile"
        accept="image/*"
        label="Select new image"
        show-size
        prepend-icon="mdi-image"
        outlined
        @change="setupCropper"
      ></v-file-input>
      <v-row v-if="objectUrl">
        <v-col class="text-center" cols="12" md="6">
          <div class="overline">Original</div>
          <div class="image-container elevation-4">
            <img class="image-preview" ref="source" :src="objectUrl" />
          </div>
          <div class="d-flex justify-center">
            <v-btn icon="icon" small="small" @click="resetCropper">
              <v-icon small="small">mdi-aspect-ratio</v-icon>
            </v-btn>
            <div class="mx-2"></div>
            <v-btn icon="icon" small="small" @click="rotateLeft">
              <v-icon small="small">mdi-rotate-left</v-icon>
            </v-btn>
            <v-btn icon="icon" small="small" @click="rotateRight">
              <v-icon small="small">mdi-rotate-right</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col class="text-center" cols="12" sm="6">
          <div class="overline">Preview</div>
          <div class="image-container elevation-4">
            <img class="image-preview" :src="previewCropped" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="objectUrl" class="mx-12 px-12 mt-n5 mb-3">
      <v-btn
        color="primary"
        block
        :disabled="!objectUrl || selectedFile.size >= 5000000"
        @click="crop"
      >
        <v-icon left="left">mdi-crop-free</v-icon>
        <span>Crop</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import Cropper from "cropperjs";
import debounce from "lodash/debounce";
require("cropperjs/dist/cropper.css");

export default {
  name: "ImgCropper",
  data() {
    return {
      loading: false,
      cropper: null,
      objectUrl: null,
      previewCropped: null,
      selectedFile: null,
      debouncedUpdatePreview: debounce(this.updatePreview, 257),
      rules: [
        value =>
          !value ||
          value.size < 5000000 ||
          "image size should be less than 5 MB!"
      ]
    };
  },

  methods: {
    resetCropper() {
      this.cropper.reset();
    },
    rotateLeft() {
      this.cropper.rotate(-90);
    },
    rotateRight() {
      this.cropper.rotate(90);
    },
    setupCropper(selectedFile) {
      if (this.cropper) {
        this.cropper.destroy();
      }

      if (this.objectUrl) {
        window.URL.revokeObjectURL(this.objectUrl);
      }

      if (!selectedFile) {
        this.cropper = null;
        this.objectUrl = null;
        this.previewCropped = null;
        return;
      }

      this.objectUrl = window.URL.createObjectURL(selectedFile);
      this.$nextTick(this.setupCropperInstance);
    },
    setupCropperInstance() {
      this.cropper = new Cropper(this.$refs.source, {
        aspectRatio: 1,
        crop: this.debouncedUpdatePreview
      });
    },
    updatePreview(event) {
      const canvas = this.cropper.getCroppedCanvas();
      this.previewCropped = canvas.toDataURL("image/jpeg", 0.8);
    },
    crop() {
      this.$emit("cropped_img", this.previewCropped);
      this.selectedFile = null;
      this.cropper.destroy();
      this.objectUrl = null;
    }
  }
};
</script>


<style scoped>
.image-container {
  display: inline-block;
}

.image-preview {
  display: block;
  max-height: 229px;
  max-width: 100%;
}
</style>