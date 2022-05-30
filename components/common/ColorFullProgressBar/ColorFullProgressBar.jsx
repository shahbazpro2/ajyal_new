import React from "react";
import { Line } from "rc-progress";
// import "./ColorFullProgressBar.scss";

export default ({ number, percent, colorfullnumber, ...props }) => {
  let color, style;

  if (percent > 50) {
    color = "#3ad976";
  } else if (percent > 30) {
    color = "#f0cd40";
  } else {
    color = "#f07040";
  }

  if (colorfullnumber) {
    style = {
      color: color,
    };
  }
  return (
    <div className="progress">
      {number && <span className="progress__number">{number}</span>}
      <span className="progress__cnt">
        <Line percent={percent} strokeColor={color} {...props} />
      </span>
      <span style={style} className="progress__percent">
        {percent}%
      </span>
    </div>
  );
};
