import React from "react";
import "./CategoryBoxStyle.scss";
import "./CategoryBoxStyle-rtl.scss";
import Link from "next/link";
import { SEARCH_TYPE_MODULE } from "../../../lib/querys";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { useSelector } from "react-redux";
import { Translate } from "react-localize-redux";

export default ({ children, headerContent, link, className, childRef, showViewAll, viewAllId }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  return (
    <div ref={childRef} className={`categoryBoxStyle ${className ? className : ""}`}>
      <header className={`categoryBoxStyle__header ${showViewAll == true ? 'categoryBoxStyle__header-with-view-all' : ''}`}>
        <span className="categoryBoxStyle__border"></span>
        {typeof headerContent === "string" ? (
          <h2 className="categoryBoxStyle__header-text">{headerContent}</h2>
        ) : (
            headerContent
          )}
        {showViewAll == true ?
          <Link
            href={`${link}`}
          >
            <a className="categoryBoxStyle__view-all-box">
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
