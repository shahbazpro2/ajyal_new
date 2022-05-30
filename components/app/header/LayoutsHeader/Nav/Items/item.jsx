import React from "react";

const item = (probs) => (
  <div
    href=""
    className={"nav__link " + (probs.isCategory ? "nav__link--first" : "")}
  >
    {probs.icon}

    <span
      className={
        "nav__link-text " +
        (probs.isCategory ? "nav__link-text--margin" : "mx-3")
      }
    >
      {probs.content}
    </span>
    {probs.downIcon}
  </div>
);

export default item;
