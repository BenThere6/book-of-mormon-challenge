import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const UpdateModal = ({ open, onClose, updateMessage, updateVersion }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update {updateVersion}</DialogTitle>
      <DialogContent>
        <ul>
          {updateMessage.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
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