import React, { useState } from "react";
import "./HtmlRenderModal.scss";
import "./HtmlRenderModal-rtl.scss";
import { selectLang } from "../../../appConfigSlice";
import { useSelector } from "react-redux";
import { Translate } from "react-localize-redux";
import { ReactComponent as CloseIcon } from "./../../../assets/icons/Cancelled-gray.svg";
import { ReactComponent as HelpIcon } from "./../../../assets/icons/help-circle.svg";
import { ReactComponent as HelpIconAr } from "./../../../assets/icons/help-circle-ar.svg";

export default ({ description , showText = true }) => {
  const lang = useSelector(selectLang);
  const [showModal, setShowModal] = useState(false);

  const toggleShow = () => {
    setShowModal(!showModal);
  }

  return (
    <div className="box-wrapper">
      <div className="box-wrapper__title">
        {showText ? (
        <span onClick={toggleShow} className="box-wrapper__text"><Translate id="How-are-these-calculated" /></span>
        ) : null}
        <div onClick={toggleShow} className="box-wrapper__help-icon-wrapper">
          {lang == 'en' ? (
          <HelpIcon className="box-wrapper__help-icon" />
          ) : (
          <HelpIconAr className="box-wrapper__help-icon" />

          )}
        </div>
      </div>
      <div className={`modal-wrapper ${showModal ? 'show' : 'hide'}`}>
        <div className="modal">
          <div onClick={toggleShow} className="modal__icon-wrapper">
            <CloseIcon className="modal__icon" />
          </div>
          <div className="modal__content">
            <div className="ql-editor"
              dangerouslySetInnerHTML={{ __html: description }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
