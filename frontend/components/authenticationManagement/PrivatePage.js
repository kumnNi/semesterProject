import React from "react";
import { connect } from "react-redux";
import "../../App.css";

const mapStateToProps = (state) => {
  console.log("Redux State: ", state);
  return {
    accessToken: state.root.accessToken,
    isAdministrator: state.root.isAdministrator,
  };
};

function PrivatePage(props) {
  if (!props.accessToken) {
    console.log("Kein AccessToken");
  }
  const token = props.accessToken;

  const decodedToken = atob(token.split(".")[1]);
  const userInformation = JSON.parse(decodedToken);
  const isAdmin = userInformation.isAdministrator;
  console.log("userInformation: " + isAdmin);
  if (isAdmin) {
    return (
      <div
        className="page-content"
        id="StartPage"
        style={{ background: "white" }}
      >
        <h4>
          {" "}
          Herzlich willkommen Adminstrator zur Online Studienbewerbeportal
        </h4>
      </div>
    );
  }
  return (
    <div
      className="page-content"
      id="StartPage"
      style={{ background: "white" }}
    >
      <h4> Herzlich willkommen zur Online Studienbewerbeportal</h4>
    </div>
  );
}

export default connect(mapStateToProps)(PrivatePage);
