export const SHOW_LOGIN_DIALOG = "SHOW_LOGIN_DIALOG";
export const HIDE_LOGIN_DIALOG = "HIDE_LOGIN_DIALOG";
export const AUTHENTICATION_PENDING = "AUTHENTICATION_PENDING";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

const REST_API_URL = process.env.REACT_APP_REST_API_URL;

export function getShowLoginDialogAction() {
  return {
    type: SHOW_LOGIN_DIALOG,
  };
}

export function getHideLoginDialogAction() {
  return {
    type: HIDE_LOGIN_DIALOG,
  };
}

export function getAuthenticateUserPendingAction() {
  return {
    type: AUTHENTICATION_PENDING,
  };
}

//legt session mit token hinlegen
export function getAuthenticationSuccessAction(userSession) {
  return {
    type: AUTHENTICATION_SUCCESS,
    user: userSession.user,
    accessToken: userSession.accessToken,
  };
}

export function getAuthenticationErrorAction(error) {
  return {
    type: AUTHENTICATION_ERROR,
    error: error,
  };
}

export function getLogoutAction() {
  return {
    type: LOGOUT_SUCCESS,
    user: null,
    accessToken: null,
  };
}

export function authenticateUser(userID, password) {
  console.log("Authenticate");
  return (dispatch) => {
    dispatch(getAuthenticateUserPendingAction());
    login(userID, password)
      .then(
        (userSession) => {
          const action = getAuthenticationSuccessAction(userSession);
          dispatch(action);
        },
        (error) => {
          dispatch(getAuthenticationErrorAction(error));
        }
      )
      .catch((error) => {
        dispatch(getAuthenticationErrorAction(error));
      });
  };
}

async function login(userID, password) {
  try {
    const base64Credentials = btoa(`${userID}:${password}`);

    const requestOptions = {
      method: "GET",
      headers: { Authorization: "Basic " + base64Credentials },
    };
    const response = await fetch("http://localhost:80/api/" + "authenticate", requestOptions);
    const userSession = await handleResponse(response);

    return userSession;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

async function handleResponse(response) {
  const authorizationHeader = response.headers.get("Authorization");
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    var token;
    if (authorizationHeader) {
      token = authorizationHeader.split(" ")[1];
    }

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    } else {
      let userSession = {
        user: data,
        accessToken: token,
      };
      return userSession;
    }
  });
}

async function logout() {
  console.error("must login ");
  localStorage.removeItem("accessToken");
}
