import React from "react";
// import "./Pager.scss";
// import "./Pager-rtl.scss";
import classnames from "classnames";
import { ReactComponent as ArrowLeft } from "./../../../assets/icons/play-left.svg";

export default ({
  count = 0,
  activeItem,
  onPageClick,
  smoothScroll,
  scrollTo,
}) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push(
      <li className="pager__item">
        <a
          href=""
          className={classnames("pager__link", { active: i === activeItem })}
          onClick={(e) => {
            e.preventDefault();
            onPageClick(i);
            if (smoothScroll) {
              window.scrollTo({
                top: scrollTo || 0,
                behavior: "smooth",
              });
            }
          }}
        >
          {i}
        </a>
      </li>
    );
  }

  return (
    <ul className="pager">
      {count !== 0 && count !== 1 && (
        <>
          {activeItem > 1 && (
            <li className="pager__item">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageClick(activeItem - 1);
                }}
                className="pager__link"
              >
                <ArrowLeft className="pager__prev-icon" />
              </a>
            </li>
          )}
          {items}
          {activeItem < count && (
            <li className="pager__item">
              <a
                href="/#"
                className="pager__link"
                onClick={(e) => {
                  e.preventDefault();
                  onPageClick(activeItem + 1);
                }}
              >
                <ArrowLeft className="pager__next-icon" />
              </a>
            </li>
          )}
        </>
      )}
    </ul>
  );
};
