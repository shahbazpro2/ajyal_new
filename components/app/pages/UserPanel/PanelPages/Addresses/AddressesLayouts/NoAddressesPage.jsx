import React from "react";
import { ReactComponent as EmptyAddressIcon } from "./../../../../../../../assets/icons/empty-address.svg";
import { Translate } from "react-localize-redux";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

export default ({withoutBtn}) => {
  const { url } = !withoutBtn ? useRouteMatch() : { url: undefined};
  return (
    <section className="no-address">
      <div>
        <EmptyAddressIcon className="no-address__icon" />
        <p className="no-address__topText">
          <Translate id="addresses.empty-des" />
        </p>
        <p className="no-address__btmText">
          <Translate id="addresses.empty-des2" />
        </p>
        {!withoutBtn && <Link to={`${url}/add`} className="primary-btn no-address__btn">
          <Translate id="addresses.addadress" />
        </Link>}
      </div>
    </section>
  );
};
