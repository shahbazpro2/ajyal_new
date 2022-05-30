import React from "react";
import placeholder from "./../../../assets/images/img-image-placeholder.svg";

const GoodItemLoader2 = (props) => {
  return (
    <div
      className={`goodItem-s1-container goodItem-loader ${
        props.className ? props.className : ""
      }`}
    >
      <article className="goodItem-s1">
        <figure className="goodItem-s1__fig goodItem-loader__img-cnt">
          <img className="goodItem-loader__img" src={placeholder} />
        </figure>
        {/*  */}

        <div className="d-flex justify-content-between">
          <div className="w-100 mt-3" style={{ flexBasis: "63%" }}>
            <div className="ssc-line w-100"></div>
            <div style={{ width: "60%" }} className="ssc-line"></div>
          </div>
          <div className="mt-3" style={{ flexBasis: "29%" }}>
            <div
              style={{ width: "40px", height: "40px" }}
              className=" ssc-circle"
            ></div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default GoodItemLoader2;
