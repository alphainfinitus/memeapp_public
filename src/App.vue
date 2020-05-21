<template>
  <v-app>
    <Navbar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>

<style>
.v-content__wrap {
  background: linear-gradient(270deg, #dd2476, #ff512f, #ec008c, #fc6767);
  background-size: 800% 800%;

  -webkit-animation: BgAnimation 30s ease infinite;
  -moz-animation: BgAnimation 30s ease infinite;
  animation: BgAnimation 30s ease infinite;
}

@-webkit-keyframes BgAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes BgAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes BgAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>