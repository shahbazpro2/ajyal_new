import React, { useEffect, useRef, useState } from "react";
import { Translate } from "react-localize-redux";
import helpImage from "./../../../assets/images/helpCenter.jpg";
import HelpSearchIcon from "./../../../assets/icons/help-search-icon.svg";
import { client_getSearchResult } from "../../../lib/api/client/clientHelpCenter";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { slugy } from "../../../lib/helpers";
import Link from "next/link";
let timer = null;
const HelpSubHeader = ({ img }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  const wrapperRef = useRef(null);

  const removeResult = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSearch("");
      setSearchResult([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", removeResult);
    return () => {
      document.removeEventListener("mousedown", removeResult);
    };
  }, []);

  const onSearchChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (!q) {
      setSearchResult([]);
      return;
    }

    const callback = async (q) => {
      try {
        const res = await client_getSearchResult(q);
        if (res.result) setSearchResult(res.result);
      } catch (er) {
        setSearchResult([]);
      }
    };

    timer = setTimeout(callback.bind(null, q), 500);
  };

  return (
    <div className="subheader container-fluid p-0">
      <img
        src={img ? `${process.env.NEXT_PUBLIC_LOGO_PREFIX}/${img}` : helpImage}
        alt="help center background"
        className="subheader__background"
      />
      <div className="subheader__content">
        <h1 className="subheader__header">
          <Translate id="help-center-title" />
        </h1>
        <div className="subheader__form-cnt">
          <label className="subheader__form-lable" htmlFor="help-search">
            <HelpSearchIcon className="subheader__search-icon" />
            <Translate>
              {({ translate: t }) => {
                return (
                  <input
                    className="subheader__search-input"
                    type="text"
                    name="help-search"
                    placeholder={t("help-center-search-placeholder")}
                    value={search}
                    onChange={onSearchChange}
                    id="help-search"
                  />
                );
              }}
            </Translate>
          </label>
          {searchResult.length > 0 && (
            <div ref={wrapperRef} className="subheader__result-cnt">
              <ul className="subheader__list">
                {searchResult.map((item) => {
                  return (
                    <li className="subheader__item">
                      <Link
                        href={`/${curr}-${lang}/hc/articles/${
                          item.articleId
                        }/${slugy(item.subject)}`}
                      >
                        <a
                          onClick={() => {
                            setSearchResult([]);
                            setSearch("");
                          }}
                          className="subheader__link"
                        >
                          <span className="subheader__subject">
                            {item.subject}
                          </span>
                          <span className="subheader__topic">
                            &nbsp; -&nbsp; {item.topic}
                          </span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSubHeader;
