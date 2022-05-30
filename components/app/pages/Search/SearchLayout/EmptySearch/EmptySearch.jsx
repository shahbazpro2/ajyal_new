import React from "react";
import emptySearchIcon from "./../../../../../../assets/icons/img-empty-search.svg";
import { Translate } from "react-localize-redux";
const EmptySearch = () => {
  return (
    <div
      className="d-flex flex-column mx-auto"
      style={{ margin: "100px auto",alignItems:"center" }}
    >
      <img
        src={emptySearchIcon}
        alt="empty search icon"
        title="empty search Icon"
        style={{ width: "140px",height: "140px"}}
      />
      <p style={{ textAlign: "center", fontSize: "17px", marginTop: "5px" }}>
        <Translate id="empty-search" />
      </p>
    </div>
  );
};

export default EmptySearch;
