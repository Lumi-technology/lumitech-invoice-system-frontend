// userType.js — manages user experience mode (stored in localStorage)

export const USER_TYPES = {
  BUSINESS_OWNER: "business_owner",
  ACCOUNTANT:     "accountant",
};

// Current display mode — can be toggled by accountant-registered users
export function getUserType() {
  return localStorage.getItem("userType") || USER_TYPES.BUSINESS_OWNER;
}

export function setUserType(type) {
  localStorage.setItem("userType", type);
  window.dispatchEvent(new Event("userTypeChange"));
}

// Registration role — immutable after signup, determines if mode toggle is allowed
export function getRegisteredAs() {
  return localStorage.getItem("registeredAs") || USER_TYPES.BUSINESS_OWNER;
}

export function setRegisteredAs(type) {
  localStorage.setItem("registeredAs", type);
}

export function isBusinessOwner() {
  return getUserType() === USER_TYPES.BUSINESS_OWNER;
}

export function isAccountant() {
  return getUserType() === USER_TYPES.ACCOUNTANT;
}

// Returns terminology labels based on user type
export function capitalLabel(key) {
  const bo = getUserType() === USER_TYPES.BUSINESS_OWNER;
  const labels = {
    injected:   bo ? "You Put In"         : "Capital Injected",
    recovered:  bo ? "You've Gotten Back" : "Capital Recovered",
    outstanding: bo ? "Business Owes You" : "Outstanding Capital",
    fund:       bo ? "Record Capital"     : "Capital Injection",
    context:    bo ? "Your Business Overview" : "Client Portfolio Overview",
  };
  return labels[key] ?? key;
}

// Returns payment/collections label based on user type
export function paymentLabel(key) {
  const bo = getUserType() === USER_TYPES.BUSINESS_OWNER;
  const labels = {
    module:       bo ? "Collections"          : "Payments",
    record:       bo ? "Record Collection"    : "Record Payment",
    recorded:     bo ? "Collection recorded"  : "Payment recorded",
    submit:       bo ? "Submit Collection"    : "Submit Payment",
    capitalSplit: bo ? "Part of this is capital recovery" : "Allocate capital recovery",
    revenuePart:  bo ? "Revenue"              : "Revenue",
    capitalPart:  bo ? "Capital Recovery"     : "Capital Recovery",
  };
  return labels[key] ?? key;
}
