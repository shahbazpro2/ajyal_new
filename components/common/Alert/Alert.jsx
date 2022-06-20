import React from "react";
import BoxStyle2 from "../BoxStyle2";
// import "./Alert.scss";
// import { LandScapePhones } from "../../../Responsive";
import Link from "next/link";
import { ReactComponent as CorrectResult } from "./../../../assets/icons/correct.svg";
import { ReactComponent as FaildResult } from "./../../../assets/icons/faild.svg";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../appConfigSlice";

export default ({ to, btnText, topText, btmText, faild }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  return (
    <BoxStyle2 className="cancel-result flex-wrap no-gutters mt-0 alert">
      {faild ? (
        <FaildResult className="cancel-result__icon col-12 col-md-auto" />
      ) : (
        <CorrectResult className="cancel-result__icon col-12 col-md-auto" />
      )}
      <div style={{ flexGrow: 1 }}>
        <p className="cancel-result__text">{topText}</p>
        {btmText && (
          <p
            style={{ color: "#4d5a6c", fontWeight: "normal" }}
            className="mt-2 cancel-result__text"
          >
            {btmText}
          </p>
        )}
      </div>
      <Link href="/[lang-curr]" as={`/${curr}-${lang}`}>
        <a
          style={{ width: "200px" }}
          className="mt-4 mt-md-0 primary-btn col-12 col-md-auto"
        >
          {btnText}
        </a>
      </Link>
    </BoxStyle2>
  );
};
