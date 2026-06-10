/** Shared measurements for the unified bottom dock (action bar + nav pill). */
export const BOTTOM_NAV_HEIGHT = '3rem';
export const PAGE_ACTION_BAR_HEIGHT = '5.5rem';

export const ROUTES_WITH_ACTION_BAR = ['/order', '/gift-cards'];
export const ROUTES_WITH_PAGE_PADDING = ['/', '/menu'];
export const ROUTES_FULLSCREEN_EMBED = [];

export function getPageBottomPadding(pathname, hideNav) {
  if (hideNav || pathname.startsWith('/admin')) return '';
  if (ROUTES_FULLSCREEN_EMBED.includes(pathname)) return '';
  if (ROUTES_WITH_PAGE_PADDING.includes(pathname)) return '';
  if (ROUTES_WITH_ACTION_BAR.includes(pathname)) return 'pb-page-dock';
  return 'pb-page-nav';
}

export function isFullscreenEmbedRoute(pathname) {
  return ROUTES_FULLSCREEN_EMBED.includes(pathname);
}
