import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import UserImage from "../../layout/images/users-solid.svg";
import DashBoard from "../../layout/images/speedometer2.svg";
import Studiengaenge from "../../layout/images/university-solid.svg";
import Bewerbung from "../../layout/images/clipboard-list-solid.svg";
import Person from "../../layout/images/person-gear.svg";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  console.log("Redux State: ", state);
  return {
    accessToken: state.root.accessToken,
    isAdministrator: state.root.isAdministrator,
  };
};

function Sidebar(props) {
  const decodedToken = atob(props.accessToken.split(".")[1]);
  const userInformation = JSON.parse(decodedToken);
  const isAdmin = userInformation.isAdministrator;
  return (
    <div className="container-fluid" style={{ position: "absolute" }}>
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          {isAdmin ? (
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-black min-vh-100">
              <ul
                className="nav nav-pills flex-column mb-sm-auto align-items-center align-items-sm-start"
                id="menu"
              >
                <li>
                  <Link
                    to={"/privatePage"}
                    id="OpenStartPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img src={DashBoard} alt="DashBoard" className="fs-4" />
                    <span className="ms-1 d-none d-sm-inline"> Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/userManagement"}
                    id="OpenUserManagementPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img src={UserImage} alt="UserImage" className="fs-4" />
                    <span className="ms-1 d-none d-sm-inline">
                      {" "}
                      User Management{" "}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/studienManagement"}
                    id="OpenDegreeCourseManagementPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img
                      src={Studiengaenge}
                      alt="Studiengaenge"
                      className="fs-4"
                    />
                    <span className="ms-1 d-none d-sm-inline">
                      {" "}
                      Studiengänge
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/bewerbungManagement"}
                    id="OpenDegreeCourseApplicationManagementPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img src={Bewerbung} alt="Bewerbung" className="fs-4" />
                    <span className="ms-1 d-none d-sm-inline"> Bewerbung</span>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <ul>
                <li>
                  <Link
                    to={"/privateUserPage"}
                    id="OpenStartPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img src={DashBoard} alt="DashBoard" className="fs-4" />
                    <span className="ms-1 d-none d-sm-inline"> Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/profile"}
                    id="OpenProfileManagement"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img src={Person} alt="Person" className="fs-4" />
                    <span className="ms-1 d-none d-sm-inline">
                      {" "}
                      My Profil
                    </span>{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/studienManagement"}
                    id="OpenMyStudienManagementPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img
                      src={Studiengaenge}
                      alt="Studiengaenge"
                      id="OpenDegreeCourseManagementPageButton"
                      className="fs-4"
                    />
                    <span className="ms-1 d-none d-sm-inline">
                      {" "}
                      Studiengänge
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/myBewerbung"}
                    id="OpenMyDegreeCourseApplicationManagementPageButton"
                    className="nav-link px-0 align-middle"
                    data-bs-toggle="collapse"
                  >
                    <img src={Bewerbung} alt="Bewerbung" className="fs-4" />
                    <span className="ms-1 d-none d-sm-inline">
                      My Bewerbung
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default connect(mapStateToProps)(Sidebar);
