// utils/whatsapp.js - Free 1-Click WhatsApp Communication Utility

/**
 * Normalizes phone number into international format without symbols
 * Example: "+91 98765 43210" -> "919876543210"
 * Example: "9876543210" -> "919876543210"
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned; // Default Indian country code if 10 digits
  }
  return cleaned;
};

/**
 * Returns owner/admin WhatsApp number configured in .env or default fallback
 */
export const getOwnerWhatsAppNumber = () => {
  const envNumber = import.meta.env.VITE_OWNER_WHATSAPP;
  return cleanPhoneNumber(envNumber || '919876543210');
};

/**
 * Generates WhatsApp click-to-chat URL for Customer -> Owner
 * Customer sends booking summary directly to owner's WhatsApp
 */
export const generateOwnerWhatsAppUrl = (booking) => {
  const ownerNumber = getOwnerWhatsAppNumber();
  const text = 
`🏕️ *New Adventure Booking - 36 Montane*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${booking.name || 'Explorer'}
📧 *Email:* ${booking.email || 'N/A'}
📱 *Phone:* ${booking.phone || 'N/A'}
🏔️ *Adventure:* ${booking.serviceName || booking.tripTitle || 'Outdoor Trip'}
👥 *Group Size:* ${booking.numberOfPeople || 1} Person(s)
📅 *Travel Date:* ${booking.travelDate || booking.date || 'TBD'}
💰 *Total Amount:* ₹${booking.totalPrice || 0}
━━━━━━━━━━━━━━━━━━━━
Hello 36 Montane! I just placed this booking on your website. Please confirm availability and share UPI details if a token advance is required!`;

  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(text)}`;
};

/**
 * Generates WhatsApp click-to-chat URL for Owner -> Customer
 * Owner clicks in Admin Dashboard to send instant confirmation to customer
 */
export const generateCustomerWhatsAppUrl = (booking) => {
  const customerPhone = cleanPhoneNumber(booking.phone);
  if (!customerPhone) return null;

  const text =
`Hello ${booking.name || 'there'}! 👋
This is *36 Montane Adventures*. 🏔️⛺

We have received and *CONFIRMED* your booking for:
🌲 *${booking.serviceName || booking.tripTitle || 'Adventure Trek'}*
👥 Group: ${booking.numberOfPeople || 1} Person(s)
📅 Date: ${booking.travelDate || (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'Upcoming')}
${booking.totalPrice ? `💰 Total: ₹${booking.totalPrice}` : ''}

🎒 *Trip Next Steps:*
1. Reply here with your pickup location and any dietary preferences.
2. If you'd like to pay the token advance via UPI or need our packing checklist, let us know!

Our team is excited to host your expedition in Chhattisgarh!`;

  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Generates WhatsApp click-to-chat URL for Owner -> Inquirer (Contact Form)
 */
export const generateContactReplyWhatsAppUrl = (contact) => {
  const customerPhone = cleanPhoneNumber(contact.phone);
  if (!customerPhone) return null;

  const text =
`Hello ${contact.name}! 👋
This is *36 Montane Adventures*.

Thank you for reaching out to us regarding:
"${contact.message?.slice(0, 100)}${contact.message?.length > 100 ? '...' : ''}"

How can we assist you with your upcoming trekking or camping journey? 🏔️⛺`;

  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Returns UPI ID configured in .env or fallback
 */
export const getUpiId = () => {
  return import.meta.env.VITE_UPI_ID || '36montane@upi';
};

/**
 * Generates WhatsApp click-to-chat URL when customer completes token advance
 */
export const generatePaymentConfirmationWhatsAppUrl = (booking, advanceAmount) => {
  const ownerNumber = getOwnerWhatsAppNumber();
  const text = 
`🙏 *जय जोहार! Token Advance Payment Screenshot*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${booking.name || 'Explorer'}
📱 *Phone:* ${booking.phone || 'N/A'}
🌲 *Expedition:* ${booking.serviceName || booking.tripTitle || 'Adventure Trek'}
📅 *Date:* ${booking.travelDate || booking.date || 'TBD'}
👥 *Group Size:* ${booking.groupDisplay || `${booking.numberOfPeople || 1} Persons`}
💵 *Advance Paid:* ₹${advanceAmount}
💰 *Total Fare:* ₹${booking.totalPrice || 0}
━━━━━━━━━━━━━━━━━━━━
I have initiated the UPI token advance for my slot. Attached is the payment confirmation screenshot!`;

  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(text)}`;
};

