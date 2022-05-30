import Link from "next/link";
import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../../appConfigSlice";
import { client_putArticleReview } from "../../../../../lib/api/client/clientHelpCenter";
import { slugy } from "../../../../../lib/helpers";
import { Tablets, TabletsAndBigger } from "../../../../../Responsive";
import CloseIcon, { fontsize } from "./../../../../../assets/icons/close.svg";
import OpenMenu from "./../../../../../assets/icons/header-arrow-down.svg";
import classnames from "classnames";
import { useEffect } from "react";

const Article = ({ data: article }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const [accepted, setAccepted] = useState(0); /// 0 => nothing, 1 => yes, 2 => no

  const handleReviewClick = async (code) => {
    const prevState = accepted;
    setAccepted(code);
    try {
      let acc = code === 1 ? true : false;
      await client_putArticleReview(article.articleId, acc);
    } catch (err) {
      setAccepted(prevState);
    }
  };

  useEffect(() => {
    setOpenMenu(false);
  }, [article.articleId]);
  
  return (
    <div className="container helpcenter doc">
      <div className="row no-gutters">
        <aside className="col-lg-3 col-12 doc__aside">
          <div className="doc__list-cnt">
            <h4 className="doc__list-header">
              <Translate id="articles-in-section" />
              <i
                className="doc__close-icon d-lg-none d-inline"
                onClick={() => {
                  setOpenMenu(!openMenu);
                }}
              >
                <>{openMenu ? <CloseIcon /> : <OpenMenu />}</>
              </i>
            </h4>
            <Tablets>
              {openMenu && (
                <ul className="doc__list">
                  {article.articles?.map((article) => {
                    return (
                      <li key={article.articleId} className="doc__list-item">
                        <Link
                          href={`/${curr}-${lang}/hc/articles/${
                            article.articleId
                          }/${slugy(article.subject)}`}
                        >
                          <a className="doc__list-link">{article.subject}</a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Tablets>
            <TabletsAndBigger>
              <ul className="doc__list">
                {article.articles?.map((article) => {
                  return (
                    <li key={article.articleId} className="doc__list-item">
                      <Link
                        href={`/${curr}-${lang}/hc/articles/${
                          article.articleId
                        }/${slugy(article.subject)}`}
                      >
                        <a className="doc__list-link">{article.subject}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </TabletsAndBigger>
          </div>
        </aside>
        <article className="col-lg-9 col-12">
          <div className="doc__content ql-editor">
            <h1 className="helpcenter__subheader helpcenter__subheader--article">
              {article.subject}
            </h1>
            {/* <p className="doc__time">Updated 2 hours ago</p> */}
            <section
              style={{ fontSize: "16px" }}
              dangerouslySetInnerHTML={{ __html: article.description }}
              className="helpcenter__content doc__article-content  reset-html"
            >
              {/* content */}
              {/* <p style={{ fontSize: "16px" }}>
                noon is an easy and secure platform for people to discover and
                shop the products they love. With fast delivery, easy payment
                and return options and a 24-hour customer service, find
                everything you need at competitive prices. All our products are
                backed by our authenticity promise and noon warranty.
              </p> */}
            </section>
            <div className="doc__ques-content">
              <p className="doc__ques">
                <Translate id="article-ques" />
              </p>
              <button
                className={classnames("doc__ques-btn", {
                  active: accepted === 1,
                })}
                onClick={() => {
                  handleReviewClick(1);
                }}
              >
                <Translate id="yes" />
              </button>
              <button
                className={classnames("doc__ques-btn", {
                  active: accepted === 2,
                })}
                onClick={() => {
                  handleReviewClick(2);
                }}
              >
                <Translate id="no" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Article;
