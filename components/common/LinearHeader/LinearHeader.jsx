import React from 'react';
// import "./LinearHeader.scss";

export default ({ headerText }) => {
  return (
    <>
      {headerText ?
        <div className="linearHeader">
          <h3 className="linearHeader__h3">
            <span className="linearHeader__text">{headerText}</span>
          </h3>
        </div>
        :
        <div className="linearHeader">
        </div>}
    </>
  );
};
