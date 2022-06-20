import React from "react";
import { ReactComponent as EmptyReturnsIcon } from "./../../../../../../../assets/icons/return.svg";
import { Translate } from "react-localize-redux";
export default (props) => {
  return (
    <section className="no-address">
      {props.type === 'requested' ? 
      (
        <div>
        <EmptyReturnsIcon className="no-address__icon" />
        <p className="no-address__topText text-align-center">
          <Translate id="returns.empty-msg1" />
        </p>
        <p className="no-address__btmText text-align-center">
          <Translate id="returns.empty-msg2" />
        </p>
      </div>
      ) : 
        (
          <div>
          <EmptyReturnsIcon className="no-address__icon" />
          <p className="no-address__topText text-align-center">
            <Translate id="returns.empty-msg1-deliverd" />
          </p>
        </div>
        )}

    </section>
  );
};
