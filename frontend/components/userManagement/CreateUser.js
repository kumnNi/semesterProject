import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import * as userAction from "../../actions/UserAction";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
  return { accessToken: state.root.accessToken };
};

function CreateUser(props) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    userID: "",
    password: "",
    firstName: "",
    lastName: "",
    isAdministrator: false,
  });

  const validationError = (userData) => {
    let temp = { ...errors };
    if ("userID" in userData) {
      temp.userID = userData.userID?.trim() === "" ? "userID is required" : "";
      console.log("userID is required");
    }

    if ("password" in userData) {
      temp.password =
        userData.password?.trim() === "" ? "Password is required" : "";
      console.log("Password is required");
    }
    if ("firstName" in userData) {
      temp.firstName =
        userData.firstName?.trim() === "" ? "firstName is required" : "";
      console.log("firstName is required");
    }
    if ("lastName" in userData) {
      temp.lastName =
        userData.lastName?.trim() === "" ? "lastName is required" : "";
      console.log("lastName is required");
    }
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleInput = (e) => {
    e.persist();
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: value,
    }));
    Object.values?.(errors)?.find((res) => res !== "")?.length > 0 &&
      validationError({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    const data = {
      userID: user.userID,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdministrator: user.isAdministrator,
    };

    const validationErrors = validationError(data);

    if (validationErrors) {
      const { addUserAction, accessToken } = props;
      const result = await addUserAction(accessToken, data);

      if (result && !result.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          userID: result.error || "Ein unbekannter Fehler ist aufgetreten.",
        }));
      } else {
        await addUserAction(accessToken, data);
        navigate("/userManagement");
      }
    }
  };

  return (
    <div id="UserManagementPageCreateComponent">
      <Container>
        <Row className="vh-20 d-flex justify-content-center align-items-center">
          <Col md={10} lg={8} xs={12}>
            <div className="border border-3 border-primary"></div>
            <div className="mb-3 mb-4">
              <h2 className="fw-bold mb-2 text-uppercase">Create new User</h2>
            </div>
            <form
              style={{
                position: "static",
                top: 95,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                margin: "0rem",
                padding: "0rem",
              }}
              onSubmit={saveUser}
            >
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">User ID</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="CreateUserComponentEditUserID"
                      name="userID"
                      value={user.userID}
                      onChange={handleInput}
                      placeholder="Enter userID"
                      className="form-control form-control-lg"
                    />
                    {errors.userID && (
                      <span style={{ color: "red" }}>{errors.userID}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Password</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="password"
                      id="CreateUserComponentEditPassword"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      placeholder="Enter Password"
                      className="form-control form-control-lg"
                    />
                    {errors.password && (
                      <span style={{ color: "red" }}>{errors.password}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">First Name</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="CreateUserComponentEditFirstName"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleInput}
                      placeholder="Enter First Name"
                      className="form-control form-control-lg"
                    />
                    {errors.firstName && (
                      <span style={{ color: "red" }}>{errors.firstName}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Last Name</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="CreateUserComponentEditLastName"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleInput}
                      placeholder="Enter Last Name"
                      className="form-control form-control-lg"
                    />
                    {errors.lastName && (
                      <span style={{ color: "red" }}>{errors.lastName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4 d-flex align-items-center">
                  <div className="form-outline datepicker w-100">
                    <label className="form-label">isAdministrator</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isAdministrator"
                      id="CreateUserComponentEditIsAdministrator"
                      value="true"
                      checked={user.isAdministrator === true}
                      onChange={handleInput}
                    />
                    <label className="form-check-label">
                      Administrator-Rechte
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  variant="primary"
                  id="CreateUserComponentCreateUserButton"
                  type="submit"
                >
                  Create a new User
                </Button>{" "}
                <Link to="/userManagement">
                  {" "}
                  <Button
                    variant="danger"
                    id="OpenUserManagementPageListComponentButton"
                    type="cancel"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addUserAction: userAction.createNewUser,
    },
    dispatch
  );
const ConnectUserAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);
export default ConnectUserAction;
