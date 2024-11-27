import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideConfirmation } from "../Redux/slices/confirmationSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmationPopup = () => {
  const dispatch = useDispatch();
  const { isOpen, message, onConfirm, onCancel } = useSelector(
    (state) => state.confirmation
  );

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch(hideConfirmation());
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    dispatch(hideConfirmation());
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPopup;
