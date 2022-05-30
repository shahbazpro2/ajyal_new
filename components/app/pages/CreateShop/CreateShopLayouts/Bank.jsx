import React from "react";
import { Translate } from "react-localize-redux";
import { UploadBox, Loading } from "../../../../common";
import { COMPLETE_AND_NEXT } from "../CreateShopConstant";
import { CreateShopContext } from "../CreateShopContext";
import { FormErrorMsg } from "../../../../common";
import Select from "react-select";
import { client_getShopActiveDocumentById } from "./../../../../../lib/api/client/clientShop";
import { BANKGROUPID } from "./../CreateShopConstant";

class Bank extends React.Component {
  static contextType = CreateShopContext;

  constructor(props) {
    super(props);
    this.state = {
      beneficiary: "",
      bank: "",
      branch: "",
      account: "",
      iban: "",
      swiftCode: "",
      currencyId: 0,
      errors: {},
      filesModel: [],
      files: [],
      showComponent: false,
      showUploadFileError: false,
      showLoader: false,
      currencyOptions: [
        { value: 0, label: "Dollar" },
        { value: 1, label: "Dinar" }
      ],
    };

    this.handleBenefityChange = this.handleBenefityChange.bind(this);
    this.handleBankChange = this.handleBankChange.bind(this);
    this.handleBranchChange = this.handleBranchChange.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleIbanChange = this.handleIbanChange.bind(this);
    this.handleSwiftCodeChange = this.handleSwiftCodeChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handleBenefityChange = this.handleBenefityChange.bind(this);
  }

  async componentDidMount() {
    this.setState({ showLoader: true });

    const result = await client_getShopActiveDocumentById(BANKGROUPID);
    this.setState({ documents: result.result });

    if (this.context.filesData.bankFiles.length > 0) {
      this.setState(
        {
          beneficiary: this.context.formData.bankBeneficiaryName,
          bank: this.context.formData.bankName,
          branch: this.context.formData.bankBranch,
          account: this.context.formData.bankAccountNumber,
          iban: this.context.formData.bankIban,
          swiftCode: this.context.formData.bankSwiftCode,
          currencyId: this.context.formData.fkCurrencyId,
          files: this.context.filesData.bankFiles,
          filesModel: this.context.filesData.bankFileDto,
        },
        () => {
          setTimeout(() => {
            this.setState({ showComponent: true });
          }, 200);
        }
      );
    } else {
      result.result.forEach((item, index) => {
        this.state.filesModel.push({
          fileId: 0,
          shopId: 0,
          FkDocumentTypeId: this.state.documents[index].documentTypeId,
          FileUrl: "",
          index: index,
        });

        this.state.files.push(null);
      });
      this.setState({ showComponent: true });
    }
    this.setState({ showLoader: false });
  }

  setErrors = (func) => {
    const error = func(this.state.errors);
    this.setState({
      errors: error,
    });
  };

  handleBenefityChange = (event) => {
    this.setState({ beneficiary: event.target.value });
  };

  handleBankChange = (event) => {
    this.setState({ bank: event.target.value });
  };

  handleBranchChange = (event) => {
    this.setState({ branch: event.target.value });
  };

  handleAccountChange = (event) => {
    this.setState({ account: event.target.value });
  };

  handleIbanChange = (event) => {
    this.setState({ iban: event.target.value });
  };

  handleSwiftCodeChange = (event) => {
    this.setState({ swiftCode: event.target.value });
  };

  handleCurrencyChange = (event) => {
    this.setState({ currencyId: event.value });
  };

  handleSelectFile = (file, index) => {
    this.state.files[index] = file[0];
    this.state.filesModel[index].FileUrl = "file.jpg";
    
  };

  handleSubmit = (event) => {
    event.preventDefault();
    for (let key in this.state.errors) {
      if (this.state.errors[key]) {
        return;
      }
    }
    let valid = true;
    // this.state.files.forEach((element) => {
    //   if (element == null) {
    //     this.setState({ showUploadFileError: true });
    //     valid = false;
    //   }
    // });
    if (valid) {
      this.context.handleBank(
        this.state.beneficiary,
        this.state.bank,
        this.state.branch,
        this.state.account,
        this.state.iban,
        this.state.swiftCode,
        this.state.currencyId,
        this.state.files,
        this.state.filesModel
      );
      this.context.handleStep(COMPLETE_AND_NEXT);
    }
  };

  render() {
    return (
      <form className="createshop__transition-cnt" onSubmit={this.handleSubmit}>
        {this.state.showLoader ? (
          <Loading type="gray" width="11%" height="70%" />
        ) : (
          <div>
            <div className="mt-5">
              <h3 className="createshop__header-text">
                <Translate id="store.store-msg1" />
              </h3>
              <div className="createshop__form createshop__form--bank">
                <Translate>
                  {({ translate: t }) => {
                    return (
                      <>
                        <div className="createshop__form-cnt row justify-content-between">
                          <div className="col-12 col-sm-6">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.bene-name" />
                              </span>
                              <input
                                className="gray__input"
                                type="text"
                                placeholder={t("bank.bene-name-placeholder")}

                                onChange={this.handleBenefityChange}
                                value={this.state.beneficiary}
                              />
                              <FormErrorMsg
                                show={this.state.errors["ben"]}
                                msg={this.state.errors["ben"]}
                              />
                            </label>
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.bank-name" />
                              </span>
                              <input
                                className="gray__input"
                                type="text"
                                placeholder={t("bank.bank-name-placeholder")}

                                onChange={this.handleBankChange}
                                value={this.state.bank}
                              />
                              <FormErrorMsg
                                show={this.state.errors["bank"]}
                                msg={this.state.errors["bank"]}
                              />
                            </label>
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.branch-name" />
                              </span>
                              <input
                                className="gray__input"
                                type="text"
                                placeholder={t("bank.branch-name-placeholder")}

                                onChange={this.handleBranchChange}
                                value={this.state.branch}
                              />
                              <FormErrorMsg
                                show={this.state.errors["branch"]}
                                msg={this.state.errors["branch"]}
                              />
                            </label>
                          </div>

                          <div className="col-12 col-sm-6">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.acc-number" />
                              </span>
                              <input
                                className="gray__input"
                                type="text"
                                placeholder={t("bank.acc-number-placeholder")}

                                onChange={this.handleAccountChange}
                                value={this.state.account}
                              />
                              <FormErrorMsg
                                show={this.state.errors["account"]}
                                msg={this.state.errors["account"]}
                              />
                            </label>
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.IBAN-number" />
                              </span>
                              <input
                                className="gray__input"
                                type="text"
                                placeholder={t("bank.IBAN-number-placeholder")}
 
                                onChange={this.handleIbanChange}
                                value={this.state.iban}
                              />
                              <FormErrorMsg
                                show={this.state.errors["iban"]}
                                msg={this.state.errors["iban"]}
                              />
                            </label>
                          </div>

                          <div className="col-12 col-sm-6">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.swift-code" />
                              </span>
                              <input
                                className="gray__input"
                                type="text"
                                placeholder={t("bank.swift-code-placeholder")}
   
                                onChange={this.handleSwiftCodeChange}
                                value={this.state.swiftCode}
                              />
                              <FormErrorMsg
                                show={this.state.errors["swift"]}
                                msg={this.state.errors["swift"]}
                              />
                            </label>
                          </div>

                          <div className="col-12">
                            <label className="auth__form-label">
                              <span className="auth__input-label">
                                <Translate id="bank.currency" />
                              </span>

                              <Select
                                className="react-select"
                                options={this.state.currencyOptions}
                                onChange={this.handleCurrencyChange}
                                placeholder={t("bank.currency-placeholder")}
                                value={
                                  this.state.currencyId == 0
                                    ? this.state.currencyOptions[0]
                                    : this.state.currencyOptions[1]
                                }
                                required
                              />
                            </label>
                          </div>

                          {this.state.showComponent &&
                            this.state.documents.map((item, index) => {
                              return (
                                <div className="col-12" key={item.fkPersonId}>
                                  <p className="createshop__check-text mt-5">
                                    <Translate id="document.upload" />{" "}
                                    {item.documentTitle}
                                  </p>
                                  <UploadBox
                                    className="createshop__centered-upload"
                                    handleSelectFile={this.handleSelectFile}
                                    index={index}
                                    oldFile={this.state.files}
                                  />
                                  <div className="col-12 text-center mt-4">
                                    {this.state.showUploadFileError &&
                                      this.state.files[index] == null && (
                                        <span className="country-error">
                                          <Translate id="document.upload-file-error" />
                                        </span>
                                      )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    );
                  }}
                </Translate>
              </div>
            </div>
            <div className="createshop__btm text-align-center-ltr mb-5">
              <div className="auth__btn">
                <button
                  type="submit"
                  className="createshop__primary-btn primary-btn"
                >
                  <Translate id="country.next" />
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    );
  }
}

export default Bank;
