import type { PhotoKey } from './photos';

/**
 * Weekly promotions. Changing the promo is a content edit here: swap the photos and a few lines,
 * and the home page section, the promotions list and a dedicated page for that promo all update.
 * Sample copy only: no discounts or dates are real until the store confirms them.
 */
export type PromoItem = { photo: PhotoKey; tag: string; title: string; copy: string };

export type Promo = {
  slug: string;
  season: 'fall' | 'holiday' | 'spring' | 'summer';
  status: 'current' | 'upcoming' | 'past';
  name: string;
  headline: string;
  dates: string;
  summary: string;
  body: string[];
  cover: PhotoKey;
  items: PromoItem[];
};

export const promos: Promo[] = [
  {
    slug: 'fall-harvest',
    season: 'fall',
    status: 'current',
    name: 'Fall Harvest',
    headline: 'Fall has landed on Main Street.',
    dates: 'Week of Oct 26',
    summary:
      'Pumpkins in every color, burgundy and rust florals, and cozy details for the table, the mantel and the front door.',
    body: [
      'The fall floor is up. Glazed ceramic pumpkins sit beside plaid ones and the black-and-white striped favorites, with leaf garlands, dried grasses and deep burgundy stems to tie it together.',
      'Not sure where to start? Bring a photo of your mantel, entry or table and we will help you pull a look together from what is on the floor this week.',
      'This page changes every week, so check back soon.',
    ],
    cover: 'promo1',
    items: [
      {
        photo: 'promo1',
        tag: 'Harvest color',
        title: 'Pumpkins, in every color',
        copy: 'Glazed ceramics, plaid and mustard, with burgundy stems to pull it all together.',
      },
      {
        photo: 'promo2',
        tag: 'Modern farmhouse',
        title: 'Stripes and leaf garland',
        copy: 'Black-and-white pumpkins and warm leaves for a crisp, graphic take on fall.',
      },
      {
        photo: 'promo3',
        tag: 'Set the table',
        title: 'A harvest console, styled',
        copy: 'Lamp, clock, grasses and mums. Bring a photo of your table and we will help you build the look.',
      },
    ],
  },
  {
    slug: 'holiday-table',
    season: 'holiday',
    status: 'upcoming',
    name: 'The Holiday Table',
    headline: 'Gnomes, greenery and snowflakes.',
    dates: 'Next week',
    summary: 'Felted gnomes, black reindeer, frosted trees and snowflake frames, set up against the Benjamin Moore wall.',
    body: [
      'The holiday table is the first thing you see in December: reindeer, gnomes, snowflake boxes and fresh-looking greenery in a quiet palette of black, white, red and sage.',
      'Photos are from last season while this year’s arrivals are unpacked. Stop in to see what is new.',
    ],
    cover: 'paintWall',
    items: [
      {
        photo: 'paintWall',
        tag: 'Coming soon',
        title: 'Reindeer, gnomes and snowflakes',
        copy: 'A quiet black, white, red and sage palette that sits well against any wall color.',
      },
    ],
  },
  {
    slug: 'spring-florals',
    season: 'spring',
    status: 'past',
    name: 'Spring Florals',
    headline: 'Blossoms, bunnies and fresh table settings.',
    dates: 'Spring 2026',
    summary: 'Pink ranunculus, moss nests and garden-fresh table pieces for the first warm days.',
    body: [
      'Spring is when the shelves turn soft: pink ranunculus, nests with speckled eggs, kale-green planters and little glass cloches.',
    ],
    cover: 'springTable',
    items: [
      {
        photo: 'springTable',
        tag: 'Spring',
        title: 'Florals and Easter décor',
        copy: 'Blossoms, bunnies and fresh table settings for the first warm days.',
      },
    ],
  },
  {
    slug: 'summer-crazy-days',
    season: 'summer',
    status: 'past',
    name: 'Crazy Days',
    headline: 'Cool, bright and full of deals.',
    dates: 'Summer 2026',
    summary: 'Blue-and-white everything, striped vases and a cool, air-conditioned place to shop.',
    body: [
      'Crazy Days brings the town to Main Street. Inside, the summer palette goes navy, white and a little red.',
    ],
    cover: 'navyStripe',
    items: [
      {
        photo: 'navyStripe',
        tag: 'Summer',
        title: 'Navy, white and a little red',
        copy: 'Striped vases, plaid accents and woven poufs for a cool, bright room.',
      },
    ],
  },
];

export const currentPromo = promos.find((p) => p.status === 'current')!;
