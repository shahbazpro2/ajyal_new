import React from "react";

const FormErrorMsg = ({ show, msg, style }) => {
  if (!show) return null;
  return (
    <p className="form-err" style={style}>
      {msg}
    </p>
  );
};

export default FormErrorMsg;
