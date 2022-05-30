import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import { SEARCH_TYPE_MODULE } from "../../../../lib/querys";
import "./TopCategoryItem.scss";

export default ({ imageUrl, icon, text, itemId, haveLink , linkUrl }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  return (
    <div>
      {haveLink ? (
       
          <a href={linkUrl} target="_blank" className="topCategoriesList__item">
            <img
              alt={text}
              className="topCategoriesList__item-image"
              src={imageUrl}
            />
          </a>
       
      ) : (
        <Link
          href={`/${curr}-${lang}/search?id=${itemId}&type=${SEARCH_TYPE_MODULE}`}
        >
          <a className="topCategoriesList__item">
            <img
              alt={text}
              className="topCategoriesList__item-image"
              src={imageUrl}
            />
          </a>
        </Link>
      )}
    </div>
  );
};
