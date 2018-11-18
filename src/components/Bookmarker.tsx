import React, { Component } from "react"
import Loading from "./Loading"
import lockOpen from "../assets/icon-lock-open.svg"
import lockClosed from "../assets/icon-lock-closed.svg"
import ReactTags, { Tag } from "react-tag-autocomplete"
import api from "../helpers/api"
import "./Bookmarker.scss"
import "./ReactTags.css"
import { AxiosInstance } from "axios";

interface IBookmark {
  public: boolean;
  tags: string[];
  metadata: object;
}

interface IBookmarkerProps {
  url: string;
  host: string;
  apiRoot: string;
  apiToken: string;
  containerClass?: string;
}

interface IBookmarkerState {
  isLoading: boolean;
  bookmark: IBookmark;
  tags: Tag[];
  suggestions: Tag[];
  feedPresent: boolean;
  isSubscribed: boolean;
}

function cleanTagName(tag: string) {
  return tag.toLowerCase().replace(/[^a-z0-9\-\_]/g, "")
}

export default class Bookmarker extends Component<IBookmarkerProps, IBookmarkerState> {
  state = {
    isLoading: true,
    bookmark: { public: false, tags: [], metadata: {} },
    tags: [],
    suggestions: [
      { id: 1, name: "ruby"  },
      { id: 2, name: "react"  }
    ],
    feedPresent: false,
    isSubscribed: false,
  }

  componentDidMount() {
    this.findOrCreateBookmark()
  }

  render() {
    const { host, containerClass } = this.props
    const { isLoading, bookmark, tags, suggestions, feedPresent, isSubscribed } = this.state

    return (
      <div className={`void-bookmarklet ${containerClass}`}>
        <span className="text">Added to the void</span>
        <span className="delete" onClick={() => {}}>Remove this page</span>
        {/* <input-tag :on-change="tagsChange" :tags="tags" placeholder="Add tags"></input-tag> */}
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleAddition={this.handleTagAdd}
          handleDelete={this.handleTagDelete}
          allowNew={true}
        />

        <div className="actions">
          <Loading isLoading={isLoading} />
          <div className="saving-state">{host}</div>
          <div className="rssfeed">
            <svg onClick={this.toggleFeedSubscription} width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="feed-icon" fill="#2F2F2F" fillRule="nonzero">
                  <path d="M2,0 L18,0 C19.1045695,-2.02906125e-16 20,0.8954305 20,2 L20,18 C20,19.1045695 19.1045695,20 18,20 L2,20 C0.8954305,20 1.3527075e-16,19.1045695 0,18 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z M5,16.5217391 C5.84043331,16.5217391 6.52173913,15.8404333 6.52173913,15 C6.52173913,14.1595667 5.84043331,13.4782609 5,13.4782609 C4.15956669,13.4782609 3.47826087,14.1595667 3.47826087,15 C3.47826087,15.8404333 4.15956669,16.5217391 5,16.5217391 Z M3.47826087,4.34782609 L3.47826087,6.63043478 C8.94130435,6.63043478 13.3695652,11.0586957 13.3695652,16.5217391 L15.6521739,16.5217391 C15.6521739,9.79793478 10.2020652,4.34782609 3.47826087,4.34782609 Z M8.80434783,16.5217391 L11.0869565,16.5217391 C11.0869565,12.3202174 7.68054348,8.91304348 3.47826087,8.91304348 L3.47826087,11.1956522 C6.41978261,11.1956522 8.80434783,13.5802174 8.80434783,16.5217391 Z" id="Combined-Shape"></path>
                </g>
              </g>
            </svg>
          </div>
          { bookmark.public ?
            <img src={lockOpen} className="visibility -public" onClick={this.toggleVisibility} />
            :
            <img src={lockClosed} className="visibility" onClick={this.toggleVisibility} />
          }
          <label className="read-it-later" htmlFor="bookmark_read_later" onClick={this.toggleReadLater}>
            <input type="checkbox" id="bookmark_read_later" name="bookmark_read_later" onClick={this.toggleReadLater} />
            Read later
          </label>
          <span className="ui-button" onClick={this.done}>Save</span>
        </div>
      </div>
    )
  }

  handleTagDelete = (i: number) => {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleTagAdd = (tag: Tag) => {
    tag.name = `#${cleanTagName(tag.name)}`
    const tags = [...this.state.tags, tag]
    this.setState({ tags })
  }

  toggleFeedSubscription = () => {}

  toggleVisibility = () => {}

  toggleReadLater = () => {}

  done = () => {}

  readLater = () => {
    // return this.state.tags.map(t => t.name).indexOf("#reading-list") > -1;
    return false
  }

  api = (): AxiosInstance => {
    return api.instance(this.props.apiRoot, this.props.apiToken)
  }

  findOrCreateBookmark = () => {
    const { url } = this.props
    this.api().post("bookmarks", { url: url }).then(resp => {
      console.log("findOrCreateBookmark", resp.data);
      const bookmark = resp.data.data as IBookmark
      const tags = bookmark.tags.map(t => ({ id: t, name: `#${t}` }));
      this.setState({ bookmark, tags })
      // this.checkFeedStatus(bookmark.metadata);

      if (resp.status === 202) {
        // this.$ga.event("bookmark", "added", "Added bookmark from browser extension", 1);
      } else {
        // this.$ga.event("bookmark", "readded", "Re-added bookmark from browser extension", 1);
      }

      setTimeout(() => {
        this.setState({ isLoading: false })
      }, 100);
    }).catch(err => {
      console.error("Error trying to find or create bookmark", err.response || err);
      if (err.response && err.response.status === 401) {
        // this.$emit("unauthorized", err);
      }
    });
  }
/*
  updateBookmark = () => {
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
  }

  deleteBookmark = () => {
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
  }

  disconnectWS = () => {
    if (ws && ws.readyState <= 1) {
      ws.close();
    }

    ws = null;
  }

  connectWS = () => {
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
  }
*/
}
