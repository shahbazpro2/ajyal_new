import React from "react";
// import "./CreateShop.scss";
// import "./CreateShop-rtl.scss";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { v4 as uuidv4 } from "uuid";
import { CreateShopContext } from "./CreateShopContext";
import classnames from "classnames";
import BackIcon from "./../../../../assets/icons/back.svg";
import { getErrorMsg } from "../../../../lib/helpers";
import { getToastConfig } from "../../../../lib/toast";
import logo from "./../../../../assets/images/logo-2.png";
import { client_submitShop } from "./../../../../lib/api/client/clientShop";
import { selectLang } from "../../../../appConfigSlice";
import { ToastContainer, toast } from "react-toastify";
import {
  LOGIN,
  COUNTRY,
  STORE,
  DOCUMENT,
  VAT,
  BANK,
  PREV,
  NEXT,
  COMPLETE_AND_NEXT,
  END,
  Langs
} from "./CreateShopConstant";

import {
  CreateShopNav,
  Login,
  Country,
  Document,
  Store,
  Bank,
  Vat,
  End,
  CreateShopMobileNav,
} from "./CreateShopLayouts";
import { TabletsAndBigger, Tablets } from "../../../../Responsive.js";
import { switchLang } from "../../../../lib/switch";

class CreateShop extends React.Component {
  constructor(props) {
    super(props);

    const formState = {
      [LOGIN]: {
        complete: true,
        active: true,
        id: uuidv4(),
      },
      [COUNTRY]: {
        complete: false,
        active: false,
        id: uuidv4(),
      },
      [STORE]: { complete: false, active: false, id: uuidv4() },
      [DOCUMENT]: { complete: false, active: false, id: uuidv4() },
      [BANK]: { complete: false, active: false, id: uuidv4() },
      [VAT]: { complete: false, active: false, id: uuidv4() },
      [END]: { complete: false, active: false, id: uuidv4() },
    };

    const formData = {
      email: "",
      password: "",

      fkCountryId: 0,
      fkProvinceId: 0,
      fkCityId: 0,
      cityName: "",
      fkPersonId: 0,
      companyName: "",
      fullName: "",
      storeName: "",
      address: "",
      locationX: 0,
      locationY: 0,

      bankBeneficiaryName: "",
      bankName: "",
      bankBranch: "",
      bankAccountNumber: "",
      bankIban: "",
      bankSwiftCode: "",
      fkCurrencyId: 0,

      taxRegistrationNumber: "",

      shopId: 0,
      fkStatusId: 1,
      vendorUrlid: "",
      phone: "",

      tShopCategory: [],
      tShopFiles: [],
    };

    const filesData = {
      selectedCategory: null,

      identityFileDto: [],
      identityFiles: [],

      bankFileDto: [],
      bankFiles: [],

      taxFileDto: [],
      taxFiles: [],
    };

    this.NEXT_OR_PREV = NEXT;

    this.state = {
      step: LOGIN,
      formData,
      filesData,
      handleStep: this.handleStep,
      handleLogin: this.handleLogin,
      handleCountry: this.handleCountry,
      handleStore: this.handleStore,
      handleDocuments: this.handleDocuments,
      handleBank: this.handleBank,
      handleVat: this.handleVat,
      finalSubmit: this.finalSubmit,
      formState,
      lang: this.props.lang
    };


    this.finalSubmit = this.finalSubmit.bind(this);
  }

  handleLogin = (email, pass, mobileNumber, countryId, iso, phoneCode, countryName) => {
    this.state.formData.email = email;
    this.state.formData.password = pass;
    this.state.formData.fkCountryId = countryId;
    this.state.formData.iso = iso;
    this.state.formData.phoneCode = phoneCode;
    this.state.formData.countryName = countryName;
    this.state.formData.phone = mobileNumber;
    this.state.formData.phone = mobileNumber;
  };

  handleCountry = (city, cityName, clearAddress, provinceId) => {
    this.state.formData.fkCityId = city;
    this.state.formData.fkProvinceId = provinceId;
    this.state.formData.cityName = cityName;
    if (clearAddress === true) {
      this.state.formData.address = '';
      this.state.formData.locationX = 0;
      this.state.formData.locationY = 0;
    }
  };


  handleStore = (person, name, storename, address, cat, lat, lng) => {
    this.state.formData.fkPersonId = person;
    this.state.formData.storeName = storename;
    this.state.formData.vendorUrlid = storename;
    this.state.formData.address = address;
    this.state.filesData.selectedCategory = cat;
    this.state.formData.locationX = lat;
    this.state.formData.locationY = lng;
    if (person == 2) {
      this.state.formData.fullName = name;
    } else {
      this.state.formData.companyName = name;
    }
  };

  handleBank = (
    ben,
    bank,
    branch,
    acc,
    iban,
    swift,
    curr,
    files,
    filesModel
  ) => {
    (this.state.formData.bankBeneficiaryName = ben),
      (this.state.formData.bankName = bank),
      (this.state.formData.bankBranch = branch),
      (this.state.formData.bankAccountNumber = acc),
      (this.state.formData.bankIban = iban),
      (this.state.formData.bankSwiftCode = swift),
      (this.state.formData.fkCurrencyId = curr),
      (this.state.filesData.bankFileDto = filesModel),
      (this.state.filesData.bankFiles = files);
  };

  handleDocuments = (dto, files) => {
    this.state.filesData.identityFileDto = dto;
    this.state.filesData.identityFiles = files;
  };

  handleVat = (vat, dto, files) => {
    this.state.formData.taxRegistrationNumber = vat;
    this.state.filesData.taxFileDto = dto;
    this.state.filesData.taxFiles = files;
  };

  async finalSubmit() {

    let filesDto = this.filesData.identityFileDto.concat(
      this.filesData.bankFileDto,
      this.filesData.taxFileDto
    );
    filesDto.forEach(function (v) {
      delete v.index;
    });
    this.formData.tShopFiles = filesDto;
    this.formData.tShopCategory = [];
    this.formData.tShopCategory.push({
      shopCategoryId: 0,
      fkShopId: 0,
      fkCategoryId: this.filesData.selectedCategory.value,
    });

    let formData = new FormData();

    let allFiles = this.filesData.identityFiles.concat(
      this.filesData.bankFiles,
      this.filesData.taxFiles
    );



    // حذف کردن فایل های خالی

    let fileIndex = [];
    allFiles = allFiles.filter((el, index) => {
      if (el === null) {
        fileIndex.push(index);
      }
      return el != null;
    });
    this.formData.tShopFiles = this.formData.tShopFiles.filter((item, index) => item.FileUrl !== '');

    allFiles.forEach((element) => {
      formData.append("FilesDto", element);
    });
    formData.append("Shop", JSON.stringify(this.formData));



    try {

      const result = await client_submitShop(formData);
      if (result.status === 200) {
        return true;
      } else {
        toast.error(result.message, getToastConfig());
        return false;
      }
    } catch (er) {
      toast.error(getErrorMsg(this.lang, "error-create-shop"), getToastConfig());
      return false;
    }
  }

  handleStep = (type) => {
    let step, newFormState;
    const curstep = this.state.step;

    if (type === COMPLETE_AND_NEXT) {
      newFormState = {
        ...this.state.formState,
        [curstep]: {
          ...this.state.formState[curstep],
          active: false,
          complete: true,
        },
      };
      type = NEXT;
    } else {
      newFormState = {
        ...this.state.formState,
        [curstep]: {
          ...this.state.formState[curstep],
          active: false,
          complete: false

        },
      };
    }

    switch (type) {
      case NEXT:
        step = curstep >= 7 ? 7 : curstep + 1;
        break;
      case PREV:
        step = curstep <= 1 ? 1 : curstep - 1;
        break;
      case LOGIN:
        step = LOGIN;
        break;
      case COUNTRY:
        step = COUNTRY;
        break;
      case STORE:
        step = STORE;
        break;
      case DOCUMENT:
        step = DOCUMENT;
        break;
      case BANK:
        step = BANK;
        break;
      case VAT:
        step = VAT;
        break;
      case END:
        step = END;
        break;
      default:
        step = curstep >= 7 ? 7 : curstep + 1;
        break;
    }

    newFormState[step].active = true;

    // update NEXT_OR_PREV
    this.NEXT_OR_PREV = step >= curstep ? NEXT : PREV;

    this.setState({
      step,
      formState: newFormState,
    });
  };

  handleLastStep = () => {
    if (this.state.step == 6) {
      this.child.handleVatFromParent();
    }
  };

  renderSubNav() {
    const needBack =
      this.state.step !== LOGIN && this.state.step !== END ? true : false;
    return (
      <header className="createshop__subnav align-items-center d-flex justify-content-between">
        <div className="createshop__prev-cnt">
          {/* display on tablets and bigger */}
          <TabletsAndBigger>
            {needBack && (
              <div
                onClick={() => {
                  this.handleStep(PREV);
                  this.handleLastStep();
                }}
                className="text-align-right"
                style={{ cursor: "pointer" }}
              >
                <BackIcon className="createshop__back-icon" />
                <Translate id="subheader.back" />
              </div>
            )}
          </TabletsAndBigger>
        </div>

        <a href="/" className="align-self-center createshop__logo-cnt">
          {this.state.step !== END && (
            <img src={logo} alt="logo jyal" className="createshop__logo" />
          )}
        </a>
        <span
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            switchLang(this.props.loc, true);
          }}
          className="createshop__lang"
        >
          {Langs[this.props.lang]}
        </span>
      </header>
    );
  }

  render() {
    let content;
    // height = "400px";

    switch (this.state.step) {
      case LOGIN:
        content = <Login />;
        break;
      case COUNTRY:
        content = <Country />;
        break;
      case STORE:
        content = <Store lang={this.props.lang} />;
        break;
      case DOCUMENT:
        content = <Document />;
        break;
      case BANK:
        content = <Bank />;
        break;
      case VAT:
        content = <Vat ref={(Ref) => (this.child = Ref)} />;
        break;
      case END:
        content = <End />;
        break;
      default:
        content = <Login />;
    }

    return (
      <div>
        <section className="createshop">
          <CreateShopContext.Provider value={this.state}>
            {/* dispaly on tablets and smaller  */}
            <Tablets>
              <CreateShopMobileNav />
            </Tablets>
            <div className="createshop__box">
              {/* dispaly on tablets and bigger */}
              <TabletsAndBigger>
                <CreateShopNav />
              </TabletsAndBigger>

              {this.renderSubNav()}
              <TransitionGroup
                // style={
                //   {
                //     // height: height,
                //   }
                // }
                className={classnames("createshop__rel", {
                  next: this.NEXT_OR_PREV === NEXT,
                  prev: this.NEXT_OR_PREV === PREV,
                })}
              >
                <ToastContainer rtl={this.is_rtl} {...getToastConfig()} />

                <CSSTransition
                  key={this.state.formState[this.state.step].id}
                  timeout={300}
                  className="createshop__anim"
                >
                  {content}
                </CSSTransition>
              </TransitionGroup>
            </div>
          </CreateShopContext.Provider>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
  };
};

export default connect(mapStateToProps)(CreateShop);
