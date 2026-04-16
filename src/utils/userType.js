// userType.js — manages user experience mode (stored in localStorage)

export const USER_TYPES = {
  BUSINESS_OWNER: "business_owner",
  ACCOUNTANT:     "accountant",
};

export function getUserType() {
  return localStorage.getItem("userType") || USER_TYPES.BUSINESS_OWNER;
}

export function setUserType(type) {
  localStorage.setItem("userType", type);
  // Dispatch event so components can react without a full reload
  window.dispatchEvent(new Event("userTypeChange"));
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
