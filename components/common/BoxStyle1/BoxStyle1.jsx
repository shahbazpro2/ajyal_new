import React from "react";
// import "./BoxStyle1.scss";
// import "./BoxStyle1-rtl.scss";
import Link from "next/link";
import { SEARCH_TYPE_MODULE } from "../../../lib/querys";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { useSelector } from "react-redux";
import { Translate } from "react-localize-redux";

export default ({ children, headerContent, className, childRef, showViewAll, viewAllId }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  return (
    <div ref={childRef} className={`boxStyle1 ${className ? className : ""}`}>
      <header className={`boxStyle1__header ${showViewAll == true ? 'boxStyle1__header-with-view-all' : ''}`}>
        <span className="boxStyle1__border"></span>
        {typeof headerContent === "string" ? (
          <h2 className="boxStyle1__header-text">{headerContent}</h2>
        ) : (
            headerContent
          )}
        {showViewAll == true ?
          <Link
            href={`/${curr}-${lang}/search?type=${SEARCH_TYPE_MODULE}&id=${viewAllId}`}
          >
            <a className="boxStyle1__view-all-box">
              <span>
                <Translate id="common.view-all" />
              </span>
            </a>
          </Link>
          :
          null}
      </header>
      {children}
    </div>
  );
};
