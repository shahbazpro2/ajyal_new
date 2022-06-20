import React from "react";
import { Translate } from "react-localize-redux";
import { GoodItemRow, BoxStyle1 } from "../../../../common";
import { CartAndWishlistItem } from "../../CartAndWishlist/CartAndWishlistLayouts";

export default ({ count, items }) => {
  const renderBoxHeader = () => {
    return (
      <div className="profile-edit__header-container">
        <h2 className="profile-edit__box-header">
          <Translate id="payment.your-order" />
        </h2>
        <p className="profile-edit__box-subheader">
          {count}&nbsp;
          {count > 1 ? (
            <Translate id="common.items" />
          ) : (
            <Translate id="common.item" />
          )}
        </p>
      </div>
    );
  };

  return (
    <BoxStyle1 className="payment__items-cnt" headerContent={renderBoxHeader()}>
      <div className="payment__items">
        {items?.map((item) => {
          return <CartAndWishlistItem key={item.itemId} {...item} withoutRight/>;
        })}
        {/* <GoodItemRow
          withoutRightBox
          withoutCaption
          withModelNumber
          {...content2[1]}
        /> */}
      </div>
    </BoxStyle1>
  );
};
