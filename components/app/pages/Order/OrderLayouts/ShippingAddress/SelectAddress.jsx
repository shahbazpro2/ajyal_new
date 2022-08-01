import React from "react";
import { BoxStyle2 } from "../../../../../common";
import { COMPLETE, GET_ADDRESS_DETAIL } from "./ShippingAddressConstant";
import Map from "./Map";
import { toast } from "react-toastify";
import { getToastConfig } from "../../../../../../lib/toast";
import { useSelector } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import { getErrorMsg } from "../../../../../../lib/helpers";


const SelectAddress = ({ handleSituation, setData, lat, lng }) => {
  const lang = useSelector(selectLang);

  const back = () => {
    handleSituation(COMPLETE);
  };

  const handleSubmit = ({ address, lat, lng, phoneCode, iso }) => {

    setData({
      address,
      lat,
      lng,
      phoneCode,
      iso,
    });
    handleSituation(GET_ADDRESS_DETAIL);
  };

  const handleAreaError = (err) => {
    toast.dismiss();
    if (err?.response?.data?.message) {
      toast.error(err.response.data.message, getToastConfig());
    } else {
      toast.error("error occurred for request", getToastConfig());
    }
  };

  return (
    <BoxStyle2 className="orderaddress__change-phone p-5">
      <section className="add-address-step3">
        <Map
          back={back}
          handleSubmit={handleSubmit}
          lat={lat}
          lng={lng}
          areaError={handleAreaError}
        />
      </section>
    </BoxStyle2>
  );
};

export default SelectAddress;
