<template>
  <div class="void-bookmarklet">
    <span class="text"><strong>{{ host }}</strong> has been added to the void!</span>
    <tags-input :tags="tags" placeholder="Add tag (Press [TAB] to add)" @tags-change="tagsChange"></tags-input>
    <div class="status-box">
      <loading :is-loading="isLoading" />
      <span class="saving-state" v-show="savingState" v-html="savingState"></span>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "helpers/api";
import TagsInput from "vue-tagsinput";
import Loading from "components/Loading";

export default {
  name: "bookmarklet",

  components: { Loading, TagsInput },

  props: {
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
  },

  data() {
    return {
      bookmark: {},
      tags: [],
      isLoading: true,
      savingState: ""
    };
  },

  created() {
    this.findOrCreateBookmark();
  },

  methods: {
    api() {
      return api.instance(this.apiRoot, this.apiToken);
    },

    tagsChange(index, value) {
      if (_.isString(value) && value.length) {
        // new tag added
        this.tags.splice(index, 0, { text: "#" + this.cleanTag(value) });
      } else {
        // tag removed
        this.tags = _.without(this.tags, this.tags[index]);
      }

      this.updateBookmark();
    },

    cleanTag(tag) {
      return tag.toLowerCase().replace(/[^a-z0-9\-\_]/, "");
    },

    findOrCreateBookmark() {
      this.savingState = "Creating bookmark&hellip;";
      this.api().post("bookmarks", { url: window.location.href }).then(resp => {
        this.bookmark = resp.data.data;

        setTimeout(() => {
          this.isLoading = false;
          this.savingState = "Bookmark already exists!";
        }, 100);
      }).catch(resp => {
        console.error("Error trying to find or create bookmark", resp);
      });
    },

    updateBookmark() {
      const tagNames = this.tags.map(t => this.cleanTag(t.text)).join(",");

      this.isLoading = true;
      this.savingState = "Saving tags&hellip;";

      this.api().patch("bookmarks/" + this.bookmark.id, { tag_names: tagNames }).then(resp => {
        this.bookmark = resp.data.data;

        setTimeout(() => {
          this.isLoading = false;
          this.savingState = "Bookmark saved!";
        }, 100);
      }).catch(resp => {
        console.error("Error updating bookmark", resp);
      });
    },
  }
};
</script>

<style lang="scss" scoped>
$font-stack: -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
  "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

.void-bookmarklet {
  font-family: $font-stack;
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #fff;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  border-radius: 6px;
  @media screen and (min-width: 481px) {
    top: 30px;
    left: 30px;
    max-width: 60%;
    right: auto;
  }
  color: #333;

  .text {
    font-size: 16px;
    @media screen and (min-width: 768px) {
      font-size: 19px;
    }
    font-weight: 300;
    line-height: 1.25;
    color: #444;
  }

  .tags-input {
    margin-top: 10px;
    outline: none;
    box-shadow: none;
    border: solid 1px #d7d7d7;
    border-radius: 4px;
  }

  .status-box {
    padding: 10px 0 0;
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
}
</style>
