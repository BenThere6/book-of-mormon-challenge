import React, { useState, useEffect } from 'react';
import '../assets/css/PwaPrompt.css';

const PwaPrompt = ({ isVisible, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));
    setIsInStandaloneMode((window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      onClose();
    }
  };

  if (isInStandaloneMode) {
    return null; // Do not render the modal if in standalone mode
  }

  if (isIos) {
    return isVisible ? (
      <div id="pwa-install-prompt">
        <div id="pwa-modal">
          <h3>Install Lehi's Legacy for a better experience.</h3>
          <div id="ios-instructions">
            <div className="image-container">
              <img id="step-1" src="/pwa-how-to/step-1.jpeg" alt="Step 1" />
              <div className="circle" id="circle-1"></div>
            </div>
            <div className="image-container">
              <img id="step-2" src="/pwa-how-to/step-2.jpeg" alt="Step 2" />
              <div className="circle" id="circle-2"></div>
            </div>
            <div className="image-container">
              <img id="step-3" src="/pwa-how-to/step-3.jpeg" alt="Step 3" />
              <div className="circle" id="circle-3"></div>
            </div>
          </div>
          <button id="close-pwa-prompt" onClick={onClose}>Close</button>
        </div>
      </div>
    ) : null;
  }

  return isVisible ? (
    <div id="pwa-install-prompt">
      <div id="pwa-modal">
        <p>Install Lehi's Legacy for a better experience.</p>
        <button id="install-pwa" onClick={handleInstallClick}>Install</button>
        <button id="close-pwa-prompt" onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
};

export default PwaPrompt;