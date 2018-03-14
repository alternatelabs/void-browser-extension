<template>
  <div :class="containerClass">
    <span class="text">Added to the void</span>
    <span class="delete" @click="deleteBookmark">Remove this page</span>
    <input-tag :on-change="tagsChange" :tags="tags" placeholder="Add tags"></input-tag>

    <div class="actions">
      <label class="read-it-later" for="bookmark_read_later" @click.prevent="toggleReadLater">
        <input type="checkbox" v-model="readLater" id="bookmark_read_later" name="bookmark_read_later" @click.prevent="toggleReadLater">
        Read later
      </label>
      <span class="ui-button" @click="done">Save</span>
    </div>

    <div class="status-box">
      <loading :is-loading="isLoading" />
      <span class="saving-state" v-text="host"></span>
    </div>
  </div>
</template>

<script>
import api from "helpers/api";
import InputTag from "vue-input-tag";
import Loading from "components/Loading";
import ReconnectingWebSocket from "reconnectingwebsocket";

let ws;

export default {
  name: "bookmarklet",

  components: { Loading, InputTag },

  props: {
    url: {
      type: String,
      required: false,
      default() {
        return window.location.href;
      },
    },
    host: {
      type: String,
      required: true,
    },
    apiRoot: {
      type: String,
      required: true,
    },
    apiToken: {
      type: String,
      required: true,
    },
    containerClass: {
      type: String,
      required: false,
      default() {
        return "void-bookmarklet";
      },
    },
  },

  data() {
    return {
      readLater: false,
      bookmark: {},
      tags: [],
      isLoading: true,
    };
  },

  created() {
    // #TODO: this.connectWS();
    this.findOrCreateBookmark();
  },

  methods: {
    api() {
      return api.instance(this.apiRoot, this.apiToken);
    },

    toggleReadLater() {
      this.readLater = !this.readLater;
      this.updateBookmark();
    },

    tagsChange(newTags) {
      this.tags = newTags.map(t => `#${this.cleanTag(t)}`);
      this.updateBookmark();
    },

    cleanTag(tag) {
      return tag.toLowerCase().replace(/[^a-z0-9\-\_]/g, "");
    },

    findOrCreateBookmark() {
      this.api().post("bookmarks", { url: this.url }).then(resp => {
        console.log("findOrCreateBookmark", resp.data);
        this.bookmark = resp.data.data;
        this.readLater = this.bookmark.read_later;
        this.tags = this.bookmark.tags.map(t => `#${t}`);

        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      }).catch(resp => {
        console.error("Error trying to find or create bookmark", resp);
      });
    },

    updateBookmark() {
      const tags = this.tags.map(t => this.cleanTag(t));

      const params = {
        tags,
        read_later: this.readLater
      };

      this.isLoading = true;

      this.api().put("bookmarks/" + this.bookmark.id, params).then(resp => {
        this.bookmark = resp.data.data;
        this.readLater = this.bookmark.read_later;

        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      }).catch(resp => {
        console.error("Error updating bookmark", resp);
      });
    },

    deleteBookmark() {
      this.isLoading = true;

      this.api().delete("bookmarks/" + this.bookmark.id).then(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 100);

        setTimeout(() => {
          this.$emit("close");
        }, 1000);
      });
    },

    done() {
      this.$emit("close");
    },

    disconnectWS() {
      if (ws && ws.readyState <= 1) {
        ws.close();
      }

      ws = null;
    },

    connectWS() {
      if (ws && ws.readyState <= 1) {
        console.log("WS connection already established");
        return;
      }
      ws = new ReconnectingWebSocket(process.env.REALTIME_SERVICE_WSS);
      let pingInterval;

      ws.onopen = () => {
        this.api().get("user/realtime_token")
          .then((resp) => {
            const msg = {
              event: "authenticate",
              data: resp.data.token,
            };
            ws.send(JSON.stringify(msg));

            console.log("WS Connected");
          })
          .catch(err => console.error("Error fetching realtime token", err.response));

        pingInterval = setInterval(() => {
          ws.send(JSON.stringify({ event: "ping" }));
        }, 10000);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.event) {
          case "subscribed": {
            const channelName = JSON.parse(msg.data).channel;
            console.log(`Subscribed to channel ${channelName}`);
            break;
          }
          case "pong": {
            // console.log("Realtime pong");
            break;
          }
          default: {
            const evenData = JSON.parse(msg.data);
            console.log(`Realtime: ${msg.event}`, evenData);
            if (msg.event === "bookmark_updated") {
              // store.commit("upsertBookmark", evenData.data);
              console.log("upsertBookmark", evenData.data);
            }
            // if (msg.event === "bookmark_deleted") {
            //   store.commit("removeBookmark", evenData.data.id);
            // }
          }
        }
      };

      ws.onclose = (event) => {
        console.error("WS Closed", event);
        clearInterval(pingInterval);
      };
    },
  },
};
</script>

<style lang="scss">
$font-stack: -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
  "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

.void-bookmarklet {
  font-family: $font-stack;
  padding: 10px 20px;
  background: #fff;
  color: #333;
  position: relative;

  &.-bookmarklet {
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
    border-radius: 6px;
    width: 480px;

    @media screen and (min-width: 481px) {
      top: 30px;
      left: 30px;
      max-width: 60%;
      right: auto;
    }
  }

  .text {
    display: block;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: bold;
    line-height: 1.25;
    color: #2F2F2F;
    padding-right: 30px;
    margin: 5px 0;
  }

  .delete {
    position: absolute;
    display: block;
    cursor: pointer;
    top: 10px;
    right: 20px;
    line-height: 26px;
    font-size: 13px;
    color: #2F2F2F;
    text-decoration: underline;
  }

  .vue-input-tag-wrapper {
    padding: 4px 8px !important;
    margin-top: 10px;
    border-radius: 4px;
    border: solid 1px #d7d7d7 !important;

    > .input-tag {
      white-space: nowrap !important;
      color: #333 !important;
      border: 0 !important;
      margin-top: 3px !important;
      margin-bottom: 3px !important;
      font-family: $font-stack;
      padding: 5px !important;
      border-radius: 4px !important;
      background-color: #E9E9EA !important;
      font-size: 15px !important;
      line-height: 1;

      .remove {
        color: #333 !important;
        &:before {
          content: "×" !important;
        }
      }
    }

    > .new-tag {
      font-family: $font-stack;
      font-size: 15px !important;
      line-height: normal !important;
      margin-bottom: 0 !important;
      margin-top: 3px !important;
      margin-bottom: 3px !important;

      &:focus {
        margin-left: 5px;
      }
    }
  }

  .status-box {
    padding: 15px 0 0;
    line-height: 20px;

    .loading {
      float: left;
    }

    .saving-state {
      display: block;
      margin-left: 30px;
      font-size: 14px;
    }
  }

  .actions {
    float: right;
    display: flex;
    justify-content: flex-end;
    flex-flow: row;
    align-items: center;
    margin: 10px 0 0;
  }

  .read-it-later {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    margin-right: 12px;
  }

  .ui-button {
    display: inline-block;
    color: #fff;
    border-radius: 4px;
    padding: 0 8px;
    font-size: 14px;
    font-weight: 600;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.30);
    background-image: linear-gradient(-180deg, #717171 0%, #888888 100%);

    &:hover {
      background-image: linear-gradient(-180deg, #535252 0%, #5D5D5D 100%);
    }
  }
}
</style>
