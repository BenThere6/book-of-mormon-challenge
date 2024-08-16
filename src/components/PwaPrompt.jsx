import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import '../assets/css/PwaPrompt.css';

const PwaPrompt = ({ isVisible, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [shareIcon, setShareIcon] = useState('/default-share-icon.png'); // Default share icon
  const [showInstallText, setShowInstallText] = useState(true); // New state to control visibility of the text
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("beforeinstallprompt event fired");
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));
    setIsInStandaloneMode((window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches);

    // Determine if the screen width is typically desktop size
    const isDesktopDevice = window.innerWidth >= 1024;
    setIsDesktop(isDesktopDevice);

    console.log(isDesktopDevice ? "User is on a desktop" : "User is on a mobile device");

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      // Show iOS installation instructions
      setShowIosInstructions(true);
      setShowInstallText(false); // Hide the text when showing iOS instructions
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      onClose();
    }
  };

  const renderIosInstructions = () => (
    <div id="ios-instructions" style={{ textAlign: 'left', position: 'relative', paddingBottom: '50px' }}>
      <p>To install this app on your iOS device:</p>
      <p>1. Tap the <img src={shareIcon} alt="Share icon" style={{ verticalAlign: 'middle', width: '20px' }} />icon in your browser.</p>
      <p>2. Select "Add to Home Screen".</p>
      <div className="ios-instructions-footer">
        <Button id="close-ios-instructions" onClick={onClose} variant="contained" color="primary">Close</Button>
      </div>
    </div>
  );
  
  if (isInStandaloneMode || isDesktop) {
    return null; // Do not render the modal if in standalone mode or on a desktop
  }

  return isVisible ? (
    <div id="pwa-install-prompt">
      <div id="pwa-modal">
        {showInstallText && <p>Install Lehi's Legacy for a better experience.</p>}
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