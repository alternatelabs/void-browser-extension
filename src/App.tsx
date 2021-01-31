import React, { Component } from "react";
import Bookmarker from "./components/Bookmarker";
import { postRequest, buildURL } from "./helpers/api";
import "./assets/app-styles.css";
import voidIcon from "./assets/logo-dark.svg";
import storage from "./helpers/storage";

export type IAppProps = {
  url: string;
  host: string;
  apiRoot: string;
};

type IAppState = {
  token: string | null;
  email: string;
  password: string;
  passwordError: boolean;
};

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      token: null,
      email: "",
      password: "",
      passwordError: false,
    };

    this.fetchApiToken();
  }

  fetchApiToken = async () => {
    const data = await storage.get();

    if (typeof data.token === "string") this.setState({ token: data.token });
  };

  onSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = this.state;

    const params = {
      email,
      password,
    };

    this.setState({ passwordError: false }); // reset error state

    try {
      const resp = await postRequest(
        buildURL(this.props.apiRoot, "auth"),
        params
      );

      if (resp.status > 399)
        throw new Error(`${resp.status} Authentication failed`);

      const { secure_token, data } = await resp.json();

      console.log("Signed in", { secure_token, data });
      storage.set({
        token: secure_token,
        userData: data,
      });
      this.setState({ token: secure_token });
    } catch (err) {
      console.error("Error trying to sign in", err);
      this.setState({
        password: "",
        passwordError: true,
      });
    }
  };

  render() {
    const { token } = this.state;
    return (
      <div
        className="void-ext"
        style={{ minWidth: "480px", minHeight: "120px" }}
      >
        {token ? this.renderBookmarker() : this.renderLogin()}
      </div>
    );
  }

  renderBookmarker = () => {
    const { url, host, apiRoot } = this.props;
    return <Bookmarker url={url} host={host} apiRoot={apiRoot} />;
  };

  renderLogin = () => (
    <div className="container -auth">
      <div className="padded-box">
        <img src={voidIcon} alt="Void" width="69" height="20" />
      </div>

      {this.state.passwordError && (
        <div className="flash error">Bad email or password.</div>
      )}

      <div className="sign-in">
        <form className="-auth -fullwidth" onSubmit={this.onSignin}>
          <div className="contents">
            <h2 className="ui-heading">Please sign in</h2>

            <div className="field">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>

            <div className="field">
              <input
                placeholder="Password"
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>

            <div className="field">
              <input
                type="submit"
                value="Sign in"
                className="bordered-button -primary -large"
              />
            </div>
          </div>

          <ul className="other-links">
            {/* <li><a href="https://voidapp.co/signups/new" rel="noopener noreferrer" target="_blank">Sign Up</a></li> */}
            <li>
              <a
                href="https://voidapp.co/password_resets/new"
                rel="noopener noreferrer"
                target="_blank"
              >
                Forgot Password
              </a>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default App;
