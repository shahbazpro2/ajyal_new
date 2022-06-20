import React from "react";
import { Translate } from "react-localize-redux";
import { useParams, withRouter } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { LandScapePhonesAndBigger } from "../../../../../../../Responsive";
import { BoxStyle1, BoxStyle2 } from "../../../../../../common";
import AddAddressStep1 from "./AddAddressStep1";
import AddAddressStep2 from "./AddAddressStep2";
import AddAddressStep3 from "./AddAddressStep3";
import SelectAddress from "./SelectAddress";

class AddressesAdd extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props, "----");
    const { verifyPhone } = this.props;
    
    this.state = {
      currentSituation: verifyPhone ? 2 : 1,
      showSelectAddress: false,
      data: {
        isDefault: false,
        phoneNumberVeri: {
          requestId: verifyPhone ? verifyPhone.requestId : null,
          addressId: verifyPhone ? verifyPhone.addressId : null,
          phoneNumber: verifyPhone ? verifyPhone.phoneNumber : null,
          phoneIso: verifyPhone ? verifyPhone.phoneIso : null,
          phoneCode: verifyPhone ? verifyPhone.phoneCode : null,
        },
      },
    };

    this.handleSituation = this.handleSituation.bind(this);
  }

  setData = (data) => {
    const newData = { ...this.state.data };
    for (let key in data) {
      newData[key] = data[key];
    }

    this.setState({ data: newData });
  };

  handleSituation({ type }) {
    let nextState;
    switch (type) {
      case "addresses":
        this.setState({
          currentSituation: 1,
        });
        break;
      case "phoneveri":
        this.setState({
          currentSituation: 2,
        });
        break;
      case "changephone":
        this.setState({
          currentSituation: 3,
        });
        break;
      case "next":
        nextState =
          this.state.currentSituation >= 2
            ? 3
            : this.state.currentSituation + 1;
        this.setState({
          currentSituation: nextState,
        });
        break;
      case "prev":
        break;
      case "showMap":
        this.setState({
          showSelectAddress: true,
        });
        break;
      case "hideMap":
        this.setState({
          showSelectAddress: false,
        });
        break;
      default:
        break;
    }
  }

  setDefaultHandler = (e) => {
    this.setData({
      isDefault: e.target.checked,
    });
  };

  renderBoxHeader() {
    return (
      <>
        <h2 className="user-panel__box-header">
          <Translate id="addresses.addnewadd" />
        </h2>
        {this.state.currentSituation === 1 && (
          <LandScapePhonesAndBigger className="add-address-step1__check add-address-step1__check--desktop">
            {/* <input
              type="checkbox"
              id="setDefault"
              name="setDefault"
              checked={this.state.data.isDefault}
              onChange={this.setDefaultHandler}
              value="default"
            />
            <label for="setDefault">
              <Translate id="addresses.set-default-add" />
            </label> */}
          </LandScapePhonesAndBigger>
        )}
      </>
    );
  }

  render() {
    if (this.state.showSelectAddress) {
      return (
        <CSSTransition
          appear
          in={true}
          classNames="user-panel__routes"
          timeout={400}
        >
          <BoxStyle2>
            <SelectAddress
              setData={this.setData}
              handleSituation={this.handleSituation}
              lat={this.props.editItem?.locationX}
              lng={this.props.editItem?.locationY}
            />
          </BoxStyle2>
        </CSSTransition>
      );
    }

    let page;
    switch (this.state.currentSituation) {
      case 1:
        page = (
          <AddAddressStep1
            data={this.state.data}
            handleSituation={this.handleSituation}
            editItem={this.props.editItem}
            setData={this.setData}
          />
        );
        break;
      case 2:
        page = (
          <AddAddressStep2
            addpage={this.props.addpage}
            data={this.state.data.phoneNumberVeri}
            setData={this.setData}
            handleSituation={this.handleSituation}
          />
        );
        break;
      case 3:
        page = (
          <AddAddressStep3
            handleSituation={this.handleSituation}
            data={this.state.data.phoneNumberVeri}
            setData={this.setData}
          />
        );

        break;
      default:
        break;
    }

    return (
      <BoxStyle1 headerContent={this.renderBoxHeader()}>
        <SwitchTransition>
          <CSSTransition
            classNames="user-panel__routes"
            timeout={200}
            key={this.state.currentSituation}
          >
            {page}
          </CSSTransition>
        </SwitchTransition>
      </BoxStyle1>
    );
  }
}

export default withRouter(AddressesAdd);
