import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const UpdateModal = ({ open, onClose, updateMessage, updateVersion }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update version {updateVersion}</DialogTitle>
      <DialogContent>
        <DialogContentText>{updateMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;