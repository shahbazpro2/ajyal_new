import React from "react";
import { Translate } from "react-localize-redux";
import { UploadBox, Loading } from "../../../../common";
import { END, COMPLETE_AND_NEXT } from "../CreateShopConstant";
import { CreateShopContext } from "../CreateShopContext";
import { FormErrorMsg } from "../../../../common";
import { client_getShopActiveDocumentById } from "./../../../../../lib/api/client/clientShop";
import { TAXGRPOUPID } from "./../CreateShopConstant";


class Vat extends React.Component {
  static contextType = CreateShopContext;

  constructor(props) {
    super(props);
    this.state = {
      vat: "",
      documents: [],
      filesModel: [],
      files: [],
      errors: {},
      isAccepted: false,
      showUploadFileError: false,
      showComponent: false,
      showLoader: false,
      showSubmitLoader: false
    };

    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeAccept = this.changeAccept.bind(this);
  }

  async componentDidMount() {
    this.setState({ showLoader: true });
    const result = await client_getShopActiveDocumentById(TAXGRPOUPID);
    this.setState({ documents: result.result });

    if (this.context.filesData.taxFiles.length > 0) {
      this.setState(
        {
          vat: this.context.formData.taxRegistrationNumber,
          filesModel: this.context.filesData.taxFileDto,
          files: this.context.filesData.taxFiles,
        },
        () => {
          this.setState({ showComponent: true });
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

  handleVatChange = (event) => {
    this.setState({ vat: event.target.value });
  };

  changeAccept = () => {
    this.setState({ isAccepted: !this.state.isAccepted });
  };

  handleSelectFile = (file, index) => {
    this.state.files[index] = file[0];
    this.state.filesModel[index].FileUrl = "file.jpg";
  };

  handleSubmit = async (event) => {
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
      this.context.handleVat(
        this.state.vat,
        this.state.filesModel,
        this.state.files
      );
      this.setState({ showSubmitLoader: true });
      let isFinish = await this.context.finalSubmit();
      if (isFinish) {
        this.context.handleStep(COMPLETE_AND_NEXT);
        this.setState({ showSubmitLoader: false });
      } else {
        this.setState({ showSubmitLoader: false });
      }
    }
  };

  setErrors = (func) => {
    const error = func(this.state.errors);
    this.setState({
      errors: error,
    });
  };


  handleVatFromParent = () => {
    this.context.handleVat(
      this.state.vat,
      this.state.filesModel,
      this.state.files    );
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
                <Translate id="vat.vat-msg1" />
              </h3>
              <div className="createshop__form createshop__form--vat">
                <Translate>
                  {({ translate: t }) => {
                    return (
                      <>
                        <label className="auth__form-label">
                          <span className="auth__input-label">
                            <Translate id="vat.tax-input-label" />
                          </span>
                          <input
                            className="gray__input"
                            type="text"
                            placeholder={t("vat.tax-input-placeholder")}

                            onChange={this.handleVatChange}
                            value={this.state.vat}
                          />
                          <FormErrorMsg
                            show={this.state.errors["vat"]}
                            msg={this.state.errors["vat"]}
                          />
                        </label>

                        {this.state.showComponent &&
                          this.state.documents.map((item, index) => {
                            return (
                              <label className="auth__form-label">
                                <span className="auth__input-label">
                                  <Translate id="document.upload" />{" "}
                                  {item.documentTitle}
                                </span>
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
                              </label>
                            );
                          })}
                      </>
                    );
                  }}
                </Translate>
              </div>
              <div className="createshop__full-check-cnt d-flex align-items-start">
                <input
                  type="checkbox"
                  id="agreement"
                  name="agreement"
                  value={this.state.isAccepted}
                  onChange={this.changeAccept}
                />
                <label for="agreement" className="createshop__check-text">
                <Translate id="vat.vat-end-msg" />
                </label>
                <br />
              </div>
            </div>


            <div className="createshop__btm text-align-center-ltr mb-5">
              <div className="auth__btn">
                <button
                  disabled={!this.state.isAccepted}
                  className="createshop__primary-btn primary-btn"
                >
                  {this.state.showSubmitLoader ? (
                    <Loading type="white" width="20px" height="100%" />
                  ) : (
                    <Translate id="vat.submit" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    );
  }
}

export default Vat;
