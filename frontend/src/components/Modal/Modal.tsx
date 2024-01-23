import React, { FC, ReactNode } from "react";
import classes from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Backdrop: FC<ModalProps> = (props) => {
  return (
    <div>
      <div onClick={props.onClose} className={classes.backdrop}></div>
      <div>{props.children}</div>
    </div>
  );
};

const ModalOverlay: FC<ModalProps> = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const Modal: FC<ModalProps> = (props) => {
  return (
    <React.Fragment>
      <Backdrop onClose={props.onClose} children={null} />
      <ModalOverlay children={props.children} onClose={props.onClose} />
    </React.Fragment>
  );
};

export default Modal;
