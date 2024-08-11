import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import '../assets/css/PwaPrompt.css';

const PwaPrompt = ({ isVisible, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [shareIcon, setShareIcon] = useState('/default-share-icon.png'); // Default share icon

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));
    setIsInStandaloneMode((window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches);

    // Set the share icon based on the browser
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setShareIcon('/ios-share-icon.png');
    } else if (userAgent.includes('android')) {
      setShareIcon('/android-share-icon.png');
    } else {
      setShareIcon('/default-share-icon.png');
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      // Show iOS installation instructions
      setShowIosInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      onClose();
    }
  };

  const renderIosInstructions = () => (
    <div id="ios-instructions" style={{ textAlign: 'left' }}>
      <p>To install this app on your iOS device:</p>
      <p>1. Tap the <img src={shareIcon} alt="Share icon" style={{ verticalAlign: 'middle', width: '20px' }} />icon in your browser.</p>
      <p>2. Select "Add to Home Screen".</p>
      <Button id="close-ios-instructions" onClick={onClose} variant="contained" color="primary">Close</Button>
    </div>
  );

  if (isInStandaloneMode) {
    return null; // Do not render the modal if in standalone mode
  }

  return isVisible ? (
    <div id="pwa-install-prompt">
      <div id="pwa-modal">
        <p>Install Lehi's Legacy for a better experience.</p>
        {!showIosInstructions ? (
          <>
            <Button id="install-pwa" onClick={handleInstallClick} variant="contained" color="primary">Install</Button>
            <Button id="close-pwa-prompt" onClick={onClose} variant="contained" color="primary">Close</Button>
          </>
        ) : renderIosInstructions()}
      </div>
    </div>
  ) : null;
};

export default PwaPrompt;