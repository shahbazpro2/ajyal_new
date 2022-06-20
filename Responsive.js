import { useMediaQuery } from "react-responsive";

// Extra small devices (portrait phones, less than 576px)
export const MediaProtraitPhones = { maxWidth: 575.98 };
export const MinMediaProtraitPhones = { minWidth: 575.98 }; /// sm

// Small devices (landscape phones, less than 768px)
export const MediaLandScapePhone = { maxWidth: 767.98 };
export const MinMediaLandScapePhone = { minWidth: 767.98 }; /// md

// Medium devices (tablets, less than 992px)
export const MediaTablets = { maxWidth: 991.98 };
export const MinMediaTablets = { minWidth: 991.98 }; /// lg
// Large devices (desktops, less than 1200px)
export const MediaDesktops = { maxWidth: 1199.98 };
export const MinMediaDesktops = { minWidth: 1199.98 }; /// xl
//// React responsive Components
export const ProtraitPhones = ({ children, className }) => {
  return <div className={`d-block d-sm-none ${className ? className : ''}`}>{children}</div>;
};

export const ProtraitPhonesAndBigger = ({ children, className }) => {
  return <div className={`d-none d-sm-block  ${className ? className : ''}`}>{children}</div>;
};

export const LandScapePhones = ({ children, className }) => {
  return <div className={`d-block d-md-none ${className ? className : ''}`}>{children}</div>;
};
export const LandScapePhonesAndBigger = ({ children, className }) => {
  return <div className={`d-none d-md-block ${className ? className : ''}`}>{children}</div>;
};

export const Tablets = ({ children, className }) => {
  return <div className={`d-block d-lg-none ${className ? className : ''}`}>{children}</div>;
};
export const TabletsAndBigger = ({ children, className }) => {
  return <div className={`d-none d-lg-block ${className ? className : ''}`}>{children}</div>;
};

export const Desktops = ({ children, className }) => {
  return <div className={`d-block d-xl-none ${className ? className : ''}`}>{children}</div>;
};

export const DesktopsAndBigger = ({ children, className }) => {
  return <div className={`d-none d-xl-block ${className ? className : ''}`}>{children}</div>;
};
