import React from "react";
import { BoxStyle2 } from "../../../../../../common";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import { ReactComponent as CorrectResult } from "./../../../../../../../assets/icons/correct.svg";
import OrderItem from "./OrderItem";
import { LandScapePhones } from "../../../../../../../Responsive";
import { Alert } from "../../../../../../common";
export default ({ orderBackLink, content , currency , lang }) => {
  return (
    <div className="mt-4">
      <Alert
        to={orderBackLink}
        topText={<Translate id="orders.cancel-msg2" />}
        btnText={<Translate id="orders.back-order" />}
      />
      {content?.map((item, index) => {
        return (
          <>
            <BoxStyle2 className="cancel-result">
              <OrderItem
                data={item}
                key={item.itemId}
                currency={currency}
                lang={lang}
                withoutRightBox="true"
              />
            </BoxStyle2>
          </>
        );
      })}
    </div>
  );
};
