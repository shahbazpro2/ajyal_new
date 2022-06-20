import Link from "next/link";
import React from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../../appConfigSlice";
import { slugy } from "../../../../../lib/helpers";

const Section = ({ data: topic }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  return (
    <div className="container helpcenter">
      <h1 className="helpcenter__subheader helpcenter__subheader--article">
        {topic.title}
      </h1>
      <p className="article__count-cnt">
        <span className="article__count">{topic.articleCount}</span>
        <Translate id="articles" />
      </p>
      <section className="helpcenter__content">
        <div className="article__topics-cnt">
          <article className="article__topic">
            <ul className="article__list row">
              {topic.articles.map((article) => {
                return (
                  <li
                    key={article.articleId}
                    className="article__list-item  col-12 col-lg-4 col-md-6"
                  >
                    <Link
                      href={`/${curr}-${lang}/hc/articles/${
                        article.articleId
                      }/${slugy(article.subject)}`}
                    >
                      <a className="article__list-link">{article.subject}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Section;
