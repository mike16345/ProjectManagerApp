import React, { FC } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

interface ErrorModalProps {
  errorMsg: string;
  onCloseModal: () => void;
}

const ErrorModal: FC<ErrorModalProps> = (props: ErrorModalProps) => {
  return (
    <Modal onClose={props.onCloseModal}>
      <div className="errorBox">
        {props.errorMsg}
        <Button onClick={props.onCloseModal}>close</Button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
