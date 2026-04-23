import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as bewerbungActions from "../../actions/BewerbungActions";
import ConfirmDialogBewerbung from "./ConfirmDialogBewerbung";
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

function BewerbungList(props) {
  const accessToken = props.accessToken;

  const { dataBewerbung, getAllBewerbungAction, getDeleteBewerbungAction } =
    props;

  console.log("Data User..." + JSON.stringify(dataBewerbung));
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Fetch Bewerbung data.....++++1 ");
    getAllBewerbungAction(accessToken);
  }, [accessToken, getAllBewerbungAction]);

  const [open, setOpen] = useState(false);
  const [bewerbungIdToDelete, setBewerbungIdToDelete] = useState({});
  //const [selectedID, setSelectedID] = useState(null);
  const handleDelete = (id) => {
    setOpen(true);
    setBewerbungIdToDelete({ id: id });
  };

  const handleConfirmDelete = (confirmed) => {
    const bewerbungIDToDel = bewerbungIdToDelete.id;

    if (confirmed) {
      getDeleteBewerbungAction(accessToken, bewerbungIDToDel);
      navigate("/bewerbungManagement");
    } else {
      console.log("you not want delete");
    }
    setOpen(false);
  };

  const id = "DegreeCourseApplicationItem";
  return (
    <>
      <div
        className="container mt-5"
        id="DegreeCourseApplicationManagementPage"
      >
        <div className="row">
          <div className="col d-flex align-items-center">
            <h4> Studienbewerbung-List </h4>
          </div>{" "}
        </div>
        <div
          className="row"
          id="DegreeCourseApplicationManagementPageListComponent"
        >
          {Array.isArray(dataBewerbung) && dataBewerbung.length > 0 ? (
            <div className="row-md-4">
              <Card>
                {dataBewerbung.map((item, index) => (
                  <div className="col-md-4">
                    <Card
                      key={index}
                      id={id + item.id}
                      className=" mb-5 mb-md-0"
                    >
                      <CardBody className="px-4 py-6 py-md-5 py-lg-6">
                        <CardTitle className="text-center mb-5">
                          {" "}
                          {item.applicantFirstName} :{item.universityShortName}
                          {item.targetPeriodShortName} {item.targetPeriodYear}
                        </CardTitle>
                        <CardText></CardText>
                        <ListGroup variant="flush">
                          <ListGroupItem>
                            <strong> ApplicantUserID : </strong>
                            {item.applicantFirstName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            <strong> Studiengang :</strong>{" "}
                            {item.departmentName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            <strong> Bewerbungsjahr :</strong>{" "}
                            {item.targetPeriodYear}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            <strong> Bewerbungssemester :</strong>{" "}
                            {item.targetPeriodShortName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            <strong> Universität :</strong>{" "}
                            {item.universityShortName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            <strong> Fachbereich :</strong>{" "}
                            {item.departmentShortName}{" "}
                          </ListGroupItem>
                        </ListGroup>
                        <div className="d-flex">
                          <Button
                            variant="primary"
                            style={{
                              marginRight: "9px",
                            }}
                          >
                            <Link
                              to={`/bewerbungManagement/edit/${item.id}`}
                              id={`DegreeCourseApplicationItemEditButton${item.applicatUserID}`}
                            >
                              Edit
                            </Link>
                          </Button>
                          <ConfirmDialogBewerbung
                            onClick={() => handleDelete(item.id)}
                            open={open && bewerbungIdToDelete.id === item.id}
                            closeDialog={() => setOpen(false)}
                            title={`${item.applicantUserID}: ${item.universityShortName}${item.targetPeriodShortName} ${item.targetPeriodYear} `}
                            onConfirm={handleConfirmDelete}
                            onCancel={() => setOpen(false)}
                            id={`DegreeCourseApplicationItemDeleteButton${item.id}`}
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
      getAllBewerbungAction: (accessToken) =>
        bewerbungActions.getAllBewerbung(accessToken),
      getDeleteBewerbungAction: (accessToken, userID) =>
        bewerbungActions.getDeleteBewerbungOne(accessToken, userID),
    },
    dispatch
  );
};

const ConnectBewerbungListAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(BewerbungList);
export default ConnectBewerbungListAction;
