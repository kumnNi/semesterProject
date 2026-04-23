import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

/** Component laden */
import PublicPage from "./components/authenticationManagement/PublicPage";
import TopMenu from "./components/utils/TopMenu";
import PrivatePage from "./components/authenticationManagement/PrivatePage";
import UserPage from "./components/authenticationManagement/PrivateUserPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserManagement from "./components/userManagement/UserManagement";
import StudienManagement from "./components/studienManagement/StudienManagement";
import BewerbungManagement from "./components/bewerbungManagement/BewerbungList";
import Profile from "./components/userManagement/Profile";
import MyBewerbung from "./components/bewerbungManagement/MyBewerbung";
import CreateUser from "./components/userManagement/CreateUser";
import UserEdit from "./components/userManagement/UserEdit";
import PublicUserEdit from "./components/userManagement/UserEditPublic";
import CreateStudien from "./components/studienManagement/CreateStudien";
import StudienEdit from "./components/studienManagement/StudienEdit";
import CreateApplication from "./components/bewerbungManagement/CreateApplication";
import CreateAppUser from "./components/bewerbungManagement/CreateAppUser";
import EditApplication from "./components/bewerbungManagement/EditApplication";
import Sidebar from "./components/utils/Sidebar";
import AboutUs from "./components/utils/AboutUs";

const mapStateToProps = (state) => {
  return state;
};
class App extends Component {
  render() {
    const user = this.props.root.user;
    // definiert page
    let workspace;
    let sideBarUserRoutes;
    let sidebar;

    if (user) {
      sidebar = <Sidebar {...this.props.root.user} />;
      console.log("user in der Appppppppppp......", user.isAdministrator);

      sideBarUserRoutes = (
        <Routes>
          <Route exact path="/" element={<PrivatePage />} />
          <Route exact path="/privatePage" element={<PrivatePage />} />
          <Route path="/privateUserPage" element={<UserPage />} />
          <Route
            path="/userManagement"
            id="OpenUserManagementPageButton"
            element={<UserManagement {...this.props.root.user} />}
          />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/userManagement/edit/:id" element={<UserEdit />} />
          <Route
            path="/userManagement/editPublic/:id"
            element={<PublicUserEdit />}
          />
          <Route
            path="/studienManagement"
            id="OpenStudienManagementPageButton"
            element={<StudienManagement />}
          />
          <Route path="/createStudien" element={<CreateStudien />} />
          <Route path="/studienManagement/edit/:id" element={<StudienEdit />} />
          <Route
            path="/bewerbungManagement"
            element={<BewerbungManagement />}
          />
          <Route
            path="/bewerbungManagement/edit/:id"
            element={<EditApplication />}
          />

          <Route
            path="/bewerbungManagement/createApplication/:id"
            element={
              <CreateApplication
                {...this.props.root.user}
                {...this.props.studienRe}
              />
            }
          />
          <Route
            path="/bewerbungManagement/createAppUser/:id"
            element={<CreateAppUser />}
          />
          <Route
            path="/profile"
            element={<Profile {...this.props.root.user} />}
          />
          <Route
            path="/myBewerbung"
            element={
              <MyBewerbung
                {...this.props.root.user}
                {...this.props.bewerbungRe}
              />
            }
          />
        </Routes>
      );
    } else {
      workspace = <PublicPage />;

      <Routes>
        <Route exact path="/" element={<PublicPage />} />
      </Routes>;
    }

    return (
      <Router>
        <div className="App">
          <TopMenu />
          {workspace}
          {sidebar}
          {sideBarUserRoutes}
        </div>
      </Router>
    );
  }
}
export default connect(mapStateToProps)(App);
