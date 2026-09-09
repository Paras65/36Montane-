import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getUpiId, generatePaymentConfirmationWhatsAppUrl } from '../utils/whatsapp';

const UpiPaymentModal = ({ booking, onClose }) => {
  const upiId = getUpiId();
  const totalPrice = Number(booking.totalPrice) || 0;

  // Calculate default 20% advance rounded to nearest 50, minimum ₹500
  const defaultAdvance = totalPrice > 0 
    ? Math.max(500, Math.min(totalPrice, Math.round((totalPrice * 0.2) / 50) * 50))
    : 500;

  const [selectedAdvance, setSelectedAdvance] = useState(defaultAdvance);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate UPI URI
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('36 Montane Expeditions')}&am=${selectedAdvance}&cu=INR&tn=${encodeURIComponent(`Advance - ${booking.name || 'Expedition'}`)}`;

  // Generate QR code data URL
  useEffect(() => {
    QRCode.toDataURL(upiPayUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: '#11261D', // Sal deep green
        light: '#FFFFFF'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [upiPayUrl]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappScreenshotUrl = generatePaymentConfirmationWhatsAppUrl(booking, selectedAdvance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF6F0] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D4A373]/50 text-stone-900 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-200/50 hover:bg-stone-200 w-8 h-8 rounded-full flex items-center justify-center transition text-sm font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11261D] text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-2 border border-amber-400/30">
            <span>🌾 36 MONTANE • TOKEN ADVANCE</span>
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#11261D]">
            Secure Your Trail Slot
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Pay a small token advance via any UPI app to confirm your booking and guide allocation.
          </p>
        </div>

        {/* Amount Selector Tabs */}
        {totalPrice > 500 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSelectedAdvance(defaultAdvance)}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                selectedAdvance === defaultAdvance
                  ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              20% Advance
              <span className="block text-[10px] font-normal opacity-90">₹{defaultAdvance}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAdvance(500)}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                selectedAdvance === 500
                  ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              Flat ₹500
              <span className="block text-[10px] font-normal opacity-90">Booking Lock</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAdvance(totalPrice)}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                selectedAdvance === totalPrice
                  ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              Full Amount
              <span className="block text-[10px] font-normal opacity-90">₹{totalPrice}</span>
            </button>
          </div>
        )}

        {/* QR Code Container */}
        <div className="bg-white rounded-2xl p-4 border border-[#EADBCE] text-center shadow-inner mb-4 flex flex-col items-center">
          <div className="relative p-2 bg-[#FAF6F0] rounded-xl border border-amber-300/40 shadow-sm">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt={`Scan to pay ₹${selectedAdvance} via UPI`}
                className="w-44 h-44 rounded-lg object-contain mx-auto"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-400">
                Generating QR...
              </div>
            )}
            <div className="absolute inset-x-0 -bottom-2.5 flex justify-center">
              <span className="px-3 py-0.5 rounded-full bg-[#11261D] text-amber-200 text-[10px] font-bold shadow border border-amber-400/40">
                ₹{selectedAdvance}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 mt-4">
            Scan with <strong>Google Pay, PhonePe, Paytm, BHIM, or Cred</strong>
          </p>

          {/* UPI ID Pill & Copy Button */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
            <span className="text-stone-500 font-medium">UPI ID:</span>
            <span className="font-mono font-bold text-stone-800">{upiId}</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="ml-1 text-[11px] text-[#C84B31] hover:text-[#9E321C] font-semibold underline"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Mobile Deep Link (Tap to Pay) */}
        <div className="sm:hidden mb-3">
          <a
            href={upiPayUrl}
            className="w-full py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-amber-100 font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow transition border border-emerald-500/30"
          >
            <span>📱</span>
            <span>Tap to Pay in UPI App (₹{selectedAdvance})</span>
          </a>
        </div>

        {/* WhatsApp Screenshot Submission Button */}
        <div className="space-y-2">
          <a
            href={whatsappScreenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition hover:scale-[1.02]"
          >
            <span>💬</span>
            <span>Sent! Share Screenshot on WhatsApp</span>
          </a>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 font-medium transition"
            >
              I will pay cash at Basecamp
            </button>
          )}
        </div>

        {/* Trust Note */}
        <p className="text-[10px] text-stone-500 text-center mt-3">
          🔒 Zero convenience fee • 100% refundable up to 48 hours before the expedition.
        </p>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
