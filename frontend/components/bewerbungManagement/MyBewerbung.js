import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as bewerbungActions from "../../actions/BewerbungActions";
import ConfirmDialogBewerbungUser from "./ConfirmDialogBewerbungUser";
import {
  CardBody,
  CardText,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

const mapStateToProps = (state) => {
  return {
    accessToken: state.root.accessToken,
    dataUser: state.user.payload,
    dataStudien: state.studienRe.payload,
    dataBewerbung: state.bewerbungRe.payload,
  };
};

function MyBewerbung(props) {
  const dataAccessToken = props.accessToken;
  const navigate = useNavigate();
  const { dataBewerbung, getOneBewerbungAction, getDeleteBewerbungAction } =
    props;
  const [userIDToFinde, setUserIDToFinde] = useState();
  console.log("userIDToFinde........Mybwerbunng:", userIDToFinde);
  useEffect(() => {
    if (props.accessToken) {
      const decodedToken = atob(props.accessToken.split(".")[1]);
      const userInformation = JSON.parse(decodedToken);
      setUserIDToFinde(userInformation.user);
      getOneBewerbungAction(dataAccessToken, userIDToFinde);
    }
  }, [
    dataAccessToken,
    props.accessToken,
    getOneBewerbungAction,
    userIDToFinde,
  ]);

  const [open, setOpen] = useState(false);
  const [bewerbungIdToDelete, setBewerbungIdToDelete] = useState({});
  const handleDelete = (id) => {
    setOpen(true);
    setBewerbungIdToDelete({ id: id });
  };

  const handleConfirmDelete = (confirmed) => {
    const bewerbungIDToDel = bewerbungIdToDelete.id;
    if (confirmed) {
      getDeleteBewerbungAction(dataAccessToken, bewerbungIDToDel);
      navigate("/myBewerbung");
    } else {
      console.log("you not want delete");
    }
    setOpen(false);
  };

  const id = "DegreeCourseApplicationItem";
  console.log("dataBewerbung++++++ " + JSON.stringify(dataBewerbung));
  // const filteredBewerbungen = Array.isArray(dataBewerbung)
  //   ? dataBewerbung.filter((item) => item.applicantUserID === userIDToFinde)
  //   : [];
  const dataArray = Array.isArray(dataBewerbung)
    ? dataBewerbung
    : [dataBewerbung];
  const filteredBewerbungen = dataArray
    .filter((item) => item.applicatUserID === userIDToFinde)
    .map((item) => ({ ...item, id: item.id }));

  console.log(
    "filteredBewerbungen++++++ " + JSON.stringify(filteredBewerbungen)
  );
  return (
    <>
      <div
        className="container mt-5"
        id="DegreeCourseApplicationManagementPageListComponent"
      >
        <div className="row">
          <div className="col d-flex align-items-center">
            <h4> Mein Studienbewerbung-List </h4>
          </div>{" "}
        </div>
        <div className="row">
          {filteredBewerbungen.length > 0 ? (
            <div className="row-md-4">
              <Card>
                {filteredBewerbungen.map((item, index) => (
                  <div className="col-md-4" key={index}>
                    <Card id={id + item.id} className=" mb-5 mb-md-0">
                      <CardBody className="px-4 py-6 py-md-5 py-lg-6">
                        <CardTitle className="text-center mb-5">
                          {" "}
                          {item.applicantFirstName} :{item.universityShortName}
                          {item.targetPeriodShortName} {item.targetPeriodYear}
                        </CardTitle>

                        <CardText></CardText>

                        <ListGroup variant="flush">
                          <ListGroupItem>
                            Name : {item.applicantFirstName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Studiengang : {item.departmentName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Bewerbungsjahr : {item.targetPeriodYear}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Bewerbungssemester : {item.targetPeriodShortName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Universität : {item.universityShortName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Fachbereich : {item.departmentShortName}{" "}
                          </ListGroupItem>
                        </ListGroup>
                        <div className="d-flex">
                          <ConfirmDialogBewerbungUser
                            onClick={() => handleDelete(item.id)}
                            open={open && bewerbungIdToDelete.id === item.id}
                            closeDialog={() => setOpen(false)}
                            title={`${item.applicatUserID}: ${item.universityShortName}${item.targetPeriodShortName} ${item.targetPeriodYear} `}
                            onConfirm={handleConfirmDelete}
                            onCancel={() => setOpen(false)}
                            id={`DegreeCourseApplicationDeleteButton${item.id}`}
                            detail={`${item.id}`}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </Card>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getOneBewerbungAction: (accessToken, userID) =>
        bewerbungActions.getOneBewerbung(accessToken, userID),
      getDeleteBewerbungAction: (accessToken, userID) =>
        bewerbungActions.getDeleteBewerbungOne(accessToken, userID),
    },
    dispatch
  );
};

const ConnectMyBewerbungListAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyBewerbung);
export default ConnectMyBewerbungListAction;
