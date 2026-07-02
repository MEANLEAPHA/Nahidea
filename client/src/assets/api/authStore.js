let currentToken = null;
let logoutHandler = null;
let redirectHandler = null;

export const authStore = {
  setToken(token) {
    currentToken = token;
  },
  getToken() {
    return currentToken;
  },
  registerLogoutHandler(fn) {
    logoutHandler = fn;
  },
  registerRedirectHandler(fn) {
    redirectHandler = fn;
  },
  triggerLogout() {
    logoutHandler?.();
  },
  triggerRedirectToLogin() {
    redirectHandler?.();
  },
};