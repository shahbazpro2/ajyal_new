import React from "react";
// import "./GoodSituation.scss";
import { ReactComponent as CancelledIcon } from "./../../../assets/icons/order-status/cancelled.svg";
import { ReactComponent as DeliveredIcon } from "./../../../assets/icons/order-status/delivered.svg";
import { ReactComponent as ProcessingIcon } from "./../../../assets/icons/order-status/porcessing.svg";
import { ReactComponent as ConfirmedIcon } from "./../../../assets/icons/order-status/confirmed.svg";
import { ReactComponent as CompletedIcon } from "./../../../assets/icons/order-status/completed.svg";
import { ReactComponent as OngoingIcon } from "./../../../assets/icons/order-status/ongoing.svg";
import { ReactComponent as ReturnComplateIcon } from "./../../../assets/icons/order-status/return-complete.svg";
import { ReactComponent as ReturnProcessingIcon } from "./../../../assets/icons/order-status/return-processing.svg";
import { ReactComponent as ShippedIcon } from "./../../../assets/icons/order-status/shipped.svg";
import { ReactComponent as ShippingIcon } from "./../../../assets/icons/order-status/shipping.svg";
export default (props) => {
  let icon, color, text;
  switch (props.id) {
    case 1:
      icon = <OngoingIcon />;
      color = "#f0cd40";
      text = props.title;
      break;
    case 2:
      icon = <ConfirmedIcon />;
      color = "#f0cd40";
      text = props.title;
      break;
    case 3:
      icon = <ProcessingIcon />;
      color = "#0288d1";
      text = props.title;
      break;
    case 4:
      icon = <ShippingIcon />;
      color = "#0288d1";
      text = props.title;
      break;
    case 5:
      icon = <ShippedIcon />;
      color = "#0288d1";
      text = props.title;
      break;
    case 6:
      icon = <DeliveredIcon />;
      color = "#0288d1";
      text = props.title;
      break;
    case 7:
      icon = <CompletedIcon />;
      color = "#3ad976";
      text = props.title;
      break;
    case 100:
      icon = <CancelledIcon />;
      color = "#f07040";
      text = props.title;
      break;
    case 200:
      icon = <ReturnProcessingIcon />;
      color = "#0288d1";
      text = props.title;
      break;
    case 201:
      icon = <ReturnComplateIcon />;
      color = "#0288d1";
      text = props.title;
      break;
    default:
      break;
  }

  return (
    <div className="goodsitua">
      {icon}
      <span className="goodsitua__text" style={{ color: color }}>
        {text}
      </span>
    </div>
  );
};
