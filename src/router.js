import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./views/Login.vue";
import store from "./store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    beforeEnter: (to, from, next) => {
      const auth = store.getters.auth;
      if (auth) {
        next("/home");
      } else {
        next();
      }
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./views/Register.vue"),
    beforeEnter: (to, from, next) => {
      const auth = store.getters.auth;
      if (auth) {
        next("/home");
      } else {
        next();
      }
    }
  },
  {
    path: "/home",
    name: "home",
    component: () => import("./views/Home.vue"),
    beforeEnter: (to, from, next) => {
      const auth = store.getters.auth;
      if (!auth) {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("./views/Settings.vue"),
    beforeEnter: (to, from, next) => {
      const auth = store.getters.auth;
      if (!auth) {
        next("/");
      } else {
        next();
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
