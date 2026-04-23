import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import UserSessionWidget from "../../components/authenticationManagement/UserSessionWidget";
import ImageLogo from "../../layout/images/BHT_Logo.svg";
import { Link } from "react-router-dom";

class TopMenu extends Component {
  render() {
    return (
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">
              <div>
                <img src={ImageLogo} width="470" alt="logo" />
              </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Link to={"/utils/AboutUs"}>Über uns</Link>
                <Nav.Link href="#action2">Kontakt</Nav.Link>
                <Nav.Link href="#action2">Impressum</Nav.Link>
              </Nav>
              <UserSessionWidget />
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}
export default TopMenu;
