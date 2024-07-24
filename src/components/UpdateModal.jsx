import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';

const UpdateModal = ({ open, onClose, updates }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Updates</DialogTitle>
      <ScrollIndicatorContainer>
        <DialogContent>
          {updates.map((update, index) => (
            <div key={index}>
              <h4>Version {update.version}</h4>
              <ul>
                {update.messages.map((message, msgIndex) => (
                  <li key={msgIndex}>{message}</li>
                ))}
              </ul>
            </div>
          ))}
        </DialogContent>
      </ScrollIndicatorContainer>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;