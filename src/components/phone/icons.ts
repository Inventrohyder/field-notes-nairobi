/**
 * Our own rounded icons for the phone kit. Drawn for this site in a friendly style;
 * none is copied from Waze's artwork. Each is a 48 x 48 SVG fragment.
 */
const Y = '#F6C744';
const YD = '#3A3020';
const R = '#E5484D';
const B = '#3D8EF0';
const G = '#8A949B';
const O = '#F08A3C';

const tri = (fill = Y) =>
  `<path d="M24 7.5c1.3 0 2.4.7 3.1 1.8l14 24.6c1.4 2.4-.3 5.4-3.1 5.4H10c-2.8 0-4.5-3-3.1-5.4l14-24.6c.7-1.1 1.8-1.8 3.1-1.8z" fill="${fill}" stroke="${YD}" stroke-width="2.6" stroke-linejoin="round"/>`;
const bang = `<path d="M24 17v10" stroke="${YD}" stroke-width="3.4" stroke-linecap="round"/><circle cx="24" cy="32.5" r="2.1" fill="${YD}"/>`;
const xBadge = (cx = 35, cy = 13) =>
  `<circle cx="${cx}" cy="${cy}" r="7" fill="${R}" stroke="#fff" stroke-width="2"/><path d="M${cx - 2.6} ${cy - 2.6}l5.2 5.2M${cx + 2.6} ${cy - 2.6}l-5.2 5.2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
const car = (x: number, y: number, fill: string, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-6" width="18" height="10" rx="3.5" fill="${fill}" stroke="${YD}" stroke-width="2"/><path d="M-6 -6l2.5-5h7l2.5 5" fill="#CFE3F7" stroke="${YD}" stroke-width="2" stroke-linejoin="round"/><circle cx="-5" cy="4.5" r="2.4" fill="${YD}"/><circle cx="5" cy="4.5" r="2.4" fill="${YD}"/></g>`;
const cone = (x = 24, y = 24, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3.5 -14h7l7.5 24h-22z" fill="${O}" stroke="${YD}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-5.8 -6.5h11.6M-8.2 1.5h16.4" stroke="#fff" stroke-width="3"/><rect x="-14" y="10" width="28" height="4.5" rx="2" fill="${YD}"/></g>`;

export const ICONS: Record<string, string> = {
  traffic: `${car(16, 30, '#F59E5B', 0.9)}${car(32, 22, '#F2C14E', 0.9)}<path d="M8 40h32" stroke="${G}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 4"/>`,
  police: `<path d="M24 7l13 5v9c0 9-5.6 15.6-13 19-7.4-3.4-13-10-13-19v-9z" fill="#4F7FD9" stroke="${YD}" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 15.5l2.4 4.9 5.3.8-3.9 3.8.9 5.3-4.7-2.5-4.7 2.5.9-5.3-3.9-3.8 5.3-.8z" fill="#FFE07A"/>`,
  crash: `${car(17, 28, '#7CB7F0')}<g transform="rotate(-28 31 22)">${car(31, 22, '#F06E6E')}</g><path d="M24 9l1.6 4 4-1.2-2 3.6 3.4 2.3-4.1.5" fill="none" stroke="${YD}" stroke-width="2" stroke-linejoin="round"/>`,
  hazard: `${tri()}${bang}`,
  weather: `<path d="M14 29a7 7 0 0 1 1-13.9A10 10 0 0 1 34 17a6 6 0 0 1 0 12z" fill="#DCE6F0" stroke="${YD}" stroke-width="2.4" stroke-linejoin="round"/><path d="M17 34l-2 5M24 34l-2 5M31 34l-2 5" stroke="${B}" stroke-width="2.6" stroke-linecap="round"/>`,
  blocked: cone(24, 25, 0.95),
  mapissue: `<path d="M9 14l9-4 12 4 9-4v24l-9 4-12-4-9 4z" fill="#E9EEF2" stroke="${YD}" stroke-width="2.4" stroke-linejoin="round"/><path d="M18 10v24M30 14v24" stroke="${YD}" stroke-width="2"/><circle cx="35" cy="12" r="7" fill="${R}" stroke="#fff" stroke-width="2"/><path d="M35 8.6v4M35 15.2v.4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
  closure: `<rect x="8" y="16" width="32" height="10" rx="2.5" fill="#fff" stroke="${YD}" stroke-width="2.4"/><path d="M12 16l6 10M20 16l6 10M28 16l6 10" stroke="${R}" stroke-width="3.2"/><path d="M13 26v13M35 26v13" stroke="${YD}" stroke-width="2.6" stroke-linecap="round"/>`,
  construction: `${cone(17, 26, 0.8)}<rect x="24" y="15" width="17" height="7" rx="2" fill="#fff" stroke="${YD}" stroke-width="2"/><path d="M27 15l4 7M33 15l4 7" stroke="${O}" stroke-width="2.6"/><path d="M27 22v14M38 22v14" stroke="${YD}" stroke-width="2.2" stroke-linecap="round"/>`,
  shoulder: `<path d="M30 6v36" stroke="${G}" stroke-width="2.5" stroke-dasharray="4 4"/>${car(19, 26, '#F2C14E')}<path d="M37 18l3 6h-6z" fill="${Y}" stroke="${YD}" stroke-width="1.6" stroke-linejoin="round"/>`,
  light: `<rect x="17" y="6" width="14" height="32" rx="6" fill="#4A5258" stroke="${YD}" stroke-width="2.2"/><circle cx="24" cy="13.5" r="3.6" fill="${R}"/><circle cx="24" cy="22" r="3.6" fill="#F6C744"/><circle cx="24" cy="30.5" r="3.6" fill="#55C27A"/><path d="M24 38v5" stroke="${YD}" stroke-width="2.6"/>${xBadge(36, 12)}`,
  pothole: `<ellipse cx="24" cy="31" rx="15" ry="6.5" fill="#3A3F44" stroke="${YD}" stroke-width="2"/><path d="M12 31c4-3 9-2 12-4s8-1 12 1" fill="none" stroke="#6C747A" stroke-width="2"/><path d="M24 10v9" stroke="${YD}" stroke-width="3" stroke-linecap="round"/><path d="M19.5 15l4.5 5 4.5-5" fill="none" stroke="${YD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  object: `<path d="M12 20l12-6 12 6v13l-12 6-12-6z" fill="#E2B27A" stroke="${YD}" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 20l12 6 12-6M24 26v13" fill="none" stroke="${YD}" stroke-width="2.2" stroke-linejoin="round"/>`,
  general: `${tri()}${bang}`,
  turnnot: `<path d="M30 40V24c0-4-3-7-7-7H12" fill="none" stroke="#8A949B" stroke-width="5" stroke-linecap="round"/><path d="M17 11l-6 6 6 6" fill="none" stroke="#8A949B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>${xBadge(35, 12)}`,
  junction: `${tri()}${bang}`,
  address: `<path d="M10 23l14-12 14 12v15H10z" fill="#F4E1C8" stroke="${YD}" stroke-width="2.4" stroke-linejoin="round"/><rect x="20" y="28" width="8" height="10" fill="${R}" opacity=".85"/><path d="M8 24l16-14 16 14" fill="none" stroke="${R}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${xBadge(36, 11)}`,
  bridge: `${tri()}${bang}`,
  directions: `<path d="M24 8c7 0 12 5 12 11.5C36 28 24 40 24 40S12 28 12 19.5C12 13 17 8 24 8z" fill="#7FB8EE" stroke="${YD}" stroke-width="2.4"/><circle cx="24" cy="19" r="4.5" fill="#fff"/>${xBadge(36, 12)}`,
  exit: `${tri()}${bang}`,
  road: `<rect x="15" y="6" width="18" height="36" rx="3" fill="#9AA3A9" stroke="${YD}" stroke-width="2.2"/><path d="M24 10v6M24 21v6M24 32v6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`,
  report: `<path d="M24 8.5c1.2 0 2.3.6 2.9 1.7l13.3 23.4c1.3 2.3-.3 5.1-2.9 5.1H10.7c-2.6 0-4.2-2.8-2.9-5.1l13.3-23.4c.6-1.1 1.7-1.7 2.9-1.7z" fill="none" stroke="#1D1D1B" stroke-width="3.2" stroke-linejoin="round"/><path d="M24 19v12M18 25h12" stroke="#1D1D1B" stroke-width="3.4" stroke-linecap="round"/>`,
  assistant: `<rect x="9" y="19" width="5" height="10" rx="2.5" fill="currentColor"/><rect x="17.5" y="12" width="5" height="24" rx="2.5" fill="currentColor"/><rect x="26" y="15" width="5" height="18" rx="2.5" fill="currentColor"/><rect x="34.5" y="20" width="5" height="8" rx="2.5" fill="currentColor"/>`,
};

export function icon(name: string, size = 30): string {
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;
}
