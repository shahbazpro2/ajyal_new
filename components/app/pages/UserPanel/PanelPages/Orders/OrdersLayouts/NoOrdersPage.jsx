import React from "react";
import { ReactComponent as EmptyOrdersIcon } from "./../../../../../../../assets/icons/emptybox.svg";
import { Translate } from "react-localize-redux";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

export default () => {
  const { url } = useRouteMatch();
  return (
    <section className="no-address">
      <div>
        <EmptyOrdersIcon className="no-address__icon" />
        <p className="no-address__topText">
          <Translate id="orders.empty-msg1" />
        </p>
        <p className="no-address__btmText">
          <Translate id="orders.empty-msg2" />
        </p>
        <Link to={`/`} className="primary-btn no-address__btn">
          <Translate id="orders.con-shopping" />
        </Link>
      </div>
    </section>
  );
};
