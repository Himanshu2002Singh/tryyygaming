// Simple UPI logo helper
export const getUpiLogo = (bankName) => {
  if (!bankName) return null;

  const name = bankName.toLowerCase();

  if (name.includes("paytm")) {
    return "/gatewaylogo/paytm.png";
  } else if (name.includes("phonepe") || name.includes("phone pe")) {
    return "/gatewaylogo/phonepe-logo.png";
  } else if (name.includes("bharatpe") || name.includes("bharat pe")) {
    return "/gatewaylogo/bharatpe.png";
  } else if (
    name.includes("googlepay") ||
    name.includes("google pay") ||
    name.includes("gpay")
  ) {
    return "/gatewaylogo/upi/gpay-logo.png";
  }
  //  else {
  //   // Default UPI icon if no match
  //   return "/gatewaylogo/upi/default-upi.png";
  // }
};
