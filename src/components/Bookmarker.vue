<template>
  <div :class="containerClass">
    <span class="text">Added to the void</span>
    <span class="delete" @click="deleteBookmark">Remove this page</span>
    <input-tag :on-change="tagsChange" :tags="tags" placeholder="Add tags"></input-tag>

    <div class="actions">
      <loading :is-loading="isLoading" />
      <div class="saving-state" v-text="host"></div>
      <div class="rssfeed" :class="{ '-disabled': !feedPresent, '-active': isSubscribed }" v-tooltip.left="feedTitle">
        <svg @click="toggleFeedSubscription" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <!-- Generator: Sketch 49.1 (51147) - http://www.bohemiancoding.com/sketch -->
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="feed-icon" fill="#2F2F2F" fill-rule="nonzero">
              <path d="M2,0 L18,0 C19.1045695,-2.02906125e-16 20,0.8954305 20,2 L20,18 C20,19.1045695 19.1045695,20 18,20 L2,20 C0.8954305,20 1.3527075e-16,19.1045695 0,18 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z M5,16.5217391 C5.84043331,16.5217391 6.52173913,15.8404333 6.52173913,15 C6.52173913,14.1595667 5.84043331,13.4782609 5,13.4782609 C4.15956669,13.4782609 3.47826087,14.1595667 3.47826087,15 C3.47826087,15.8404333 4.15956669,16.5217391 5,16.5217391 Z M3.47826087,4.34782609 L3.47826087,6.63043478 C8.94130435,6.63043478 13.3695652,11.0586957 13.3695652,16.5217391 L15.6521739,16.5217391 C15.6521739,9.79793478 10.2020652,4.34782609 3.47826087,4.34782609 Z M8.80434783,16.5217391 L11.0869565,16.5217391 C11.0869565,12.3202174 7.68054348,8.91304348 3.47826087,8.91304348 L3.47826087,11.1956522 C6.41978261,11.1956522 8.80434783,13.5802174 8.80434783,16.5217391 Z" id="Combined-Shape"></path>
            </g>
          </g>
        </svg>
      </div>
      <img v-if="bookmark.public" :src="lockOpen" v-tooltip.left="'Public - visible to others'" class="visibility -public" @click="toggleVisibility" />
      <img v-else :src="lockClosed" v-tooltip.left="'Private - only you can see this'" class="visibility" @click="toggleVisibility" />
      <label class="read-it-later" for="bookmark_read_later" @click.prevent="toggleReadLater">
        <input type="checkbox" v-model="readLater" id="bookmark_read_later" name="bookmark_read_later" @click.prevent="toggleReadLater">
        Read later
      </label>
      <span class="ui-button" @click="done">Save</span>
    </div>
  </div>
</template>

<script>
import api from "helpers/api";
import InputTag from "vue-input-tag";
import Loading from "components/Loading";
import ReconnectingWebSocket from "reconnectingwebsocket";
import lockClosed from "assets/icon-lock-closed.svg";
import lockOpen from "assets/icon-lock-open.svg";

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
      bookmark: {},
      tags: [],
      isLoading: true,
      feedPresent: false,
      isSubscribed: false,
      lockClosed,
      lockOpen,
    };
  },

  computed: {
    feedTitle() {
      if (!this.feedPresent) return "No feed detected";
      if (!this.isSubscribed) return "Subscribe to feed";
      return "Unsubscribe from feed";
    },
    readLater() {
      return this.tags.indexOf("#reading-list") > -1;
    },
  },

  created() {
    this.connectWS();
    this.findOrCreateBookmark();
  },

  methods: {
    api() {
      return api.instance(this.apiRoot, this.apiToken);
    },

    checkFeedStatus(metadata) {
      if (!metadata || !metadata.feed_url || !metadata.feed_id) return;

      this.feedPresent = true;

      this.api().get(`feeds/${metadata.feed_id}`)
        .then(() => {
          this.isSubscribed = true;
        })
        .catch(err => console.error(err));
    },

    toggleFeedSubscription() {
      if (!this.feedPresent) return;

      if (this.isSubscribed) {
        this.api().delete(`feeds/${this.bookmark.metadata.feed_id}`)
          .then(() => {
            this.isSubscribed = false;
            this.$ga.event("feed", "unsubscribe", "Updated feed subscription", 1);
          });
      } else {
        this.api().post("feeds", { url: this.bookmark.metadata.feed_url })
          .then(() => {
            this.isSubscribed = true;
            this.$ga.event("feed", "subscribe", "Updated feed subscription", 1);
          });
      }
    },

    toggleReadLater() {
      if (this.readLater) {
        const index = this.tags.indexOf("#reading-list");
        this.tags.splice(index, 1);
      } else {
        this.tags.push("#reading-list");
      }
      this.updateBookmark();
    },

    toggleVisibility() {
      this.bookmark.public = !this.bookmark.public;
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
        this.tags = this.bookmark.tags.map(t => `#${t}`);
        this.checkFeedStatus(this.bookmark.metadata);

        if (resp.status === 202) {
          this.$ga.event("bookmark", "added", "Added bookmark from browser extension", 1);
        } else {
          this.$ga.event("bookmark", "readded", "Re-added bookmark from browser extension", 1);
        }

        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      }).catch(err => {
        console.error("Error trying to find or create bookmark", err);
        if (err.response && err.response.status === 401) {
          this.$emit("unauthorized", err);
        }
      });
    },

    updateBookmark() {
      const tags = this.tags.map(t => this.cleanTag(t));

      const params = {
        tags,
        public: this.bookmark.public,
      };

      this.isLoading = true;

      this.api().put("bookmarks/" + this.bookmark.id, params).then(resp => {
        this.bookmark = resp.data.data;
        this.tags = this.bookmark.tags.map(t => `#${t}`);

        this.$ga.event("bookmark", "updated", "Updated bookmark in browser extension", 2);

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

        this.$ga.event("bookmark", "removed", "Removed bookmark in browser extension", 2);
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
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.event) {
          case "subscribed": {
            const channelName = JSON.parse(msg.data).channel;
            console.log(`Subscribed to channel ${channelName}`);
            break;
          }
          default: {
            const evenData = JSON.parse(msg.data);
            console.log(`Realtime: ${msg.event}`, evenData);
            if (msg.event === "bookmark_updated") {
              console.log("upsertBookmark", evenData.data);
              this.bookmark = evenData.data;
            }
          }
        }
      };

      ws.onclose = (event) => {
        console.error("WS Closed", event);
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

  .saving-state {
    display: block;
    line-height: 20px;
    flex: 1;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 14px;
  }

  .rssfeed {
    margin-right: 10px;
    cursor: pointer;

    > svg { display: block; }

    &.-active #feed-icon {
      fill: #FF6600;
    }
    &.-disabled {
      cursor: default;
      #feed-icon { fill: #d7d7d7; }
    }
  }

  .visibility {
    margin-right: 10px;
    cursor: pointer;

    &.-public {
      opacity: .2;
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
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

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 2px;
    padding: 2px 7px;
    font-size: 12px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>
