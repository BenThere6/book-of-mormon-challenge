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

  if (isIos && !isInStandaloneMode) {
    return isVisible ? (
      <div id="pwa-install-prompt">
        <div id="pwa-modal">
          <p>Install Lehi's Legacy for a better experience.</p>
          <p>Tap the share button, then 'Add to Home Screen'.</p>
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