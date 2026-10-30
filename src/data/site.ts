export const site = {
  name: 'Marshall Decorating Center',
  street: '440 W Main St',
  cityLine: 'Marshall, MN 56258',
  address: '440 W Main St, Marshall, MN 56258',
  phoneDisplay: '(507) 532-4666',
  phoneHref: 'tel:+15075324666',
  directionsHref:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('440 W Main St, Marshall, MN 56258'),
  facebookHref: 'https://www.facebook.com/marshalldecorating',
  founded: 1972,
  timezone: 'America/Chicago',
  hoursNote: 'Hours as listed by Benjamin Moore. Holiday hours may vary, so please call to confirm.',
  parking: 'Parking in the front and back lots.',
} as const;

/** Day numbers follow Date#getDay: 0 is Sunday. Minutes are counted from midnight. */
export type HoursRow = {
  label: string;
  days: number[];
  open?: string;
  close?: string;
  openMin?: number;
  closeMin?: number;
};

export const hours: HoursRow[] = [
  { label: 'Monday – Friday', days: [1, 2, 3, 4, 5], open: '8:00 AM', close: '5:30 PM', openMin: 8 * 60, closeMin: 17 * 60 + 30 },
  { label: 'Saturday', days: [6], open: '9:00 AM', close: '1:00 PM', openMin: 9 * 60, closeMin: 13 * 60 },
  { label: 'Sunday', days: [0] },
];

/**
 * Main navigation. Order is the order shown. The promotion pages are deliberately not listed here:
 * they exist for search, and are linked from the home page promo section instead.
 */
export const nav = [
  { href: '/shop/', label: 'Shop' },
  { href: '/paint/', label: 'Paint' },
  { href: '/flooring/', label: 'Flooring' },
  { href: '/window-treatments/', label: 'Windows' },
  { href: '/home-decor/', label: 'Décor' },
  { href: '/about/', label: 'About' },
] as const;
