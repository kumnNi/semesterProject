import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { getLogoutAction } from "../../actions/AuthenticationActions";
import withWrap from "../utils/WithWrap";

class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirect: false,
    };
    this.logoutDialog = this.logoutDialog.bind(this);
  }

  logoutDialog() {
    const { navigate } = this.props;
    const dispatch = this.props.dispatch;
    navigate("/");
    dispatch(getLogoutAction());
  }

  render() {
    return (
      <div>
        <Button id="LogoutButton" variant="primary" onClick={this.logoutDialog}>
          {" "}
          Logout{" "}
        </Button>
      </div>
    );
  }
}
export default connect()(withWrap(LogoutButton));
