import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';

const UpdateModal = ({ open, onClose, updates }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Updates</DialogTitle>
      <DialogContent>
        <ScrollIndicatorContainer>
          {updates.map((update, index) => (
            <div key={index}>
              <h4>Version {update.version} - {update.date}</h4>
              <ul>
                {update.messages.map((message, msgIndex) => (
                  <li key={msgIndex}>{message}</li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollIndicatorContainer>
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