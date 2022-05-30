import React, { useState } from "react";
// import "./UploadBox.scss";
import { useDropzone } from "react-dropzone";
import imgupload from "./../../../assets/icons/createshop/img-upload.svg";
import { Translate } from "react-localize-redux";
import { useEffect } from "react";
import { v4 } from "uuid";
export default function UploadBox(props, { className }) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    noClick: true,
    noKeyboard: true,
    multiple: false,

    onDropAccepted: (acceptedFiles) => {
      props.handleSelectFile(acceptedFiles, props.index);
      setFiles(
        acceptedFiles.map((file) =>
        
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const setInitialFile = () => {
    let arr = [];
    if (props.oldFile == undefined) {
      return;
    }
    if (props.oldFile[props.index] != null) {
      if (props.oldFile[props.index] == files[0]) {
        return;
      }
      arr.push(props.oldFile[props.index]);
      setFiles(
        arr.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }
  };

  useEffect(() => {
    setInitialFile();
  }, [files]);

  const thumbs = files.map((file) => (
    <img
      src={file.preview}
      key={file.name}
      className="uploadBox__img"
      alt="upload"
    />
  ));

  const names = files.map((file) => {
    return (
      <li className="mb-2">
        <span className="uploadBox__drag-text">{file.name}</span>
      </li>
    );
  });

  if (thumbs.length === 0) {
    thumbs.push(
      <img
        src={imgupload}
        key={v4()}
        alt="upload icon"
        className="uploadBox__img uploadBox__img--icon"
      />
    );
  }
  return (
    <section className={`uploadBox ${className ? className : ""}`}>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="d-flex flex-row align-items-center">
          <div className="uploadBox__img-cnt">{thumbs}</div>
          <div className="uploadBox__right d-flex flex-row align-items-center flex-wrap">
            <ul className="w-100 p-0 m-0">{names}</ul>
            <span className="uploadBox__drag-text">
              <Translate id="upload.drag-drop" />
            </span>
            <button onClick={open} className="uploadBox__browse" type="button">
              <Translate id="upload.browse" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
