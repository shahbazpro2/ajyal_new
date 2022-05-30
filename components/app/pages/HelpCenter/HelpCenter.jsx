import React from "react";
import { Translate } from "react-localize-redux";
import ArticleBox from "./helpCenterLayouts/ArticleBox";

const HelpCenter = ({ data }) => {
  return (
    <div className="container helpcenter">
      <h2 className="helpcenter__subheader">
        <Translate id="browse-topics" />
      </h2>
      <section className="helpcenter__content">
        <ul className="helpcenter__article-list row">
          {data?.map((item, index) => {
            return (
              <li key={index} className="helpcenter__item col-12 col-md-6 mt-5">
                <ArticleBox {...item} />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default HelpCenter;
