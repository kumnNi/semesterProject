import * as userActions from "../actions/UserAction";

const initialState = {
  user: null,
  error: null,
  accessToken: null,
  errorMessage: "",
  payload: "",
};

const userReducer = (state = initialState, action) => {
  console.log("bin in User Reducer: " + action.type);
  switch (action.type) {
    case userActions.CREATE_USER_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        error: null,
      };

    case userActions.CREATE_USER_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        error: null,
      };
    case userActions.CREATE_USER_ERROR:
      return {
        ...state,
        error: "Fehler",
      };

    case userActions.SHOW_ONE_USER_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        error: null,
      };

    case userActions.SHOW_ONE_USER_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        payload: action.payload,
        error: null,
      };

    case userActions.SHOW_USER_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        error: null,
      };

    case userActions.SHOW_USER_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        payload: action.payload,
        error: null,
      };

    case userActions.UPDATE_USER_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        payload: action.payload,
        error: null,
      };
    case userActions.UPDATE_USER_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        payload: action.payload,
        error: null,
      };
    case userActions.UPDATE_USER_ERROR:
      return {
        ...state,
        error: null,
      };

    case userActions.GET_DELETE_USER_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        payload: action.payload,
        error: null,
      };
    case userActions.GET_DELETE_USER_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        pending: true,
        error: null,
      };
    case userActions.GET_DELETE_USER_ERROR:
      return {
        ...state,

        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;
