import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";

import rootReducer from "./reducer/RootReducer";
import userReducer from "./reducer/UserReducer";
import studienReducer from "./reducer/StudienReducer";
import bewerbungReducer from "./reducer/BewerbungReducer";

const combinationReducers = combineReducers({
  root: rootReducer,
  user: userReducer,
  studienRe: studienReducer,
  bewerbungRe: bewerbungReducer,
});

const initialState = {};
const middlewares = [thunk];

const store = createStore(
  combinationReducers,
  initialState,
  applyMiddleware(...middlewares)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
