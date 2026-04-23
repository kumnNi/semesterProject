import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import * as studienActions from "../../actions/StudienActions";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
  return { accessToken: state.root.accessToken };
};

function CreateStudien(props) {
  //https://refine.dev/blog/usenavigate-react-router-redirect/#path-with-optional-second-argument
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [studien, setStudien] = useState({
    name: "",
    shortName: "",
    universityName: "",
    universityShortName: "",
    departmentName: "",
    departmentShortName: "",
  });

  //Validation Input
  const validationError = (studienData) => {
    let temp = { ...errors };
    if ("name" in studienData) {
      temp.name = studienData.name?.trim() === "" ? "name is required" : "";
      console.log("name is required");
    }
    if ("shortName" in studienData) {
      temp.shortName =
        studienData.shortName?.trim() === "" ? "shortName is required" : "";
      console.log("shortName is required");
    }
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };
  const handleInput = (e) => {
    e.persist();
    setStudien((prevStudien) => ({
      ...prevStudien,
      [e.target.name]: e.target.value,
    }));
    Object.values?.(errors)?.find((res) => res !== "")?.length > 0 &&
      validationError({ ...studien, [e.target.name]: e.target.value });
  };
  const saveStudien = (e) => {
    e.preventDefault();
    const data = {
      name: studien.name,
      shortName: studien.shortName,
      universityName: studien.universityName,
      universityShortName: studien.universityShortName,
      departmentName: studien.departmentName,
      departmentShortName: studien.departmentShortName,
    };
    const validationErrors = validationError(data);
    if (validationErrors) {
      const { addStudienAction, accessToken } = props;
      addStudienAction(accessToken, data);
      navigate("/studienManagement");
    }
  };

  return (
    <div>
      <Container id="DegreeCourseManagementPageCreateComponent">
        <Row className="vh-20 d-flex justify-content-center align-items-center">
          <Col md={10} lg={8} xs={12}>
            <div className="border border-3 border-primary"></div>
            <div className="mb-3 mb-4">
              <h2 className="fw-bold mb-2 text-uppercase">
                Create new Studien
              </h2>
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
              onSubmit={saveStudien}
            >
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
                      id="CreateDegreeCourseComponentEditName"
                      name="name"
                      value={studien.name}
                      onChange={handleInput}
                      placeholder="z.B Informatik Bachelor"
                      className="form-control form-control-lg"
                      {...(errors.name && {
                        errors: true,
                        helperText: errors.name,
                      })}
                    />
                    {errors.name && (
                      <span style={{ color: "red" }}>{errors.name}</span>
                    )}
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
                      id="CreateDegreeCourseComponentEditShortName"
                      name="shortName"
                      value={studien.shortName}
                      onChange={handleInput}
                      placeholder="z.B. IT-BA"
                      className="form-control form-control-lg"
                    />
                    {errors.shortName && (
                      <span style={{ color: "red" }}>{errors.shortName}</span>
                    )}
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
                      id="CreateDegreeCourseComponentEditUniversityName"
                      name="universityName"
                      value={studien.universityName}
                      onChange={handleInput}
                      placeholder="z.B. Berliner Hochschule für Technik"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">
                      University-Kurzbezeichnung
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="CreateDegreeCourseComponentEditUniversityShortName"
                      name="universityShortName"
                      value={studien.universityShortName}
                      onChange={handleInput}
                      placeholder="z.B. BHT"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Fachbereich-Name</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="CreateDegreeCourseComponentEditDepartmentName"
                      name="departmentName"
                      value={studien.departmentName}
                      onChange={handleInput}
                      placeholder="z.B. Informatik und Medien"
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
                      id="CreateDegreeCourseComponentEditDepartmentShortName"
                      name="departmentShortName"
                      value={studien.departmentShortName}
                      onChange={handleInput}
                      placeholder="z.B. FB VI"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  variant="primary"
                  id="CreateDegreeCourseComponentCreateDegreeCourseButton"
                  type="submit"
                >
                  Create a new Studien
                </Button>{" "}
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
      addStudienAction: studienActions.createNewStudien,
    },
    dispatch
  );
const ConnectStudienAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateStudien);
export default ConnectStudienAction;
