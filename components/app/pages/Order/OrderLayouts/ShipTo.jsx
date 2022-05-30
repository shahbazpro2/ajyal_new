import React from "react";
import { Translate } from "react-localize-redux";
import { ReactComponent as ArsIcon1 } from "./../../../../../assets/icons/business-and-trade.svg";

export default ({ withoutEdit, data }) => {
  return (
    <div className="shipto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="shipto__header">
          <Translate id="payment.ship-to" />
        </h2>
        {!withoutEdit && (
          <a href="" className="payment__sky-text">
            <Translate id="common.edit" />
          </a>
        )}
      </div>
      <div className="returns-add-single__addresses">
        {data.address != null && (
          <div className=" addresses__row-item mt-1">
            <span className="addresses__icon-cnt">
              <ArsIcon1 className="addresses__left-icon" />
            </span>
            <p className="addresses__ars-text">{data.address}</p>
          </div>
        )}
        <div className=" addresses__row-item mt-md-4 mt-5">
          <span className="addresses__ars-head mb-0">
            <Translate id="common.name" />
          </span>
          <span className="addresses__ars-value">
            {data.transfereeName + " " + data.transfereeFamily}
          </span>
        </div>
        {data.transfereeMobile != null && (
          <div className=" mt-5 mt-sm-0 addresses__row-item">
            <span className="addresses__ars-head mb-0 mt-3">
              <Translate id="common.phone" />
            </span>
            <span className="addresses__ars-value">
              {data.transfereeMobile}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
