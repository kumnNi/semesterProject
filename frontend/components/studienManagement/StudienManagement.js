import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as studienAction from "../../actions/StudienActions";
import ConfirmDialog from "./ConfirmDialogStudien";
import { CardBody, CardTitle, ListGroup, ListGroupItem } from "react-bootstrap";

const mapStateToProps = (state) => {
  return {
    accessToken: state.root.accessToken,
    dataStudien: state.studienRe.payload,
  };
};

function StudienManagement(props) {
  const accessToken = props.accessToken;
  const { dataStudien, getAllStudienAction, getDeleteStudienAction } = props;
  const [open, setOpen] = useState(false);
  const [studienIdToDelete, setStudienIdToDelete] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    console.log("Fetch Studien data.....++++1 ");
    getAllStudienAction(accessToken);
  }, [accessToken, getAllStudienAction]);

  const handleDelete = (id) => {
    console.log("id ..++ " + id);
    setOpen(true);
    setStudienIdToDelete({ studienID: id });
  };

  const handleConfirmDelete = (confirmed) => {
    const studienIDToDel = studienIdToDelete.studienID;
    if (confirmed) {
      getDeleteStudienAction(accessToken, studienIDToDel);
      navigate("/studienManagement");
    } else {
      console.log("you not want delete");
    }
    setOpen(false);
  };

  const id = "DegreeCourseItem";
  let isAdmin;
  if (props.accessToken) {
    const decodedToken = atob(props.accessToken.split(".")[1]);
    const userInformation = JSON.parse(decodedToken);
    isAdmin = userInformation.isAdministrator;
  }

  return (
    <>
      <div className="container mt-5" id="DegreeCourseManagementPage">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4> Studien-List </h4>
              </div>
              <div
                className="card-body"
                id="DegreeCourseManagementPageListComponent"
              >
                <div>
                  <Card style={{ border: "0" }}>
                    <tr>
                      {isAdmin ? (
                        <Button
                          variant="primary"
                          style={{
                            position: "static",
                            display: "inherit",
                            margin: "9px",
                            width: "130px",
                          }}
                        >
                          <Link
                            to="/createStudien"
                            id="DegreeCourseManagementPageCreateDegreeCourseButton"
                          >
                            CreateStudien{" "}
                          </Link>
                        </Button>
                      ) : null}
                    </tr>
                  </Card>
                </div>
                {Array.isArray(dataStudien) && dataStudien.length > 0 ? (
                  <div className="row-md-4">
                    <Card>
                      {dataStudien.map((item, index) => (
                        <CardBody key={index} id={id + item.id}>
                          <CardTitle>{index + 1}</CardTitle>
                          <ListGroup>
                            <ListGroupItem>
                              <strong> Studiengang-Name :</strong>
                              {item.name} ({item.shortName})
                            </ListGroupItem>
                            <ListGroupItem>
                              <strong> Universität: </strong>
                              {item.universityName}({item.universityShortName})
                            </ListGroupItem>
                            <ListGroupItem>
                              <strong> DepartmentName :</strong>
                              {item.departmentName}({item.departmentShortName})
                            </ListGroupItem>
                          </ListGroup>
                          <td>
                            {isAdmin ? (
                              <Button variant="primary">
                                <Link
                                  id={`DegreeCourseItemEditButton${item.id}`}
                                  to={`/studienManagement/edit/${item.id}`}
                                >
                                  {" "}
                                  Edit
                                </Link>
                              </Button>
                            ) : null}
                          </td>
                          <td>
                            {isAdmin ? (
                              <ConfirmDialog
                                onClick={() => handleDelete(item.id)}
                                open={open && studienIdToDelete.id === item.id}
                                closeDialog={() => setOpen(false)}
                                title={`${item.shortName} ${item.name} `}
                                onConfirm={handleConfirmDelete}
                                onCancel={() => setOpen(false)}
                                id={`DegreeCourseItemDeleteButton${item.id}`}
                                detail={`${item.id}`}
                              />
                            ) : null}
                          </td>

                          <td>
                            {isAdmin ? (
                              <Button
                                variant="success"
                                id={`CreateDegreeCourseApplicationForDegreeCourse${item.id}`}
                              >
                                <Link
                                  to={`/bewerbungManagement/createApplication/${item.id}`}
                                  id={`CreateDegreeCourseApplicationCreate${item.id}`}
                                >
                                  {" "}
                                  Create Application
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                id={`CreateDegreeCourseApplicationForDegreeCourse${item.id}`}
                              >
                                <Link
                                  to={`/bewerbungManagement/createAppUser/${item.id}`}
                                  id={`CreateDegreeCourseApplicationForDegreeCourse${item.id}`}
                                >
                                  {" "}
                                  Create Application
                                </Link>
                              </Button>
                            )}
                          </td>
                        </CardBody>
                      ))}
                    </Card>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getAllStudienAction: (accessToken) =>
        studienAction.getAllStudien(accessToken),
      getDeleteStudienAction: (accessToken, studienID) =>
        studienAction.getDeleteStudienOne(accessToken, studienID),
    },
    dispatch
  );
};
const ConnectStudienAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudienManagement);
export default ConnectStudienAction;
