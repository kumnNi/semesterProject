import React, { Component } from "react";

/** import css */
import "../../layout/css/style.css";
import "../../layout/css/theme.css";

/** import Component */
import LoginButton from "./LoginButton";
import ImageHomePage from "../../layout/images/hero_header.png";

class PublicPage extends Component {
  render() {
    return (
      <div className="page-content " id="LandingPage">
        <section className="banner">
          <div className="banner-image">
            <img src={ImageHomePage} width="470" alt="hero-header" />
          </div>
          <div className="banner-content" style={{ padding: "5rem" }}>
            <h4>Studien Bewerbung Portal</h4>
            <h1> Online Bewerbung: Finde Meisten Lehrveranstaltungen</h1>
            <LoginButton />
          </div>
        </section>
     
      </div>
    );
  }
}
export default PublicPage;
