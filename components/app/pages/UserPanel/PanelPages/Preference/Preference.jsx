import React, { useEffect, useState } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { selectLang } from "../../../../../../appConfigSlice";
import {
  client_getPreference,
  client_setPreference,
} from "../../../../../../lib/api/client/clientUserPanel";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { isRtl } from "../../../../../../lib/isRtl";
import { getToastConfig } from "../../../../../../lib/toast";
import {
  BoxStyle1,
  Loading,
  SelectBox3 as SelectBox,
} from "../../../../../common";
import ajyallWallet from "./../../../../../../assets/icons/ajyal-wallet.png";
import creditIcon from "./../../../../../../assets/icons/img-credit-card.svg";

const WALLET = 1;
const CART = 2;

const renderBoxHeader = () => {
  return (
    <div className="profile-edit__header-container">
      <h2 className="profile-edit__box-header">
        <Translate id="preference.preference" />
      </h2>
      <p className="profile-edit__box-subheader">
        <Translate id="preference.msg1" />
      </p>
    </div>
  );
};

let selectedItem = null;

const Preference = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [result, setResult] = useState(null);
  const lang = useSelector(selectLang);
  useEffect(() => {
    client_getPreference()
      .then((res) => {
        setResult(res.result);
        selectedItem = res.result;
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message, getToastConfig());
      });
  }, []);

  const handleSelectItem = (item) => {
    console.log(item);
    if (item.length > 0) selectedItem = item[0].name;
    else selectedItem = null;
    console.log(selectedItem);
  };

  const handleSave = async () => {
    if (saveLoading) return;
    console.log(selectedItem);
    // return;
    if (!selectedItem) {
      toast.error(getErrorMsg(lang, "select-Item"), getToastConfig());
      return;
    }

    setSaveLoading(true);

    try {
      const res = await client_setPreference(selectedItem);
      toast.success(getErrorMsg(lang, "refund-saved"), getToastConfig());
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <ToastContainer rtl={isRtl(lang)} {...getToastConfig()} />
      <BoxStyle1 headerContent={renderBoxHeader()}>
        <section className="container-fluid profile-edit preference">
          {loading ? (
            <Loading type="gray" width="50px" height="50px" />
          ) : (
            <>
              <SelectBox
                selectedItems={result ? [{ name: result }] : []}
                className="payment__select-cnt mt-5 mb-5"
                onChange={handleSelectItem}
              >
                <SelectBox.SelectItem name={WALLET}>
                  <img
                    src={ajyallWallet}
                    className="payment__icon"
                    alt="cash icon"
                  />
                  <span className="payment__text4 payment__text4--margin">
                    <Translate id="preference.wallet" />
                  </span>
                  <p className="payment__text2 mt-3">
                    <Translate id="preference.wallet-msg" />
                  </p>
                </SelectBox.SelectItem>
                <SelectBox.SelectItem name={CART}>
                  <img
                    src={creditIcon}
                    className="payment__icon"
                    alt="cash icon"
                  />
                  <span className="payment__text4 payment__text4--margin">
                    <Translate id="preference.card" />
                  </span>
                  <p className="payment__text2 mt-3">
                    <Translate id="preference.card-msg" />
                  </p>
                </SelectBox.SelectItem>
              </SelectBox>
              <div className="preference__btn-cnt">
                <button className="primary-btn" onClick={handleSave}>
                  {saveLoading ? (
                    <Loading type="white" with="20px" height="20px" />
                  ) : (
                    <Translate id="common.save" />
                  )}
                </button>
              </div>
            </>
          )}
        </section>
      </BoxStyle1>
    </>
  );
};

export default Preference;
