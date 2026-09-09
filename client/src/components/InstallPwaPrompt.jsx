import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

const InstallPwaPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setIsVisible(true);
    }

    // Android / Desktop Chrome / Edge event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#11261D] text-[#FAF6F0] rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#D4A373]/50 flex items-start gap-3.5 backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] p-1.5 shrink-0 flex items-center justify-center border border-[#D4A373]">
          <img src="/icons/icon.svg" alt="36 Montane Logo" className="w-full h-full object-contain" />
        </div>

        <div className="flex-grow text-left">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold font-serif text-[#FAF6F0] text-sm sm:text-base leading-tight">
              Install 36 Montane App
            </h4>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white text-xs p-1"
              aria-label="Dismiss app install banner"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-xs text-[#D8CFBC] mt-1 leading-relaxed">
            {isIOS ? (
              <span>
                Tap the <strong className="text-[#E9C46A]">Share button</strong> in Safari, then select <strong className="text-[#E9C46A]">"Add to Home Screen"</strong> for offline forest maps!
              </span>
            ) : (
              <span>Offline trail maps, fast access & 1-tap WhatsApp booking from your home screen.</span>
            )}
          </p>

          {!isIOS && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="px-4 py-1.5 bg-[#C84B31] hover:bg-[#9E321C] text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition hover:scale-105"
              >
                <FaDownload className="text-[11px]" />
                <span>Install Now</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs text-[#D8CFBC] hover:text-white transition"
              >
                Maybe Later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPwaPrompt;
