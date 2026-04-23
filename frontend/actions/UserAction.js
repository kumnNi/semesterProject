export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_ERROR = "CREATE_USER_ERROR";
export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const SHOW_USER_SUCCESS = "SHOW_USER_SUCCESS";
export const SHOW_USER_ERROR = "SHOW_USER_ERROR";
export const SHOW_USER_REQUEST = "SHOW_USER_REQUEST";
export const SHOW_ONE_USER_SUCCESS = "SHOW_ONE_USER_SUCCESS";
export const SHOW_ONE_USER_ERROR = "SHOW_ONE_USER_ERROR";
export const SHOW_ONE_USER_REQUEST = "SHOW_ONE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_ERROR = "UPDATE_USER_ERROR";
export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_ERROR = "GET_USER_ERROR";
export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_DELETE_USER_SUCCESS = "GET_DELETE_USER_SUCCESS";
export const GET_DELETE_USER_ERROR = "GET_DELETE_USER_ERROR";
export const GET_DELETE_USER_REQUEST = "GET_DELETE_USER_REQUEST";

//API URL definieren
const REST_API_URL = process.env.REACT_APP_REST_API_URL;

export function getAddUserRequest(accessToken, userData) {
  return {
    type: CREATE_USER_REQUEST,
    payload: userData,
    accessToken: accessToken,
  };
}

export function getCreateUserSuccess(accessToken, userData) {
  return {
    type: CREATE_USER_SUCCESS,
    payload: userData,
    accessToken: accessToken,
  };
}

export function getCreateUserErrorAction(error) {
  return {
    type: CREATE_USER_ERROR,
    error: error,
  };
}

//get all User
export function getAllUserRequestAction(accessToken) {
  return {
    type: SHOW_USER_REQUEST,
    accessToken: accessToken,
  };
}

export function getAllUserSuccessAction(accessToken, data) {
  return {
    type: SHOW_USER_SUCCESS,
    payload: data,
    accessToken: accessToken,
  };
}

export function getAllUserErrorAction(error) {
  return {
    type: SHOW_USER_ERROR,
    error: error,
  };
}

//get One User
export function getOneUserRequestAction(accessToken, data) {
  return {
    type: SHOW_ONE_USER_REQUEST,
    accessToken: accessToken,
    payload: data,
  };
}

export function getOneUserSuccessAction(accessToken, data) {
  return {
    type: SHOW_ONE_USER_SUCCESS,
    payload: data,
    accessToken: accessToken,
  };
}

export function getOneUserErrorAction(error) {
  return {
    type: SHOW_ONE_USER_ERROR,
    error: error,
  };
}

//get update User
export function getUpdateUserRequestAction(accessToken, data) {
  return {
    type: UPDATE_USER_REQUEST,
    accessToken: accessToken,
    payload: data,
  };
}

export function getUpdateUserSuccessAction(accessToken, data) {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: data,
    accessToken: accessToken,
  };
}

export function getUpdateUserErrorAction(error) {
  return {
    type: UPDATE_USER_ERROR,
    error: error,
  };
}

//get one user to update
export function getDeleteOneUserRequestAction(accessToken, userID) {
  return {
    type: GET_DELETE_USER_REQUEST,
    accessToken: accessToken,
    data: userID,
  };
}

export function getDeleteOneUserSuccessAction(accessToken) {
  return {
    type: GET_DELETE_USER_SUCCESS,
    accessToken: accessToken,
  };
}

export function getDeleteOneUserErrorAction(error) {
  return {
    type: GET_DELETE_USER_ERROR,
    error: error,
  };
}

export function createNewUser(accessToken, userData) {
  console.log(" create User");
  return async (dispatch) => {
    dispatch(getAddUserRequest(accessToken, userData));

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const response = await fetch(REST_API_URL + "users/", requestOptions);

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();

          return { success: false, error: errorData.Error };
        }
        console.log(`HTTP error! Status: ${response.status}`);
      } else {
        const newUserData = await response.json();
        dispatch(getCreateUserSuccess(accessToken, newUserData));
        dispatch(getAllUser(accessToken));
      }
    } catch (error) {
      console.error("create new User failed:", error);
      throw error;
    }
  };
}
//get all User for Admin
export function getAllUser(accessToken) {
  console.log("getAllUsersssssssss:", accessToken);
  return async (dispatch) => {
    dispatch(getAllUserRequestAction(accessToken));
    const fetchData = async () => {
      try {
        const response = await fetch(REST_API_URL + "users", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });

        if (!response.ok) {
          if (response.status === 400) {
            console.log("Additional details:", response.statusText);
          }
          console.log(`HTTP error! Status: ${response.status}`);
        } else {
          const jsonData = await response.json();
          dispatch(getAllUserSuccessAction(accessToken, jsonData));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch(getAllUserErrorAction(error.message));
      }
    };
    fetchData();
  };
}

//get user for standard User
export function getOneUser(accessToken, userID) {
  console.log(" im Action get one user " + accessToken);
  return async (dispatch) => {
    dispatch(getOneUserRequestAction(accessToken, userID));
    const fetchData = async () => {
      try {
        const response = await fetch(REST_API_URL + "users/" + userID, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });
        if (!response.ok) {
          if (response.status === 400) {
            console.log("Additional details:", response.statusText);
          }
          console.log(`HTTP error! Status: ${response.status}`);
        } else {
          const jsonData = await response.json();
          dispatch(getOneUserSuccessAction(accessToken, jsonData));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch(getOneUserErrorAction(error.message));
      }
    };

    fetchData();
  };
}

//delete user
export function getDeleteUserOne(accessToken, userID) {
  console.log(" Delete user ");
  return async (dispatch) => {
    dispatch(getDeleteOneUserRequestAction(accessToken, userID));
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        REST_API_URL + "users/" + userID,
        requestOptions
      );
      if (!response.ok) {
        if (response.status === 400) {
          console.log("Additional details:", response.statusText);
        }
        console.log(`HTTP error! Status: ${response.status}`);
      } else {
        if (response.status === 204) {
          dispatch(getDeleteOneUserSuccessAction(userID));
          dispatch(getAllUser(accessToken));
        }
      }
    } catch (error) {
      dispatch(getDeleteOneUserErrorAction(error.message));
    }
  };
}

//edit update user
export function updateUser(accessToken, userData) {
  console.log(" update User", userData.userID);
  return async (dispatch) => {
    dispatch(getUpdateUserRequestAction(accessToken, userData));
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + accessToken,
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const response = await fetch(
        REST_API_URL + "users/" + userData.userID,
        requestOptions
      );
      if (!response.ok) {
        if (response.status === 400) {
          console.log("Additional details:", response.statusText);
        }
        console.log(`HTTP error! Status: ${response.status}`);
      } else {
        const newUpdateUserData = await response.json();

        dispatch(getUpdateUserSuccessAction(accessToken, newUpdateUserData));
        dispatch(getAllUser(accessToken));
      }
    } catch (error) {
      console.error("update User failed:", error);
      throw error;
    }
  };
}
