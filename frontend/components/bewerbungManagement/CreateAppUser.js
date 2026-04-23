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
  };
};

function CreateAppUser(props) {
  const navigate = useNavigate();
  let { id } = useParams();
  const studienData = props.dataStudien.find((studien) => studien.id === id);

  const accToken = props.accessToken;
  let userIDInToken;
  if (accToken) {
    const decodToken = atob(accToken.split(".")[1]);
    const userInfo = JSON.parse(decodToken);
    userIDInToken = userInfo.user;
  }

  const [errors, setErrors] = useState({});
  const [bewerbung, setBewerbung] = useState({
    applicantUserID: "",
    degreeCourseID: "",
    targetPeriodYear: "",
    targetPeriodShortName: "",
  });

  //Validation Input
  const validationError = (bewerbungData) => {
    let temp = { ...errors };
    if ("targetPeriodYear" in bewerbungData) {
      const year = bewerbungData.targetPeriodYear?.trim();
      if (year === "") {
        temp.targetPeriodYear = "Year is required";
        console.log("Year is required");
      } else if (!/^\d{4}$/.test(year)) {
        temp.targetPeriodYear = "Year must be a 4-digit number";
        console.log("Year must be a 4-digit number");
      } else {
        temp.targetPeriodYear = "";
      }
    }

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };
  const handleInput = (e) => {
    e.persist();
    setBewerbung((prevBewerbung) => ({
      ...prevBewerbung,
      [e.target.name]: e.target.value,
    }));
    Object.values?.(errors)?.find((res) => res !== "")?.length > 0 &&
      validationError({ ...bewerbung, [e.target.name]: e.target.value });
  };
  const saveBewerbung = (e) => {
    e.preventDefault();

    const data = {
      applicantUserID: userIDInToken,
      degreeCourseID: studienData.id,
      targetPeriodYear: bewerbung.targetPeriodYear,
      targetPeriodShortName: bewerbung.targetPeriodShortName,
    };

    const validationErrors = validationError(data);

    if (validationErrors) {
      const { addBewerbungAction, accessToken } = props;
      addBewerbungAction(accessToken, data);
      navigate("/myBewerbung");
      alert("success");
    }
  };

  return (
    <div>
      <Container>
        <Row className="vh-20 d-flex justify-content-center align-items-center">
          <Col md={10} lg={8} xs={12}>
            <div className="border border-3 border-primary"></div>
            <div className="mb-3 mb-4">
              <h2 className="fw-bold mb-2 text-uppercase">
                Create new Application
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
              onSubmit={saveBewerbung}
            >
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <label className="form-label">Studiengang</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="hidden"
                      name="degreeCourseID"
                      value={studienData.id}
                      onChange={handleInput}
                      id="CreateDegreeCourseApplicationEditID"
                    />
                    <input
                      type="text"
                      style={{ background: "#E4E4E4" }}
                      id="CreateDegreeCourseApplicationEditShortNameDepartmentName"
                      name="displayedName"
                      value={`${studienData.shortName}: ${studienData.departmentName} `}
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
                    <label className="form-label">User-ID</label>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      style={{ background: "#E4E4E4" }}
                      id="CreateDegreeCourseApplicationEditUserID"
                      name="applicantUserID"
                      value={userIDInToken}
                      onChange={handleInput}
                      className="form-control form-control-lg"
                      readOnly
                    />
                    {errors.applicantUserID && (
                      <span style={{ color: "red" }}>
                        {errors.applicantUserID}
                      </span>
                    )}
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
                      type="number"
                      id="CreateDegreeCourseApplicationEditTargetPeriodYear"
                      name="targetPeriodYear"
                      value={bewerbung.targetPeriodYear}
                      onChange={handleInput}
                      placeholder="z.B. 2024"
                      className="form-control form-control-lg"
                    />
                    {errors.targetPeriodYear && (
                      <span style={{ color: "red" }}>
                        {errors.targetPeriodYear}
                      </span>
                    )}
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
                      onChange={handleInput}
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
                  id="CreateDegreeCourseApplicationCreateButton"
                  type="submit"
                >
                  Create a new Aplication
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
      addBewerbungAction: bewerbungActions.createNewBewerbung,
    },
    dispatch
  );
const ConnectBewerbungUserAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAppUser);
export default ConnectBewerbungUserAction;
