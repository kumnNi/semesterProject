import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import * as userAction from "../../actions/UserAction";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
  return {
    accessToken: state.root.accessToken,
    data: state.user.payload,
  };
};

function UserEdit(props) {
  const navigate = useNavigate();
  let { id } = useParams();
  console.log("prop data", JSON.stringify(props.data));
  const data = props.data || [];
  console.log("data Dataaaa data: ", data);
  const userData = data._id === id ? data : null;
  const initialState = userData || {
    userID: "",
    password: "",
    firstName: "",
    lastName: "",
    isAdministrator: "",
  };

  const [user, setUser] = useState(initialState);

  console.log("Updated User Dataaaa: ", user);
  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const { name } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  console.log("prop data user user user", user);
  const saveUpdateUser = (e) => {
    e.preventDefault();
    const data = {
      userID: user.userID,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdministrator: user.isAdministrator,
    };
    console.log("prop data user data data data......", data);
    const { updateUserAction, accessToken } = props;
    updateUserAction(accessToken, data);
    navigate("/profile");
  };

  return (
    <div id="UserManagementPageEditComponent">
      <Container>
        <Row className="vh-20 d-flex justify-content-center align-items-center">
          <Col md={10} lg={8} xs={12}>
            <div className="border border-3 border-primary"></div>
            <div className="mb-3 mb-4">
              <h2 className="fw-bold mb-2 text-uppercase">Edit User</h2>
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
              onSubmit={saveUpdateUser}
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
                      style={{ background: "#E4E4E4" }}
                      type="text"
                      id="EditUserComponentEditUserID"
                      name="userID"
                      value={user.userID}
                      placeholder="Enter userID"
                      className="form-control form-control-lg"
                      readOnly
                    />
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
                      id="EditUserComponentEditPassword"
                      name="password"
                      value={user.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="form-control form-control-lg"
                    />
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
                      id="EditUserComponentEditFirstName"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter First Name"
                      className="form-control form-control-lg"
                    />
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
                      id="EditUserComponentEditLastName"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter Last Name"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <Button
                  variant="primary"
                  id="EditUserComponentSaveUserButton"
                  type="submit"
                >
                  Edit
                </Button>{" "}
                &nbsp; &nbsp;
                <Link to="/profile">
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
      updateUserAction: userAction.updateUser,
    },
    dispatch
  );
const ConnectUserAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserEdit);
export default ConnectUserAction;
