import React from "react";
import arrow from "./../../../assets/images/breadcrump.png";
import { Translate } from "react-localize-redux";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { SEARCH_TYPE_CATEGORY } from "../../../lib/querys";

export default ({ className, data , isGoodsDetails , goodsName }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  return (
    <div className={`breadcrump ${className}`}>
      <ul className="breadcrump__list">
        <li className="breadcrump__item" key="id1214">
          <Link href={`/${curr}-${lang}`}>
            <a className="breadcrump__link">
              <Translate id="home" />
            </a>
          </Link>
          <i className="breadcrump__img-cnt">
            <img src={arrow} alt="breadcrump icon" />
          </i>
        </li>
        {data &&
          data.map((cat, index) => {
            return (
              <li key={index} className="breadcrump__item">
                <Link
                  href={`/${curr}-${lang}/search?type=${SEARCH_TYPE_CATEGORY}&id=${cat.categoryId}`}
                >
                  <a className="breadcrump__link">{cat.categoryTitle}</a>
                </Link>
                <i className="breadcrump__img-cnt">
                  <img src={arrow} alt="breadcrump icon" />
                </i>
              </li>
            );
          })}

          {isGoodsDetails ? (
              <li  className="breadcrump__item">
                <a className="breadcrump__link">{goodsName}</a>
              <i className="breadcrump__img-cnt">
                <img src={arrow} alt="breadcrump icon" />
              </i>
            </li>
          ) : null}

      </ul>
    </div>
  );
};
