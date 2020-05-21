import Vue from "vue";
import Vuex from "vuex";
import {
  firestore_fieldvalue,
  fire_auth,
  fire_store,
  fire_storage
} from "@/firebase/init";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  state: {
    auth: null,
    userdata: {},
    memes: {}
  },
  mutations: {
    login: (state, payload) => {
      state.auth = payload;
    },
    setUserData: (state, payload) => {
      state.userdata = payload;
    },
    logout: (state, payload) => {
      state.auth = null;
      state.userdata = {};
      state.memes = {};
      sessionStorage.clear();
    },
    saveSettings: (state, payload) => {
      payload.uid = state.auth.uid;
      state.userdata = payload;
    },
    setMemes: (state, payload) => {
      state.memes = payload;
    }
  },
  getters: {
    auth: state => {
      return state.auth;
    },
    userData: state => {
      return state.userdata;
    },
    memes: state => {
      return state.memes;
    }
  },
  actions: {
    login: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then(cred => {
            if (cred.user) {
              context.commit("login", cred.user);
              context
                .dispatch("setUserData")
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  reject(error.code);
                });
            } else {
              reject("Network Error");
            }
          })
          .catch(error => {
            reject(error.code);
          });
      });
    },
    resetPassword: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .sendPasswordResetEmail(payload)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error.code);
          });
      });
    },
    register: (context, payload) => {
      const userDocRef = fire_store.collection("users");
      return new Promise((resolve, reject) => {
        fire_auth
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then(cred => {
            if (cred.user) {
              context.commit("login", cred.user);
              // create a new document for the user
              const userData = { uid: cred.user.uid, isUserInfoSet: false };
              fire_store
                .collection("users")
                .doc(cred.user.uid)
                .set(userData);

              context.commit("setUserData", userData);
              resolve();
            } else {
              reject("Network Error");
            }
          })
          .catch(error => {
            reject(error.code);
          });
      });
    },
    setUserData: context => {
      const ref = fire_store.collection("users").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        ref
          .get()
          .then(res => {
            context.commit("setUserData", res.data());
            resolve();
          })
          .catch(error => {
            reject(error.code);
          });
      });
    },
    logout: context => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signOut()
          .then(() => {
            context.commit("logout");
            resolve();
          })
          .catch(error => {
            reject(error.code);
          });
      });
    },
    saveSettings: (context, payload) => {
      const ref = fire_store.collection("users").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        ref
          .update(payload)
          .then(() => {
            context.commit("saveSettings", payload);
            resolve();
          })
          .catch(error => {
            reject(error.code);
          });
      });
    },
    submitMeme: (context, payload) => {
      const ref = fire_store.collection("memes").doc();

      //memes/[uid]/[meme_id]/meme.jpeg
      const storageRef = fire_storage
        .ref()
        .child(
          `memes/${
            context.state.auth.uid
          }/${payload.payload.id.toString()}/meme.jpeg`
        );

      const imageToUpload = payload.image_data;
      var finalPayload = payload.payload;

      return new Promise((resolve, reject) => {
        storageRef
          .putString(imageToUpload, "data_url")
          .then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
              finalPayload.memeURL = url;
              ref
                .set(finalPayload)
                .then(() => {
                  resolve();
                })
                .catch(err => {
                  reject(err);
                });
            });
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    fetchMemes: context => {
      const ref = fire_store.collection("memes").orderBy("timestamp", "desc");
      return new Promise((resolve, reject) => {
        ref.onSnapshot(snapshot => {
          let memesObj = {};
          snapshot.forEach(doc => {
            let meme = doc.data();
            meme.docId = doc.id;
            memesObj[doc.data().id] = meme;
          });

          context.commit("setMemes", memesObj);
          resolve(memesObj);
        });
      });
    },
    vote: (context, payload) => {
      const ref = fire_store.collection("memes").doc(payload.docId);
      return new Promise((resolve, reject) => {
        const type = payload.type;
        switch (type) {
          case "removeUpvote":
            ref
              .update({
                upvote: firestore_fieldvalue.arrayRemove(context.state.auth.uid)
              })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
            break;
          case "addUpvote":
            ref
              .update({
                upvote: firestore_fieldvalue.arrayUnion(context.state.auth.uid)
              })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
            break;
          case "addUpvote_removeDownvote":
            ref
              .update({
                upvote: firestore_fieldvalue.arrayUnion(context.state.auth.uid),
                downvote: firestore_fieldvalue.arrayRemove(
                  context.state.auth.uid
                )
              })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
            break;
          case "removeDownvote":
            ref
              .update({
                downvote: firestore_fieldvalue.arrayRemove(
                  context.state.auth.uid
                )
              })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
            break;
          case "addDownvote":
            ref
              .update({
                downvote: firestore_fieldvalue.arrayUnion(
                  context.state.auth.uid
                )
              })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
            break;
          case "addDownvote_removeUpvote":
            ref
              .update({
                upvote: firestore_fieldvalue.arrayRemove(
                  context.state.auth.uid
                ),
                downvote: firestore_fieldvalue.arrayUnion(
                  context.state.auth.uid
                )
              })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
            break;
        }
      });
    }
  }
});
