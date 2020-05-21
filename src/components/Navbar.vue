<template>
  <v-app-bar app dark dense absolute>
    <div class="d-flex align-center">
      <v-btn to="/home" text>
        <v-icon class="mr-1">mdi-home-variant</v-icon>MemeApp
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-menu v-if="auth" left bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" small>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item to="/settings">
          <v-list-item-title>
            <v-icon>mdi-settings</v-icon>&nbsp;Settings
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click.prevent="logout">
          <v-list-item-title>
            <v-icon>mdi-logout</v-icon>&nbsp;Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "Navbar",
  computed: {
    auth: {
      get() {
        return this.$store.getters.auth;
      },
      set(newAuth) {
        return newAuth;
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.auth = null;
        this.$router.push({ name: "login" });
      });
    }
  }
};
</script>