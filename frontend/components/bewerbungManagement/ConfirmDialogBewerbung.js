import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmDialogBewerbung({
  onClick,
  closeDialog,
  title,
  onConfirm,
  detail,
}) {
  const [show, setShow] = useState(false);
  const showDialogDelete = () => {
    setShow(true);
    onClick();
  };
  const handleClose = () => {
    setShow(false);
    closeDialog();
  };

  const handleConfirmDelete = () => {
    onConfirm(true);
    onClick();
    handleClose();
  };
  return (
    <div>
      <Button
        variant="danger"
        onClick={showDialogDelete}
        id={`DegreeCourseApplicationDeleteButton${detail}`}
      >
        Delete
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        id={`DeleteDialogDegreeCourseApplication${detail}`}
      >
        <Modal.Header closeButton>
          <Modal.Title>Studienbewerbung {title} löschen ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Soll Studienbewerbung {title} gelöscht werden ?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleClose}
            id="DeleteDialogCancelButton"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmDelete}
            id="DeleteDialogConfirmButton"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConfirmDialogBewerbung;
