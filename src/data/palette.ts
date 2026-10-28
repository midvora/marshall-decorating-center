export type Swatch = { id: string; name: string; hex: string };

/** Original, locally flavored color names. Not Benjamin Moore colors. */
export const walls: Swatch[] = [
  { id: 'linen', name: 'Prairie Linen', hex: '#EADFCB' },
  { id: 'sage', name: 'Cottonwood Sage', hex: '#A8B5A0' },
  { id: 'sky', name: 'Big Sky Blue', hex: '#9DB7C6' },
  { id: 'wheat', name: 'Harvest Wheat', hex: '#DDB968' },
  { id: 'clay', name: 'Camden Clay', hex: '#C58468' },
  { id: 'slate', name: 'Lyon Slate', hex: '#46575A' },
];

export type Floor = { id: string; name: string; kind: 'plank' | 'chevron' | 'tile'; base: string; tones: string[] };

export const floors: Floor[] = [
  { id: 'oak', name: 'Honey Oak', kind: 'plank', base: '#C99A5E', tones: ['#C99A5E', '#BE8E52', '#D3A56B', '#C4975A'] },
  { id: 'walnut', name: 'Smoked Walnut', kind: 'plank', base: '#6A4631', tones: ['#6A4631', '#5E3E2B', '#74503A', '#654330'] },
  { id: 'chevron', name: 'Pale Chevron', kind: 'chevron', base: '#D8C4A0', tones: ['#D8C4A0', '#CDB68E'] },
  { id: 'stone', name: 'Quarry Stone', kind: 'tile', base: '#B9B5AB', tones: ['#BDB9AF', '#B1ADA3', '#C3BFB5', '#B6B2A8'] },
];

export const textiles: Swatch[] = [
  { id: 'oat', name: 'Oat', hex: '#D9CBB0' },
  { id: 'moss', name: 'Moss', hex: '#6F7F55' },
  { id: 'rust', name: 'Rust', hex: '#B25A3C' },
  { id: 'indigo', name: 'Indigo', hex: '#2F4A6B' },
];

export const defaults = { wall: 'linen', floor: 'oak', textile: 'rust' } as const;

/* Project starter (client side only, nothing is sent anywhere) */
export const starter = {
  rooms: [
    { id: 'living', label: 'Living room', bring: ['A daytime photo of the room', 'A sample of your sofa or rug fabric'] },
    { id: 'kitchen', label: 'Kitchen & dining', bring: ['A photo of cabinets and counters', 'A tile or counter sample if you have one'] },
    { id: 'bedroom', label: 'Bedroom', bring: ['Bedding or a favorite fabric', 'A photo with the bed in frame'] },
    { id: 'bath', label: 'Bath', bring: ['A tile or vanity sample', 'Rough measurements of the walls'] },
    { id: 'work', label: 'Office or storefront', bring: ['Measurements or a simple floor plan', 'Brand colors, if you have them'] },
  ],
  moods: [
    { id: 'calm', label: 'Calm', palette: ['sage', 'linen', 'slate'], line: 'Soft, quiet colors that let the room breathe.' },
    { id: 'cozy', label: 'Cozy', palette: ['clay', 'wheat', 'linen'], line: 'Warm tones that make a room feel lived in.' },
    { id: 'fresh', label: 'Fresh', palette: ['sky', 'linen', 'sage'], line: 'Light, open colors with a clean finish.' },
    { id: 'bold', label: 'Bold', palette: ['slate', 'clay', 'wheat'], line: 'Deep color with a few bright moments.' },
  ],
  lights: [
    { id: 'sun', label: 'Lots of sun', ask: 'Ask how each color looks at noon and again at dusk.' },
    { id: 'soft', label: 'Soft and gray', ask: 'Ask which undertones stay warm on a cloudy day.' },
    { id: 'low', label: 'Not much at all', ask: 'Ask how lamps and bulbs change the way a color reads.' },
  ],
};
