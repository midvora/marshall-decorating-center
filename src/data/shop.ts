import type { PhotoKey } from './photos';

/**
 * The "Shop the store" catalog: a middle step between a landing page and a full online store.
 * Visitors browse real photos, build a list, and send it to the store as a quote or pickup request.
 * Items are departments and displays, not SKUs, and there are no prices: the store sets those.
 */
export const departments = [
  { id: 'all', label: 'Everything' },
  { id: 'paint', label: 'Paint & wallpaper' },
  { id: 'flooring', label: 'Flooring' },
  { id: 'windows', label: 'Window treatments' },
  { id: 'decor', label: 'Décor & furniture' },
  { id: 'seasonal', label: 'Seasonal' },
] as const;

export type DeptId = (typeof departments)[number]['id'];

export type ShopItem = {
  id: string;
  name: string;
  dept: Exclude<DeptId, 'all'>;
  photo: PhotoKey;
  line: string;
  tag: string;
  href: string;
  /** Optional object-position to frame the photo inside the card. */
  pos?: string;
};

export const shopItems: ShopItem[] = [
  {
    id: 'bm-paint',
    name: 'Benjamin Moore paint & stain',
    dept: 'paint',
    photo: 'paintWall',
    line: 'Interior, exterior and trim lines, mixed in store in a very wide range of colors.',
    tag: 'Mixed in store',
    href: '/paint/',
  },
  {
    id: 'wallpaper-rolls',
    name: 'Wallpaper books & rolls',
    dept: 'paint',
    photo: 'wallpaperBar',
    line: 'Browse the books and the rack of rolls at the wallpaper counter.',
    tag: 'Ask for samples',
    href: '/paint/#wallpaper',
  },
  {
    id: 'botanical-wallpaper',
    name: 'Botanical wallpaper',
    dept: 'paint',
    photo: 'wallpaperBlue',
    line: 'Blue-and-white pattern for the wall that deserves a little drama.',
    tag: 'On display',
    href: '/paint/#wallpaper',
  },
  {
    id: 'vinyl-plank',
    name: 'Vinyl plank & tile',
    dept: 'flooring',
    photo: 'floorAcacia',
    line: 'Warm acacias and weathered oaks, stacked and ready to look at.',
    tag: 'In the store',
    href: '/flooring/',
  },
  {
    id: 'hardwood',
    name: 'Wide-plank hardwood',
    dept: 'flooring',
    photo: 'floorHardwood',
    line: 'See it underfoot in the showroom, styled the way it might look at home.',
    tag: 'On display',
    href: '/flooring/',
  },
  {
    id: 'sheers',
    name: 'Sheers & light filtering',
    dept: 'windows',
    photo: 'windowSheersDrapes',
    line: 'Soften the daylight and keep the view.',
    tag: 'Sample photo',
    href: '/window-treatments/',
  },
  {
    id: 'drapes',
    name: 'Room-darkening drapes',
    dept: 'windows',
    photo: 'windowNavyDrapes',
    line: 'Full-length drapery for privacy, sleep and a finished look.',
    tag: 'Sample photo',
    href: '/window-treatments/',
  },
  {
    id: 'accent-chairs',
    name: 'Accent chairs & benches',
    dept: 'decor',
    photo: 'seatingHeron',
    line: 'Tufted chairs and an upholstered bench to anchor a corner.',
    tag: 'In the store',
    href: '/home-decor/',
  },
  {
    id: 'chests',
    name: 'Chests & cabinets',
    dept: 'decor',
    photo: 'greenChest',
    line: 'Carved and cane-front pieces that bring storage and character.',
    tag: 'In the store',
    href: '/home-decor/',
  },
  {
    id: 'art',
    name: 'Framed art',
    dept: 'decor',
    photo: 'artWall',
    line: 'Landscapes in wood, white and gold frames, ready to hang.',
    tag: 'In the store',
    href: '/home-decor/',
  },
  {
    id: 'blue-white',
    name: 'Blue & white accents',
    dept: 'decor',
    photo: 'navyStripe',
    line: 'Striped vases, plaid frames, a carved mirror and woven poufs.',
    tag: 'In the store',
    href: '/home-decor/#gifts',
  },
  {
    id: 'fall-pumpkins',
    name: 'Fall pumpkins & florals',
    dept: 'seasonal',
    photo: 'promo1',
    line: 'Glazed, plaid and striped pumpkins with burgundy stems.',
    tag: 'This week',
    href: '/promotions/fall-harvest/',
  },
  {
    id: 'harvest-table',
    name: 'Harvest table styling',
    dept: 'seasonal',
    photo: 'promo3',
    line: 'Grasses, mums, a clock and a lamp: the whole console, styled.',
    tag: 'This week',
    href: '/promotions/fall-harvest/',
  },
  {
    id: 'spring-florals',
    name: 'Spring florals',
    dept: 'seasonal',
    photo: 'springTable',
    line: 'Ranunculus, nests and glass cloches for the first warm days.',
    tag: 'Seasonal',
    href: '/promotions/spring-florals/',
  },
];
