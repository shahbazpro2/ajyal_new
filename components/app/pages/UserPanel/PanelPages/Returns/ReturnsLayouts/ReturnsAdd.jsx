import React from "react";
import { BoxStyle2 } from "../../../../../../common";
import { Translate } from "react-localize-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { ReactComponent as BackIcon } from "./../../../../../../../assets/icons/back.svg";
import  ReturnItem  from "./ReturnItem";
import { client_getOrderItemForReturned } from "./../../../../../../../lib/api/client/clientUserPanel";
import { useEffect, useState } from "react";

export default ({ currency }) => {
  const { url } = useRouteMatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    client_getOrderItemForReturned().then(data=> {
      setData(data.result);
    });
    return () => {};
  }, []);

  const selectedItemForReturn = (item) => {};

  const renderBoxHeader = () => {
    return (
      <header className="mapAddress__header">
        <Link
          to={url.split("/").slice(0, -1).join("/")}
          className="orderDetail__backlink"
        >
          <BackIcon className="mapAddress__back-icon" />
          <div className="orders__item-header">
            <h2 className="orders__item-cnt-header text-transform-none">
              <Translate id="returns.select-item-for-return" />
            </h2>
          </div>
        </Link>
      </header>
    );
  };
  return (
    <BoxStyle2 className="returns-add" headerContent={renderBoxHeader()}>
      <div className="returns-add__items">
        {data.map((item) => {
          return (
            <ReturnItem
            key={item.itemId}
            withoutReason
            btnText={<Translate id="returns.select-item" />}
            btnLink={`${url}/${item.itemId}`}
            data={item}
            currency={currency}
            selectedItem={selectedItemForReturn}
          />
          );
        })}
      </div>
    </BoxStyle2>
  );
};
