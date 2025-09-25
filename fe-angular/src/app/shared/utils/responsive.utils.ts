export const WidthMobile = 429;
export const WidthTablet = 769;

/**
 * Check mobile web
 * @returns boolean
 */
export function checkMobileWeb() {
  return window.innerWidth < WidthMobile;
}

/**
 * Check tablet web
 * @returns boolean
 */
export function checkTabletWeb() {
  return window.innerWidth < WidthTablet;
}
