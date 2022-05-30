import React from "react";

const Item = (props) => {
  return (
    <>
      {props.hideBottomBorder == true ?
        (
          <button
            id={props.id}
            onClick={props.click}
          >
            <img id="deactiveLang" src={props.active} alt="activate" />

            <img className="lang-flag" src={props.flag} alt="flag" />
            <span>{props.value}</span>
          </button>
        )
        :
        (
          <button
            id={props.id}
            onClick={props.click}
            style={{ borderBottom: "0.1rem solid #eee" }}
          >
            <img id="deactiveLang" src={props.active} alt="activate" />

            <img className="lang-flag" src={props.flag} alt="flag" />
            <span>{props.value}</span>
          </button>
        )
      }
    </>
  );
};

export default Item;
