import React, { Component } from 'react';
import Bookmarker from "./components/Bookmarker"
import api from "./helpers/api"
import "./assets/app-styles.css"
import voidIcon from "./assets/logo-dark.svg"

interface IAppProps {
  url: string;
  host: string;
  apiRoot: string;
}

interface IAppState {
  token: string | null;
  email: string;
  password: string;
  passwordError: boolean;
}

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)

    this.state = {
      token: localStorage.getItem("apiToken"),
      email: "",
      password: "",
      passwordError: false
    }
  }

  render() {
    const { url, host, apiRoot } = this.props
    const { token } = this.state
    return (
      <div className="void-ext" style={{ minWidth: "480px", minHeight: "120px" }}>
        { token ?
          this.renderBookmarker()
        :
          this.renderLogin()
        }

      </div>
    );
  }

  renderBookmarker = () => {
    const { url, host, apiRoot } = this.props
    const apiToken = this.state.token as string
    return (
      <Bookmarker
        url={url}
        host={host}
        apiRoot={apiRoot}
        apiToken={apiToken}
      />
    )
  }

  renderLogin = () => (
    <div className="container -auth">
      <div className="padded-box">
        <img src={voidIcon} width="69" height="20" />
      </div>

      { this.state.passwordError &&
        <div className="flash error">Bad email or password.</div>
      }

      <div className="sign-in">
        <form className="-auth -fullwidth" onSubmit={this.onSignin}>
          <div className="contents">
            <h2 className="ui-heading">Please sign in</h2>

            <div className="field">
              <input type="email" placeholder="Email" onChange={(e) => this.setState({ email: e.target.value }) } />
            </div>

            <div className="field">
              <input placeholder="Password" type="password" onChange={(e) => this.setState({ password: e.target.value }) } />
            </div>

            <div className="field">
              <input type="submit" value="Sign in" className="bordered-button -primary -large" />
            </div>
          </div>

          <ul className="other-links">
            {/* <li><a href="https://voidapp.co/signups/new" target="_blank">Sign Up</a></li> */}
            <li><a href="https://voidapp.co/password_resets/new" target="_blank">Forgot Password</a></li>
          </ul>
        </form>
      </div>

    </div>
  )

  onSignin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const params = {
      email: this.state.email,
      password: this.state.password
    };

    this.setState({ passwordError: false }) // reset error state

    api.instance(this.props.apiRoot, null).post("auth", params).then(resp => {
      console.log("Signed in", resp)
      localStorage.setItem("apiToken", resp.data.secure_token)
      localStorage.setItem("userData", JSON.stringify(resp.data.data))
      this.setState({ token: resp.data.secure_token })
    }).catch(resp => {
      console.error("Error trying to sign in", resp);
      this.setState({
        password: "",
        passwordError: true
      })
    });
  }
}

export default App;
