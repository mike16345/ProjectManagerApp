import Modal from "../modal/Modal";
import Button from "../button/Button";
import classes from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  return (
    <Modal>
      <div className={classes.errorBox}>
        {props.errorMsg}
        <Button onClick={props.onCloseModal}>close</Button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
