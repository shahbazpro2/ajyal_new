import React from "react";
import {
  BoxStyle2,
  SelectBox3 as SelectBox,
  MobileItemDrop,
  Loading,
} from "../../../../../common";
import {
  ProtraitPhonesAndBigger,
  ProtraitPhones,
  LandScapePhones,
  LandScapePhonesAndBigger,
} from "../../../../../../Responsive";
import { Translate } from "react-localize-redux";
import { ReactComponent as ArsIcon1 } from "./../../../../../../assets/icons/business-and-trade.svg";
import { ReactComponent as EditIcon } from "./../../../../../../assets/icons/edit-small.svg";
import { ReactComponent as DeleteIcon } from "./../../../../../../assets/icons/delete.svg";
import { ReactComponent as AddBlueIcon } from "./../../../../../../assets/icons/add-blue.svg";
import { useEffect } from "react";
import { useState } from "react";
import {
  client_getAddresses,
  client_deleteAddress,
  client_changeDestination,
  client_getAllShipMethod
} from "../../../../../../lib/api/client/clientOrder";
import { SELECT_ADDRESS, VERIFY_PHONE } from "./ShippingAddressConstant";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { useSelector } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import { NEXT } from "../../OrderConstants";
import { toast } from "react-toastify";
import { getToastConfig } from "../../../../../../lib/toast";
import NoAddressesPage from "../../../UserPanel/PanelPages/Addresses/AddressesLayouts/NoAddressesPage";
import classnames from "classnames";
import {
  client_changeMobileNumber,
  client_setDefaultAddress,
  
} from "../../../../../../lib/api/client/clientCommon";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { orderContext } from "../../OrderContext";

const AddressesList = ({ handleSituation, setData, handleOrderStep }) => {
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [continueLoading, setContinueLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
const [deliverymode,setdeliveryMode] = useState([])
const [selectd,setselectd]=useState(1);
  const lang = useSelector(selectLang);
  const PNF = PhoneNumberFormat;
  const phoneUtil = PhoneNumberUtil.getInstance();
  const getAddresses = () => {
    setAddressLoading(true);
    setSelectedAddress(null);
    client_getAddresses()
      .then((response) => {
        if (response.status === 200) {
          setAddressList(response.result);
          setAddressLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAddresses();
    
    const getdilivery=async()=>{
 const  result= await client_getAllShipMethod()
  console.log(result);
  setdeliveryMode(result.data.result)
  //  .then((res)=>{
  //   console.log("sejfsfsdfmsdfmsdmfsdmf",deliverymode,res);
  //   setdeliveryMode(res?.result)
  //   }).catch((err)=>{
  //     console.log(err)
  //   })
     }
    getdilivery()
  
    return () => {};
  }, []);

  const handleDelete = async (addressId) => {
    const con = confirm(getErrorMsg(lang, "confirm-address-delete"));
    if (!con) return;

    setAddressLoading(true);
    const del_resutl = await client_deleteAddress(addressId);

    if (del_resutl.status === 200) {
      client_getAddresses()
        .then((response) => {
          if (response.status === 200) {
            setAddressList(response.result);
            setAddressLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  const handleEdit = (adr) => {
    setData(
      {
        addressId: adr.addressId,
        address: adr.address,
        firstname: adr.transfereeName,
        lastname: adr.transfereeFamily,
        postalCode: adr.postalCode,
        mobileNumber: adr.transfereeMobile,
        requestId: null,
        lat: adr.locationX,
        lng: adr.locationY,
        isUpdate: true,
        shipingproviderid:selectd
      },
      () => {
        handleSituation(SELECT_ADDRESS);
      }
    );
  };

  const handleAddNew = () => {
    setData(
      {
        addressId: null,
        address: null,
        firstname: null,
        lastname: null,
        postalCode: null,
        mobileNumber: null,
        lat: null,
        lng: null,
        isUpdate: false,
        shipingproviderid:1
      },
      () => {
        handleSituation(SELECT_ADDRESS);
      }
    );
  };

  const handleSelectAddress = (selected) => {
    const id = selected[0] ? parseInt(selected[0].name) : null;
    const verified = selected[0] ? selected[0].value : null;
    setSelectedAddress({ id, verified });
  };

  const handleContinueClick = async () => {
    console.log(selectd)
    if (continueLoading) return;

    if (!selectedAddress || selectedAddress.id === null ) {
      toast.error(getErrorMsg(lang, "select-address"), getToastConfig());
      return;
    }

    if (selectd===null) {
      toast.error(getErrorMsg(lang, "select-address"), getToastConfig());
      return;
    }

    if (!selectedAddress.verified) {
      toast.error(getErrorMsg(lang, "verify-mobile"), getToastConfig());
      return;
    }

    setContinueLoading(true);

    try {
      const res = await client_changeDestination(selectedAddress.id);

      if (res.status === 200) {
        handleOrderStep(NEXT);
      }
    } catch (err) {
      setContinueLoading(false);
      toast.error(err.response.data.message, getToastConfig());
    }
  };

  const handleVerifyClick = async (item) => {
    if (verifyLoading) return;

    setVerifyLoading(true);

    try {
      const res = await client_changeMobileNumber({
        addressId: item.addressId,
        mobileNumber: item.transfereeMobile.trim(),
      });

      if (res.status == "200") {
        setData(
          {
            iso: item.iso,
            phoneCode: item.phoneCode,
            mobileNumber: item.transfereeMobile.trim(),
            addressId: item.addressId,
            requestId: res.result.requestId,
          },
          () => {
            handleSituation(VERIFY_PHONE);
          }
        );
      }
    } catch (err) {
      // this.setState({ verifyLoading: false });
      toast.error(err.response.data.message, getToastConfig());
      setVerifyLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const res = await client_setDefaultAddress({ addressId });

      if (res.status == "200") {
        getAddresses();
      }
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
    }
  };

  return (
    <>
      <BoxStyle2 className="orderaddress">
        {addressLoading ? (
          <Loading
            type="gray"
            width="40px"
            height="40px"
            styleSheet={{ margin: "50px auto" }}
          />
        ) : (
          <section className="orderaddress__cnt">
            {addressList.length === 0 && <NoAddressesPage withoutBtn />}
            <div className="mt-2 mb-2">
              {addressList.length > 0 ? (
                <SelectBox
                  className="returns-add-single__select-box--addresses"
                  onChange={handleSelectAddress}
                >
                  {addressList.map((adr) => {
                    return (
                      <SelectBox.SelectItem
                        justCircleClick
                        name={adr.addressId}
                        value={adr.mobileVerifed}
                      >
                        <div className="addresses__item-cnt no-gutters justify-content-between flex-wrap returns-add-single__addresses"
                        
                        >
                         
                          {/* display on langscape phones and smaller */}
                          {/* <LandScapePhones>
                            <a
                              href=""
                              className="mb-4 addresses__right-item addresses__right-item--gray-btn"
                            >
                              <Translate id="common.primary-address" />
                            </a>
                          </LandScapePhones> */}
                          <LandScapePhones>
                            <MobileItemDrop>
                              <a
                                href=""
                                className="addresses__right-item addresses__right-item--iconi"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(adr.addressId);
                                }}
                              >
                                <DeleteIcon className="addresses__right-item-icon" />
                                <Translate id="common.delete-address" />
                              </a>
                              <a
                                href=""
                                className="addresses__right-item addresses__right-item--iconi"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit(adr);
                                }}
                              >
                                <EditIcon className="addresses__right-item-icon" />
                                <Translate id="common.edit" />
                              </a>
                            </MobileItemDrop>
                          </LandScapePhones>
                          <div className="col-12 col-md-5 addresses__row-item">
                            <span className="addresses__icon-cnt">
                              <ArsIcon1 className="addresses__left-icon" />
                            </span>
                            <p className="addresses__ars-text">{adr.address}</p>
                          </div>
                          <div className="col-auto addresses__row-item">
                            <span className="addresses__ars-head">
                              <Translate id="common.name" />
                            </span>
                            <span className="addresses__ars-value" >
                              {adr.transfereeName + " " + adr.transfereeFamily}
                            </span>
                          </div>
                          <div className="col-auto  col-sm-auto addresses__row-item">
                            <span className="addresses__ars-head">
                              <Translate id="common.phone" />
                            </span>
                            <span className="addresses__ars-value">
                            {phoneUtil.format(
                                phoneUtil.parseAndKeepRawInput(
                                  adr.phoneCode + adr.transfereeMobile,
                                  adr.iso
                                ),
                                PNF.INTERNATIONAL
                              )}
                            </span>
                            {!adr.mobileVerifed && (
                              <span
                                className={classnames(
                                  "addresses__ars-alert",
                                  "d-block",
                                  {
                                    "addresses__ars-alert--disable": verifyLoading,
                                  }
                                )}
                                onClick={() => {
                                  handleVerifyClick(adr);
                                }}
                              >
                                <span className="addresses__alert-icon">!</span>
                                <Translate id="common.not-verified" />
                              </span>
                            )}
                          </div>
                          {/* display on landspace phone and bigger  */}
                          <LandScapePhonesAndBigger>
                            <div className="col-12 col-md-auto addresses__row-item">
                              {adr.isDefualt ? (
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  href=""
                                  className="addresses__right-item addresses__right-item--gray-btn"
                                >
                                  <Translate id="common.primary-address" />
                                </a>
                              ) : (
                                <a
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSetDefault(adr.addressId);
                                  }}
                                  className="addresses__right-item addresses__right-item--primary-btn"
                                >
                                  <Translate id="addresses.default" />
                                </a>
                              )}
                              <a
                                href=""
                                className="addresses__right-item addresses__right-item--iconi"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(adr.addressId);
                                }}
                              >
                                <DeleteIcon className="addresses__right-item-icon" />
                                <Translate id="common.delete-address" />
                              </a>
                              <a
                                href=""
                                className="addresses__right-item addresses__right-item--iconi"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit(adr);
                                }}
                              >
                                <EditIcon className="addresses__right-item-icon" />
                                <Translate id="common.edit" />
                              </a>
                            </div>
                          </LandScapePhonesAndBigger>
                      

                        </div>
                      </SelectBox.SelectItem>
                    );
                  })}
                </SelectBox>
              ) : null}
            </div>
          </section>
        )}
      </BoxStyle2>
  
                
      <section className="order-re__btn-cnt d-flex justify-content-end mt-4 mb-4 mr-xl-0 mr-3" >
      
        <ProtraitPhonesAndBigger>
          <button className="primary-btn" onClick={handleAddNew}>
            <Translate id="shipping.add-new-address" />
          </button>
          <button
            // onClick={this.handleContinueClick}
            className="primary-btn ml-4  rtl-ml-0 rtl-mr-4"
            onClick={handleContinueClick}
          >
            {continueLoading ? (
              <Loading
                type="white"
                width="20px"
                height="19px"
                styleSheet={{ display: "inline" }}
              />
            ) : (
              <Translate id="common.continue" />
            )}
          </button>
        </ProtraitPhonesAndBigger>
        <ProtraitPhones className="w-100">
          <button className="orderaddress__full-with-btn" onClick={handleAddNew}>
            <AddBlueIcon className="orderaddress__full-with-btn-icon" />
            <Translate id="shipping.add-new-address" />
          </button>

          <div className="checkout-fix justify-content-center">
            <button
              //   onClick={this.handleContinueClick}
              className="primary-btn returns__add-btn"
              onClick={handleContinueClick}
            >
              {continueLoading ? (
                <Loading
                  type="white"
                  width="20px"
                  height="19px"
                  styleSheet={{ display: "inline" }}
                />
              ) : (
                <Translate id="common.continue" />
              )}
            </button>
          </div>
        </ProtraitPhones>
      </section>
    </>
  );
};

export default AddressesList;
