import React from "react";
import { useSelector } from "react-redux";
import { selectLang } from "../../../appConfigSlice";
import { isAr } from "../../../lib/helpers";
import loader from "./../../../assets/icons/img-loader-ora.svg";
const PageLoading = () => {
  const lang = useSelector(selectLang);
  return (
    <div className="pageloading d-flex">
      <img
        className="pageloading__img"
        alt="loading..."
        title="loading..."
        src={loader}
      />
      <p className="pageloading__text">{isAr(lang) ? "تحميل الصفحة" : "Loading Page"}</p>
    </div>
  );
};

export default PageLoading;
