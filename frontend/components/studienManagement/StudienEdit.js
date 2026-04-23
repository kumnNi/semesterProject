import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import * as studienAction from "../../actions/StudienActions";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
  return {
    accessToken: state.root.accessToken,
    data: state.studienRe.payload,
  };
};

function StudienEdit(props) {
  const navigate = useNavigate();
  let { id } = useParams();
  const studienData = props.data.find((studien) => studien.id === id);

  const initialState = studienData || {
    id: id,
    name: "",
    shortName: "",
    universityName: "",
    universityShortName: "",
    departmentName: "",
    departmentShortName: "",
  };

  const [studien, setStudien] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudien((prevStudien) => ({ ...prevStudien, [name]: value }));
  };

  const saveUpdateStudien = (e) => {
    e.preventDefault();
    const data = {
      id: studien.id,
      name: studien.name,
      shortName: studien.shortName,
      universityName: studien.universityName,
      universityShortName: studien.universityShortName,
      departmentName: studien.departmentName,
      departmentShortName: studien.departmentShortName,
    };
    const { updateStudienAction, accessToken } = props;
    updateStudienAction(accessToken, data);
    navigate("/studienManagement");
  };

  return (
    <div id="DegreeCourseManagementPageEditComponent">
      <Container>
        <Row className="vh-20 d-flex justify-content-center align-items-center">
          <Col md={10} lg={8} xs={12}>
            <div className="border border-3 border-primary"></div>
            <div className="mb-3 mb-4">
              <h2 className="fw-bold mb-2 text-uppercase">Edit Studien</h2>
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
              onSubmit={saveUpdateStudien}
            >
              <div className="row">
                <div className="col-md-6 mb-4"></div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="hidden"
                      id="EditStudienComponentEditStudienID"
                      name="id"
                      value={studien.id}
                      className="form-control form-control-lg"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Studiengang-Name</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditName"
                      name="name"
                      value={studien.name}
                      onChange={handleInputChange}
                      placeholder="name"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">
                      Studiengang-Kurzbezeichnung
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditShortName"
                      name="shortName"
                      value={studien.shortName}
                      onChange={handleInputChange}
                      placeholder="Enter short Name"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">University-Name</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditUniversityName"
                      name="universityName"
                      value={studien.universityName}
                      onChange={handleInputChange}
                      placeholder="Enter universityName"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">
                      University-Kurzbezeichenung
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditUniversityShortName"
                      name="universityShortName"
                      value={studien.universityShortName}
                      onChange={handleInputChange}
                      placeholder="Enter university Short Name"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Fachbereuch-Name</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditDepartmentName"
                      name="departmentName"
                      value={studien.departmentName}
                      onChange={handleInputChange}
                      placeholder="Enter Department Name"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">
                      Fachbereich-Kurzbezeichnung
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditDepartmentShortName"
                      name="departmentShortName"
                      value={studien.departmentShortName}
                      onChange={handleInputChange}
                      placeholder="Enter department ShortName"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  variant="primary"
                  id="EditDegreeCourseComponentSaveDegreeCourseButton"
                  type="submit"
                >
                  Edit
                </Button>{" "}
                &nbsp; &nbsp;
                <Link to="/studienManagement">
                  {" "}
                  <Button
                    variant="danger"
                    id="OpenDegreeCourseManagementPageListComponentButton"
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
      updateStudienAction: studienAction.updateStudien,
    },
    dispatch
  );
const ConnectStudienAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudienEdit);
export default ConnectStudienAction;
