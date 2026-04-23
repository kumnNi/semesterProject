import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Person from "../../layout/images/person.svg";
import Lock from "../../layout/images/lock.svg";
import LogOutButton from "./LogoutButton";
import * as authenticationActions from "../../actions/AuthenticationActions";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
  return {
    root: state.root,
    showLoginDialog: state.root.showLoginDialog,
  };
};

class UserSessionWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isError: false,
      isLoggedIn: false,
      errorMessage: "",
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleClose() {
    const { hideLoginDialogAction } = this.props;
    hideLoginDialogAction();
  }

  handleShow() {
    const { showLoginDialogAction } = this.props;
    showLoginDialogAction();
  }

  handleChange(e) {
    const { name, value } = e.target;
    //this.setState({ [name]: value });
    this.setState({
      [name]: value,
      ...(name === "password" && { isError: false, errorMessage: "" }),
    });
    // this.setState({
    //   [name]: value,
    //   isError: false, // Fehlermeldung zurücksetzen
    //   errorMessage: "", // Fehlernachricht bei jeder Änderung zurücksetzen
    // });
    console.log("nane Value......", name, value);
  }

  canLogin() {
    const { userID, password } = this.state;
    if (userID && password) {
      return true;
    }
    return false;
  }

  handleSubmit(e) {
    e.preventDefault();
    const { userID, password } = this.state;
    if (this.state.isLoggedIn) {
      this.setState({ isError: true });
    }
    const { authenticateUserAction } = this.props;
    console.log(
      "bin hier im authenticateUserAction....",
      authenticateUserAction
    );
    const isAuthenticate = authenticateUserAction(userID, password);
    if (isAuthenticate) {
      console.log("bin hier im nachdem isAuthenticate wahr");
      this.setState({
        isError: false,
        userID: undefined,
        password: undefined,
        errorMessage: "",
      });
    } else {
      console.log("bin hier im nachdem isAuthenticate false");

      this.setState({
        isError: true,
        errorMessage: this.props.root.errorMessage,
      });
    }
  }

  handleLogout() {
    const { logoutDialogAction } = this.props;
    logoutDialogAction();
  }

  render() {
    const { isLoggedIn, pending, errorMessage } = this.props.root;
    let loginButton;
    var showDialog = this.props.showLoginDialog;
    if (showDialog === undefined) {
      showDialog = false;
    }

    if (this.canLogin()) {
      loginButton = (
        <Button
          id="PerformLoginButton"
          variant="primary"
          type="submit"
          onClick={this.handleSubmit}
        >
          Login{" "}
        </Button>
      );
    } else {
      loginButton = (
        <Button
          id="PerformLoginButton"
          variant="primary"
          type="submit"
          disabled
        >
          Login{" "}
        </Button>
      );
    }

    return (
      <div>
        {isLoggedIn ? (
          <LogOutButton />
        ) : (
          <Button
            id="OpenLoginDialogButton"
            variant="primary"
            onClick={this.handleShow}
          >
            {" "}
            Login{" "}
          </Button>
        )}
        <Modal id="LoginDialog" show={showDialog} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>
                  <img src={Person} alt="Person" />
                </Form.Label>
                <Form.Control
                  id="LoginDialogUserIDText"
                  type="text"
                  placeholder="user ID"
                  name="userID"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <img src={Lock} alt="Lock" />
                </Form.Label>
                <Form.Control
                  id="LoginDialogPasswordText"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleChange}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group>
                <div className="d-flex align-items-center">
                  {loginButton}
                  {pending && <Spinner animation="border" variant="primary" />}

                  {this.state.isError && (
                    <span style={{ color: "red", marginLeft: "1rem" }}>
                      {errorMessage}
                    </span>
                  )}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>Password vergessen ?</Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoginDialogAction: authenticationActions.getShowLoginDialogAction,
      hideLoginDialogAction: authenticationActions.getHideLoginDialogAction,
      authenticateUserAction: authenticationActions.authenticateUser,
      logoutDialogAction: authenticationActions.getLogoutAction,
    },
    dispatch
  );
const ConnectUserSessionWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSessionWidget);
export default ConnectUserSessionWidget;
