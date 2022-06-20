import React from "react";
// import "./Button.scss";

const Button = (props) => {
  return (
    <div className="Button">
      <button
        onClick={props.onClick}
        className="Button__custom"
        type="submit"
        className={
          "Button__custom " +
          (props.size === "xsm" ? "Button__xsm" : "") +
          (props.disable ? "disable" : "")
        }
        style={{
          borderRadius: props.radius ? "5px" : "0px",
        }}
      >
        {props.value}
      </button>
    </div>
  );
};

export default Button;
