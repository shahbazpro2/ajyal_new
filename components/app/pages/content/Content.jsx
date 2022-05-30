import React from "react";
import { BoxStyle2 } from "../../../common";

const Content = ({ content }) => {
  return (
    <div
      className="content container siteWidthContainer ql-editor"
    >
      <BoxStyle2>
        <div style={{ padding: "25px" }} dangerouslySetInnerHTML={{ __html: content }}></div>
      </BoxStyle2>
    </div>
  );
};

export default Content;
