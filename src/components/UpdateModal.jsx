import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';

const UpdateModal = ({ open, onClose, updates }) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    return () => {
      window.removeEventListener('resize', checkStandalone);
    };
  }, []);

  if (isStandalone) {
    return null; // Do not render the modal if in PWA standalone mode
  }

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