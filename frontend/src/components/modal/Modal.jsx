import classes from "./Modal.module.css";

import { Fragment } from "react";

const BackDrop = (props) => {
  return (
    <div>
      <div onClick={props.onClose} className={classes.backdrop}></div>
      <div>{props.children}</div>
    </div>
  );
};

const ModalOverLay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <Fragment>
      <BackDrop onClose={props.onClose}>
        <ModalOverLay>{props.children}</ModalOverLay>
      </BackDrop>
    </Fragment>
  );
};

export default Modal;
