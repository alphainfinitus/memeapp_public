<template>
  <div id="meme_feed">
    <v-snackbar :timeout="0" class="text-center" @click="refreshMemes" top v-model="snackbar">
      <v-icon class="white--text">mdi-arrow-up</v-icon>New Meme(s)
      <v-btn color="pink" text>Show</v-btn>
    </v-snackbar>

    <v-card v-if="loading" class="d-flex justify-center align-center pa-6">
      <v-alert v-show="error" class="subtitle-1 mb-0 text-center" prominent type="error">
        <u>
          <a class="white--text" @click="reloadPage">{{error}}</a>
        </u>
      </v-alert>
      <v-progress-circular v-show="!error" size="40" color="deep-purple accent-4" indeterminate></v-progress-circular>
      <v-card-subtitle v-show="!error" class="subtitle-1 ml-3">Serving your memes please wait ;)</v-card-subtitle>
    </v-card>

    <div v-else>
      <div v-for="meme in memes" :key="meme.id">
        <v-card class="mx-auto my-3" max-width="512">
          <v-card-subtitle>{{ formatTimestamp(meme.timestamp)}}</v-card-subtitle>
          <v-img
            class="white--text align-end"
            max-height="512px"
            max-width="512px"
            aspect-ratio="1"
            :src="meme.memeURL"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="deep-purple accent-4"></v-progress-circular>
              </v-row>
            </template>
          </v-img>

          <v-card-actions>
            <!-- deep-purple accent-4 -->
            <v-btn
              :color="meme.upvote.includes(uid) ? `deep-purple accent-4` : `grey`"
              @click="vote(meme.id, true, meme.docId)"
              text
            >
              <v-icon>mdi-arrow-up-bold-circle-outline</v-icon>
            </v-btn>

            <v-btn
              :color="meme.downvote.includes(uid) ? `deep-purple accent-4` : `grey`"
              @click="vote(meme.id, false, meme.docId)"
              text
            >
              <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MemeFeed",
  props: ["uid"],
  data: () => ({
    loading: true,
    error: null,
    snackbar: false,
    memes: {}
  }),
  computed: {
    newMemes() {
      return this.$store.getters.memes;
    }
  },
  watch: {
    newMemes(newValue, oldValue) {
      if (Object.keys(newValue).length != Object.keys(oldValue).length) {
        if (Object.keys(oldValue).length == 0) {
          //initial page load
          this.loading = false;
          this.memes = this.$store.getters.memes;
        } else {
          //show new posts button;
          this.snackbar = true;
        }
      } else if (Object.keys(this.memes).length == 0) {
        //user has refreshed page
        this.loading = false;
        this.memes = this.$store.getters.memes;
      }
    }
  },
  methods: {
    reloadPage() {
      location.reload();
    },
    formatTimestamp(timestamp) {
      let date = timestamp.seconds * 1000;
      date = new Date(date).toString().substring(0, 15);
      return date;
    },
    vote(memeId, upvote, docId) {
      var upArr = this.memes[memeId].upvote;
      var downArr = this.memes[memeId].downvote;
      var upVoteIndex = upArr.indexOf(this.uid);
      var downVoteIndex = downArr.indexOf(this.uid);
      var payload = {
        memeId,
        docId
      };

      if (upvote) {
        if (upVoteIndex !== -1) {
          //removeUpvote
          upArr.splice(upVoteIndex, 1);
          payload.type = "removeUpvote";

          //update vuex and firestore
          this.$store.dispatch("vote", payload).catch(error => {
            //if error, revert ui actions
            upArr.push(this.uid);
            console.log(error);
          });
          this.$set(this.memes[memeId], "upvote", upArr);
          return;
        } else {
          //add upvote
          upArr.push(this.uid);
          payload.type = "addUpvote";

          //remove downvote if exists
          if (downVoteIndex !== -1) {
            downArr.splice(downVoteIndex, 1);
            payload.type = "addUpvote_removeDownvote";
          }
          //update vuex and firestore
          this.$store.dispatch("vote", payload).catch(error => {
            //if error, revert ui actions
            upArr.pop();
            downArr.push(this.uid);
            console.log(error);
          });
          this.$set(this.memes[memeId], "upvote", upArr);
          this.$set(this.memes[memeId], "downvote", downArr);
          return;
        }
      } else {
        //update ui and local state;
        if (downVoteIndex !== -1) {
          downArr.splice(downVoteIndex, 1);
          //update vuex and firestore
          payload.type = "removeDownvote";
          this.$store.dispatch("vote", payload).catch(error => {
            //if error, revert ui actions
            downArr.push(this.uid);
            console.log(error);
          });

          this.$set(this.memes[memeId], "downvote", downArr);
          return;
        } else {
          //add downVote
          downArr.push(this.uid);
          payload.type = "addDownvote";

          //remove upVote if exists
          if (upVoteIndex !== -1) {
            upArr.splice(upVoteIndex, 1);
            payload.type = "addDownvote_removeUpvote";
          }
          //update vuex and firestore
          //console.log(payload);
          this.$store.dispatch("vote", payload).catch(error => {
            //if error, revert ui actions
            downArr.pop();
            upArr.push(this.uid);
            console.log(error);
          });
          this.$set(this.memes[memeId], "downvote", downArr);
          this.$set(this.memes[memeId], "upvote", upArr);
          return;
        }
      }
    },
    refreshMemes() {
      this.snackbar = false;
      this.memes = this.newMemes;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  },
  mounted() {
    this.$store.dispatch("fetchMemes").catch(error => {
      this.error = "Network error, please refresh the page and try again.";
    });
  }
};
</script>