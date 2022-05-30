import Link from "next/link";
import React from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../../appConfigSlice";
import { slugy } from "../../../../../lib/helpers";

const Categories = ({ data: topics }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  return (
    <div className="container helpcenter">
      <h1 className="helpcenter__subheader helpcenter__subheader--article">
        {topics.title}
      </h1>
      <p className="article__count-cnt">
        <span className="article__count">{topics.articleCount}</span>
        <Translate id="articles" />
      </p>
      <section className="helpcenter__content">
        <p className="article__des">{topics.description}</p>
        <div className="article__topics-cnt">
          {topics.childs.map((child) => {
            return (
              <article key={child.topicId} className="article__topic">
                <Link
                  href={`/${curr}-${lang}/hc/sections/${child.topicId}/${slugy(
                    child.title
                  )}`}
                >
                  <a>
                    <h2 className="article__list-header">{child.title}</h2>
                  </a>
                </Link>
                <ul className="article__list row">
                  {child.articles.map((article) => {
                    return (
                      <li
                        key={article.articleId}
                        className="article__list-item col-12 col-lg-4 col-md-6"
                      >
                        <Link
                          href={`/${curr}-${lang}/hc/articles/${
                            article.articleId
                          }/${slugy(article.subject)}`}
                        >
                          <a className="article__list-link">
                            {article.subject}
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Categories;
