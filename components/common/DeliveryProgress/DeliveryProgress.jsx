import React from "react";
// import './DeliveryProgress.scss';

export default ({ processing, delivered, fillItemCount, stepCount }) => {
  let classname;
  if (delivered) classname = "delivery-progress__item--green";
  if (processing) classname = "delivery-progress__item--orange";

  let items = [];
  for (let i = 0; i < stepCount; i++) {
    if (i < fillItemCount) {
      items.push(
        <span className={`delivery-progress__item ${classname}`}></span>
      );
    } else {
      items.push(<span className="delivery-progress__item"></span>);
    }
  }

  return <div className="delivery-progress">
      {items}
  </div>;
};
