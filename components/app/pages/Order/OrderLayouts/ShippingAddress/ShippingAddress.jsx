import React from "react";
// import "./ShippingAddress.scss";
// import "./ShippingAddress-rtl.scss";
import {
  COMPLETE,
  VERIFY_PHONE,
  CHANGE_PHONE,
  SELECT_ADDRESS,
  GET_ADDRESS_DETAIL,
} from "./ShippingAddressConstant";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import VerifyPhone from "./VerifyPhone";
import ChangePhone from "./ChangePhone";
import { COMPLETE_AND_NEXT } from "../../OrderConstants";
import { orderContext } from "../../OrderContext";
import SelectAddress from "./SelectAddress";
import AddressDetails from "./AddressDetails";
import AddressesList from "./AddressesList";

import {
  client_addAddress,
  client_updateAddress,
} from "../../../../../../lib/api/client/clientOrder";

export default class ShippingAddress extends React.Component {
  static contextType = orderContext;
  constructor(props) {
    super(props);

    this.state = {
      situation: COMPLETE,
      get_address_Loading: false,
      data: {
        addressId: null,
        requestId: null,
        isUpdate: false,
        address: null,
        iso: null,
        phoneCode: null,
        firstname: null,
        lastname: null,
        postalCode: null,
        mobileNumber: null,
        lat: null,
        lng: null,
        shipingproviderid: null,
      },
    };

    // for test
    this.bool = true;
    ////

    this.handleSituation = this.handleSituation.bind(this);
  }

  setData = (newData, cb) => {
    this.setState(
      (state) => {
        return {
          ...state,
          data: {
            ...state.data,
            ...newData,
          },
        };
      },
      () => {
        if (cb) {
          cb();
        }
      }
    );
  };

  addNewAddress = async (cb) => {
    if (this.state.data.isUpdate) {
      try {
        const result = await client_updateAddress({
          addressId: this.state.data.addressId,
          transfereeMobile: this.state.data.mobileNumber,
          postalCode: this.state.data.postalCode,
          address: this.state.data.address,
          locationX: this.state.data.lat,
          locationY: this.state.data.lng,
          transfereeName: this.state.data.firstname,
          transfereeFamily: this.state.data.lastname,
        });

        if (result.status === 200) {
          cb && cb();
        }
      } catch (err) {}
    } else {
      try {
        const result = await client_addAddress({
          transfereeMobile: this.state.data.mobileNumber,
          postalCode: this.state.data.postalCode,
          address: this.state.data.address,
          locationX: this.state.data.lat,
          locationY: this.state.data.lng,
          transfereeName: this.state.data.firstname,
          transfereeFamily: this.state.data.lastname,
        });

        if (result.status === 200) {
          this.setData(
            {
              addressId: result.result.addressId,
              requestId: result.result.requestId,
            },
            () => {
              cb && cb();
            }
          );
        }
      } catch (err) {}
    }
  };

  handleSituation(type) {
    let situation;
    switch (type) {
      case CHANGE_PHONE:
        situation = CHANGE_PHONE;
        break;
      case COMPLETE:
        situation = COMPLETE;
        break;
      case VERIFY_PHONE:
        situation = VERIFY_PHONE;
        break;
      case GET_ADDRESS_DETAIL:
        situation = GET_ADDRESS_DETAIL;
        break;
      case SELECT_ADDRESS:
        situation = SELECT_ADDRESS;
        break;
      default:
        situation = COMPLETE;
        break;
    }

    this.setState({ situation });
  }

  handleContinueClick = () => {
    this.bool
      ? this.handleSituation(VERIFY_PHONE)
      : this.context.handleStep(COMPLETE_AND_NEXT);
    this.bool = false;
  };

  render() {
    let content;
    const situation = this.state.situation;
    switch (situation) {
      case COMPLETE:
        content = (
        
          <AddressesList
            setData={this.setData}
            handleSituation={this.handleSituation}
            handleOrderStep={this.props.handleOrderStep}
          />
         
         
        );
        break;
      case VERIFY_PHONE:
        content = (
          <VerifyPhone
            setData={this.setData}
            currdata={this.state.data}
            handleSituation={this.handleSituation}
          />
        );
        break;
      case CHANGE_PHONE:
        content = (
          <ChangePhone
            setData={this.setData}
            handleSituation={this.handleSituation}
            currdata={this.state.data}
          />
        );
        break;
      case SELECT_ADDRESS:
        content = (
          <SelectAddress
            handleSituation={this.handleSituation}
            setData={this.setData}
            lat={this.state.data.lat}
            lng={this.state.data.lng}
          />
        );
        break;
      case GET_ADDRESS_DETAIL:
        content = (
          <AddressDetails
            addAddress={this.addNewAddress}
            setData={this.setData}
            handleSituation={this.handleSituation}
            currdata={this.state.data}
          />
        );
        break;
      default:
        content = this.renderAddresses();
        break;
    }

    return (
      <>
        <SwitchTransition>
          <CSSTransition
            key={this.state.situation}
            key={this.state.situation}
            classNames="user-panel__routes"
            timeout={200}
          >
            {content}
          </CSSTransition>
        </SwitchTransition>
      </>
    );
  }
}
