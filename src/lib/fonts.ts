// app/fonts.ts (or lib/fonts.ts)
import { Racing_Sans_One, Lexend, Oswald} from 'next/font/google';

export const racingSansOne = Racing_Sans_One({
  weight: '400',  // Racing Sans One typically only has one weight
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-racing-sans-one',
});


export const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
});