import type { ImageMetadata } from 'astro';

import storefront from '../assets/photos/storefront.webp';
import showroomWide from '../assets/photos/showroom-wide.webp';
import wallpaperBar from '../assets/photos/wallpaper-bar.webp';
import owners from '../assets/photos/owners.jpg';
import paintWall from '../assets/photos/paint-wall.jpg';
import floorHardwood from '../assets/photos/floor-hardwood.jpg';
import floorAcacia from '../assets/photos/floor-acacia.jpg';
import floorOak from '../assets/photos/floor-oak.jpg';
import wallpaperBlue from '../assets/photos/wallpaper-blue.jpg';
import artWall from '../assets/photos/art-wall.jpg';
import seatingHeron from '../assets/photos/seating-heron.jpg';
import navyStripe from '../assets/photos/navy-stripe.jpg';
import greenChest from '../assets/photos/green-wallpaper-chest.jpg';
import caneCabinet from '../assets/photos/cane-cabinet.jpg';
import springTable from '../assets/photos/spring-table.jpg';
import fallWide from '../assets/photos/fall-wide.jpg';
import promo1 from '../assets/photos/promo-1.jpg';
import promo2 from '../assets/photos/promo-2.jpg';
import promo3 from '../assets/photos/promo-3.jpg';
import windowSheersDrapes from '../assets/photos/window-sheers-drapes.jpg';
import windowNavyDrapes from '../assets/photos/window-navy-drapes.jpg';
import windowSheers from '../assets/photos/window-sheers.jpg';

/**
 * Every photo on the site, in one place, so swapping a picture later is a one-line change.
 * `pos` is the default object-position when the photo is cropped. `stock` marks free-license
 * stand-ins (they show a small "Sample photo" tag) that should be replaced with the store's own.
 */
export type Photo = {
  src: ImageMetadata;
  alt: string;
  pos?: string;
  stock?: boolean;
  /** Where the picture came from. Shown as a small link under the photo (see PhotoCredit). */
  credit?: { label: string; href: string };
};

export const photos = {
  storefront: {
    src: storefront,
    alt: 'The Marshall Decorating Center storefront on West Main Street, under its blue awning',
    pos: '32% 50%',
  },
  showroomWide: {
    src: showroomWide,
    alt: 'Inside the showroom: a buffalo-check wall, a painted chest, accent chairs and open shelving',
    pos: '40% 50%',
  },
  wallpaperBar: {
    src: wallpaperBar,
    alt: 'The wallpaper counter with rolls on a rack, framed blue plaid accents and striped vases on brass shelves',
    pos: '60% 50%',
  },
  owners: {
    src: owners,
    alt: 'Two smiling people in front of the Benjamin Moore color wall in the store',
    pos: '50% 30%',
    credit: {
      label: 'Marshall Independent',
      href: 'https://www.marshallindependent.com/news/local-news/2024/10/bucket-of-paint-goes-a-long-ways-on-a-budget/',
    },
  },
  paintWall: {
    src: paintWall,
    alt: 'The Benjamin Moore color wall, floor to ceiling, behind a holiday display table',
    pos: '50% 35%',
  },
  floorHardwood: {
    src: floorHardwood,
    alt: 'A wide-plank hardwood floor in the showroom with a styled sitting area and the paint wall behind',
    pos: '50% 60%',
  },
  floorAcacia: {
    src: floorAcacia,
    alt: 'A stack of vinyl plank flooring in a warm, swirling acacia wood grain',
    pos: '50% 50%',
  },
  floorOak: {
    src: floorOak,
    alt: 'A stack of vinyl plank flooring in a weathered, gray-brown oak wood grain',
    pos: '50% 50%',
  },
  wallpaperBlue: {
    src: wallpaperBlue,
    alt: 'A blue and white botanical wallpaper wall with brass lamps, blue-and-white vases and pink blossoms',
    pos: '50% 40%',
  },
  artWall: {
    src: artWall,
    alt: 'Four framed landscape paintings hung on a charcoal wall',
    pos: '50% 45%',
  },
  seatingHeron: {
    src: seatingHeron,
    alt: 'Two tufted armchairs and an upholstered bench in front of a framed heron painting and a brass lamp',
    pos: '50% 40%',
  },
  navyStripe: {
    src: navyStripe,
    alt: 'A navy-and-white striped wall with a carved mirror, blue plaid accents and woven jute poufs',
    pos: '50% 40%',
  },
  greenChest: {
    src: greenChest,
    alt: 'A carved wood chest of drawers under a lamp against green botanical wallpaper',
    pos: '50% 40%',
  },
  caneCabinet: {
    src: caneCabinet,
    alt: 'A cane-front wood cabinet with framed botanical prints, beside a gray sofa and ottoman',
    pos: '50% 40%',
  },
  springTable: {
    src: springTable,
    alt: 'A spring display of pink ranunculus, nests and a framed photo on a wooden table',
    pos: '50% 35%',
  },
  fallWide: {
    src: fallWide,
    alt: 'A fall display in the store with pumpkins, orange mums and a Give Thanks sign on brass shelves',
    pos: '40% 50%',
  },
  promo1: {
    src: promo1,
    alt: 'Colorful ceramic pumpkins and a ceramic jug with burgundy stems on a green table runner',
    pos: '50% 60%',
  },
  promo2: {
    src: promo2,
    alt: 'Black-and-white striped pumpkins and autumn leaves on a brass and wood shelf',
    pos: '50% 50%',
  },
  promo3: {
    src: promo3,
    alt: 'A harvest console table with striped pumpkins, a clock, dried grasses and orange mums',
    pos: '50% 50%',
  },
  windowSheersDrapes: {
    src: windowSheersDrapes,
    alt: 'Sheer white curtains and tan drapes filtering morning light in a bedroom',
    pos: '45% 50%',
    stock: true,
  },
  windowNavyDrapes: {
    src: windowNavyDrapes,
    alt: 'Floor-length dark drapes beside a bright bedroom window',
    pos: '30% 40%',
    stock: true,
  },
  windowSheers: {
    src: windowSheers,
    alt: 'Soft sheer curtains beside a window',
    pos: '50% 40%',
    stock: true,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
