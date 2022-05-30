import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import ArrowIcon from "../../../../../../assets/icons/linear-arrow.svg";
import NextLinkC from "next/link";

const NextLink = ({ children, ...props }) => {
  return (
    <NextLinkC {...props}>
      <a className={props.className}>{children}</a>
    </NextLinkC>
  );
};

const MenuItem = ({
  icon,
  text,
  value,
  href,
  onClick = () => {},
  link,
  badge = false,
  isReactRouter = true,
}) => {
  const showBadge = badge ? true : false;
  const Link = isReactRouter ? ReactRouterLink : NextLink;
  return (
    <li className="mobile-profile__nav-item ">
      <Link
        to={link}
        as={link}
        href={href}
        onClick={onClick}
        className="mobile-profile__nav-link d-flex justify-content-between align-items-center"
      >
        <div className="mobile-profile__nav-item-sub">
          {icon}
          <span>{text}</span>
        </div>
        <div className="mobile-profile__nav-item-sub">
          {value && (
            <span className="mobile-profile__nav-item-value">{value}</span>
          )}

          {showBadge && <span className="mobile-profile__badge">{badge}</span>}
          <ArrowIcon className="mobile-profile__menu-item-arrow" />
        </div>
      </Link>
    </li>
  );
};

export default MenuItem;
