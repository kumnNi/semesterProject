import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as userAction from "../../actions/UserAction";
import ConfirmDialog from "./ConfirmDialog";
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
    data: state.user.payload,
  };
};

function UserManagement(props) {
  const accessToken = props.accessToken;
  const { data, getAllUserAction, getDeleteUserAction } = props;
  const navigate = useNavigate();

  useEffect(() => {
    getAllUserAction(accessToken);
  }, [accessToken, getAllUserAction]);

  const [open, setOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState({});

  const handleDelete = (userID) => {
    setOpen(true);
    setUserIdToDelete({ userID: userID });
  };

  const handleConfirmDelete = (confirmed) => {
    const userIDToDel = userIdToDelete.userID;

    if (confirmed) {
      getDeleteUserAction(accessToken, userIDToDel);
      navigate("/userManagement");
    } else {
      console.log("you do not want delete");
    }
    setOpen(false);
  };

  const id = "UserItem";
  return (
    <>
      <div className="container mt-5" id="UserManagementPage">
        <div className="row">
          <div className="col d-flex align-items-center">
            <h4
              style={{
                marginLeft: "20px",
                marginRight: "6rem",
                marginTop: "2rem",
              }}
            >
              {" "}
              User-List{" "}
            </h4>
            <Button
              variant="primary"
              style={{
                position: "static",
                display: "inherit",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              <Link to="/createUser" id="UserManagementPageCreateUserButton">
                CreateUser{" "}
              </Link>
            </Button>
          </div>{" "}
        </div>
        <div className="row" id="UserManagementPageListComponent">
          {Array.isArray(data) && data.length > 0 ? (
            <div className="row-md-4">
              <Card>
                {data.map((item, index) => (
                  <div className="col-md-4" key={index}>
                    <Card id={id + item.userID} className=" mb-5 mb-md-0">
                      <CardBody className="px-4 py-6 py-md-5 py-lg-6">
                        <CardTitle className="text-center mb-5">
                          {" "}
                          {item.firstName} {item.lastName}
                        </CardTitle>
                        <CardText></CardText>
                        <ListGroup variant="flush">
                          <ListGroupItem>User ID :{item.userID} </ListGroupItem>
                          <ListGroupItem>
                            First Name :{item.firstName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Last Name :{item.lastName}{" "}
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
                              to={`/userManagement/edit/${item.id}`}
                              id={`UserItemEditButton${item.userID}`}
                            >
                              Edit
                            </Link>
                          </Button>

                          <ConfirmDialog
                            onClick={() => handleDelete(item.userID)}
                            open={open && userIdToDelete.userID === item.userID}
                            closeDialog={() => setOpen(false)}
                            title={`${item.firstName} ${item.lastName} `}
                            onConfirm={handleConfirmDelete}
                            onCancel={() => setOpen(false)}
                            id={`UserItemDeleteButton${item.userID}`}
                            detail={`${item.userID}`}
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
      getAllUserAction: (accessToken) => userAction.getAllUser(accessToken),
      getDeleteUserAction: (accessToken, userID) =>
        userAction.getDeleteUserOne(accessToken, userID),
    },
    dispatch
  );
};

const ConnectUserAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement);
export default ConnectUserAction;
