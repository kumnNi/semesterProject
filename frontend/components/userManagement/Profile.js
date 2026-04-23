import React, { useEffect } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as userAction from "../../actions/UserAction";
import { CardBody, CardTitle, ListGroup, ListGroupItem } from "react-bootstrap";

const mapStateToProps = (state) => {
  return {
    accessToken: state.root.accessToken,
    data: state.user.payload,
  };
};

function Profile(props) {
  const accessToken = props.accessToken;
  const { data, getOneUserAction } = props;

  //const [open, setOpen] = useState(false);
  //const [userIdToDelete, setUserIdToDelete] = useState({});

  console.log("data in Profile .." + JSON.stringify(props));
  let userIDToFinde = undefined;
  if (accessToken) {
    const decodedToken = atob(props.accessToken.split(".")[1]);
    const userInformation = JSON.parse(decodedToken);
    userIDToFinde = userInformation.user;
    console.log("decodedToken .." + userInformation.user);
  }
  console.log("userIDToFinde .." + userIDToFinde);
  useEffect(() => {
    console.log("Fetch his own user  data.....++++1 ");
    getOneUserAction(accessToken, userIDToFinde);
  }, [accessToken, getOneUserAction, userIDToFinde]);

  const id = "UserItem";
  const dataArray = Array.isArray(data) ? data : [data];

  const filteredMyProfile = dataArray
    .filter((item) => item.userID === userIDToFinde)
    .map((item) => ({ ...item, id: item._id }));

  return (
    <>
      <div className="container mt-5" id="ProfileManagementPage">
        <div className="row">
          <div className="col d-flex align-items-center">
            <h4> My Profile </h4>
          </div>{" "}
        </div>
        <div className="row">
          {filteredMyProfile.length > 0 ? (
            <div className="row-md-4">
              <Card>
                {filteredMyProfile.map((item) => (
                  <div className="col-md-4">
                    <Card
                      key={item.id}
                      id={id + item.userID}
                      className=" mb-5 mb-md-0"
                    >
                      <CardBody className="px-4 py-6 py-md-5 py-lg-6">
                        <CardTitle className="text-center mb-5">
                          {" "}
                          {item.firstName} {item.lastName}
                        </CardTitle>
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
                              to={`/userManagement/editPublic/${item.id}`}
                              id={`UserItemEditButton${item.userID}`}
                            >
                              Edit
                            </Link>
                          </Button>
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
      getOneUserAction: (accessToken, userID) =>
        userAction.getOneUser(accessToken, userID),
      getDeleteUserAction: (accessToken, userID) =>
        userAction.getDeleteUserOne(accessToken, userID),
    },
    dispatch
  );
};

const ConnectMyUserAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
export default ConnectMyUserAction;
