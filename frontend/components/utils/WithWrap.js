import React from "react";
import { useNavigate } from "react-router-dom";
//https://reactnavigation.org/docs/use-navigation/
const withWrap = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    return <WrappedComponent {...props} navigate={navigate} />;
  };
};
export default withWrap;
