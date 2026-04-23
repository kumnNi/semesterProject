import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import * as bewerbungActions from "../../actions/BewerbungActions";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
  return {
    accessToken: state.root.accessToken,
    dataUser: state.user.payload,
    dataStudien: state.studienRe.payload,
    dataBewerbung: state.bewerbungRe.payload,
  };
};

function EditApplication(props) {
  const navigate = useNavigate();
  let { id } = useParams();
  const bewerbungData = props.dataBewerbung.find(
    (dataBewerbung) => dataBewerbung.id === id
  );
  const initialState = bewerbungData || {
    id: id,
    applicantUserID: "",
    degreeCourseID: "",
    targetPeriodYear: "",
    targetPeriodShortName: "",
  };

  const [bewerbung, setBewerbung] = useState(initialState);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBewerbung((prevBewerbung) => ({ ...prevBewerbung, [name]: value }));
  };

  const saveUpdateBewerbung = (e) => {
    e.preventDefault();
    const data = {
      id: bewerbung.id,
      applicantUserID: bewerbung.applicantUserID,
      degreeCourseID: bewerbung.degreeCourseID,
      targetPeriodYear: bewerbung.targetPeriodYear,
      targetPeriodShortName: bewerbung.targetPeriodShortName,
    };
    const { updateApplicationAction, accessToken } = props;
    updateApplicationAction(accessToken, data);
    navigate("/myBewerbung");
  };

  return (
    <div id="DegreeCourseApplicationManagementPageEditComponent">
      <Container>
        <Row className="vh-20 d-flex justify-content-center align-items-center">
          <Col md={10} lg={8} xs={12}>
            <div className="border border-3 border-primary"></div>
            <div className="mb-3 mb-4">
              <h2 className="fw-bold mb-2 text-uppercase">
                Edit Studienbewerbung
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
              onSubmit={saveUpdateBewerbung}
            >
              <div className="row">
                <div className="col-md-6 mb-4"></div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="hidden"
                      id="EditStudienComponentEditStudienID"
                      name="id"
                      value={bewerbung.id}
                      className="form-control form-control-lg"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">applicantUserID</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      style={{ background: "#E4E4E4" }}
                      type="text"
                      id="EditDegreeCourseComponentEditName"
                      name="applicantUserID"
                      value={bewerbung.applicantUserID}
                      onChange={handleInputChange}
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">degreeCourseID</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="hidden"
                      id="EditDegreeCourseComponentEditShortName"
                      name="degreeCourseID"
                      value={bewerbung.degreeCourseID}
                      onChange={handleInputChange}
                      className="form-control form-control-lg"
                    />
                    <input
                      style={{ background: "#E4E4E4" }}
                      type="text"
                      id="CreateDegreeCourseApplicationEditShortNameDepartmentName"
                      name="displayedName"
                      value={`${bewerbung.degreeCourseShortName}: ${bewerbung.degreeCourseName} `}
                      placeholder=""
                      className="form-control form-control-lg"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Year</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="EditDegreeCourseComponentEditUniversityName"
                      name="targetPeriodYear"
                      value={bewerbung.targetPeriodYear}
                      onChange={handleInputChange}
                      placeholder="targetPeriodYear"
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Semester</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <select
                      name="targetPeriodShortName"
                      onChange={handleInputChange}
                      value={bewerbung.targetPeriodShortName}
                      className="form-control form-control-lg"
                      id="CreateDegreeCourseApplicationEditTargetPeriodName"
                    >
                      <option>Bitte Semester auswählen</option>
                      <option value="WiSe">Wintersemester</option>
                      <option value="SoSe">Sommersemester</option>
                    </select>
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
                <Link to="/myBewerbung">
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
      updateApplicationAction: bewerbungActions.updateApplication,
    },
    dispatch
  );
const ConnectApplicationEditAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditApplication);
export default ConnectApplicationEditAction;
