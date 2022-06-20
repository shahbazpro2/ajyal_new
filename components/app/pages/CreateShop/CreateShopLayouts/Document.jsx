import React from "react";
import { Translate } from "react-localize-redux";
import { UploadBox, Loading } from "../../../../common";
import { COMPLETE_AND_NEXT } from "../CreateShopConstant";
import { CreateShopContext } from "../CreateShopContext";
import { client_getShopActiveDocumentById } from "./../../../../../lib/api/client/clientShop";
import { IDENTIYGRPOUPID } from "./../CreateShopConstant";

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      filesModel: [],
      files: [],
      showUploadFileError: false,
      showComponent: false,
      showLoader: false,
    };

    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSelectFile = (file, index) => {
    this.state.files[index] = file[0];
    this.state.filesModel[index].FileUrl = "file.jpg";
    this.setState({showUploadFileError : false });
  };

  static contextType = CreateShopContext;

  handleClick = () => {
    let valid = true;
    // this.state.files.forEach((element) => {
    //   if (element == null) {
    //     this.setState({ showUploadFileError: true });
    //     valid = false;
    //   }
    // });
    if (valid) {
      this.context.handleDocuments(this.state.filesModel, this.state.files);
      this.context.handleStep(COMPLETE_AND_NEXT);
    }
  };

  async componentDidMount() {
    this.setState({ showLoader: true });
    const result = await client_getShopActiveDocumentById(IDENTIYGRPOUPID);
    this.setState({ documents: result.result });

    if (this.context.filesData.identityFiles.length > 0) {
      this.setState(
        {
          files: this.context.filesData.identityFiles,
          filesModel: this.context.filesData.identityFileDto,
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

  render() {
    return (
      <div className="createshop__transition-cnt">
        {this.state.showLoader ? (
          <Loading type="gray" width="11%" height="70%" />
        ) : (
          <div>
            <div className="mt-5">
              <h3 className="createshop__header-text">
                <Translate id="document.document-msg1" />
              </h3>
              <div className="createshop__form createshop__form--document">
                <Translate>
                  {({ translate: t }) => {
                    return (
                      <>
                        {this.state.showComponent &&
                          this.state.documents.map((item, index) => {
                            return (
                              <label
                                className="auth__form-label"
                                key={item.fkPersonId}
                              >
                                <span className="auth__input-label">
                                  <Translate id="document.upload" />{" "}
                                  {item.documentTitle}
                                </span>
                                <UploadBox
                                  handleSelectFile={this.handleSelectFile}
                                  index={index}
                                  oldFile={this.state.files}
                                />
                                <div className="col-12 text-center">
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
            </div>
            <div className="createshop__btm text-align-center-ltr mb-5">
              <div className="auth__btn">
                <button
                  onClick={this.handleClick}
                  className="createshop__primary-btn primary-btn"
                >
                  <Translate id="country.next" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Document;
