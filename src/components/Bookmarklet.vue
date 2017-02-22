<template>
  <div class="void-bookmarklet">
    <span class="text"><strong>{{ host }}</strong> has been added to the void!</span>
    <tags-input :tags="tags" placeholder="Add tag (Press [TAB] to add)" @tags-change="tagsChange"></tags-input>
  </div>
</template>

<script>
import _ from "lodash";
import api from "helpers/api";
import TagsInput from "vue-tagsinput";

export default {
  name: "bookmarklet",

  components: { TagsInput },

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
      tags: []
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
      this.api().post("bookmarks", { url: window.location.href }).then(resp => {
        console.log("Bookmark found!", resp.data);
        this.bookmark = resp.data.data;
      }).catch(resp => {
        console.error("Error trying to find or create bookmark", resp);
      });
    },

    updateBookmark() {
      const tagNames = this.tags.map(t => this.cleanTag(t.text)).join(",");

      console.log("updateBookmark", tagNames);

      this.api().patch("bookmarks/" + this.bookmark.id, { tag_names: tagNames }).then(resp => {
        console.log("Bookmark saved!", resp.data);
        this.bookmark = resp.data.data;
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
  position: fixed;
  top: 30px;
  left: 30px;
  padding: 10px 20px;
  background: #fff;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  border-radius: 6px;
  max-width: 60%;

  .text {
    font-family: $font-stack;
    font-size: 19px;
    font-weight: 300;
    line-height: 24px;
    color: #444;
  }

  .tags-input {
    font-family: $font-stack;

    margin-top: 10px;
    outline: none;
    box-shadow: none;
    border: solid 1px #d7d7d7;
    border-radius: 4px;
  }
}
</style>
