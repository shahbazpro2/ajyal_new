import Link from "next/link";
import React from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../../appConfigSlice";
import { slugy } from "../../../../../lib/helpers";
import { ReactComponent as AjyalIcon } from "./../../../../../assets/icons/ajyal.svg";

const ArticleBox = ({ topicId, title, description, iconUrl, articleCount }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  return (
    <article className="article-box">
      <Link href={`/${curr}-${lang}/hc/categories/${topicId}/${slugy(title)}`}>
        <a>
          <div className="article-box__box-cnt">
            <div className="article-box__box-left">
              {iconUrl === null ? (
                    <AjyalIcon />
              ) : 
              (
                <img
                src={`${process.env.NEXT_PUBLIC_HELPCENTER_PREFIX}/${topicId}/${iconUrl}`}
                alt={title}
                title={title}
                className="article-box__img"
              />
              )
              }

            </div>
            <div className="article-box__box-right">
              <h3 className="article-box__header">{title}</h3>
              <p className="article-box__des">{description}</p>
              <div className="article-box__count-cnt">
                <span className="article-box__count">
                  &nbsp;{articleCount}&nbsp;
                  <Translate id="articles" />
                </span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </article>
  );
};

export default ArticleBox;
