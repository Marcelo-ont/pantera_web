---
name: Stadium Analytics
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444650'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#757781'
  outline-variant: '#c5c6d1'
  surface-tint: '#465c97'
  primary: '#112b63'
  on-primary: '#ffffff'
  primary-container: '#2b427b'
  on-primary-container: '#9ab0f1'
  inverse-primary: '#b2c5ff'
  secondary: '#b8201b'
  on-secondary: '#ffffff'
  secondary-container: '#ff5446'
  on-secondary-container: '#5c0002'
  tertiary: '#332e1d'
  on-tertiary: '#ffffff'
  tertiary-container: '#4a4432'
  on-tertiary-container: '#bab19a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#2d447d'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930007'
  tertiary-fixed: '#ece2c9'
  tertiary-fixed-dim: '#cfc6ae'
  on-tertiary-fixed: '#201b0c'
  on-tertiary-fixed-variant: '#4c4634'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-display:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stat-value:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin: 24px
  container-max: 1440px
---

## Brand & Style
The brand personality is authoritative, high-energy, and precision-driven, mirroring the intensity of a live football match. It targets professional analysts, dedicated fans, and sports betting enthusiasts who require rapid data visualization without sacrificing visual impact.

The design style is **Corporate / Modern** with a **High-Contrast** edge. It utilizes the sophisticated navy and cream palette of the mascot to create a "Premium Varsity" aesthetic. The UI is structured and grid-heavy to handle dense statistical data, while using bold, condensed typography and sharp accents to maintain an athletic, competitive spirit. The emotional goal is to feel like a high-end broadcast graphics package—dynamic, reliable, and professional.

## Colors
This design system uses a palette derived directly from the mascot's varsity jacket and football.
- **Primary (Navy):** Used for headers, primary navigation, and key statistical containers. It provides a stable, professional foundation.
- **Secondary (Stadium Red):** Extracted from the football accents. Used sparingly for critical alerts, live indicators, and high-priority "Call to Action" buttons.
- **Tertiary (Cream/Beige):** Used as an alternative surface color to white, providing a sophisticated, slightly retro-sport feel for card backgrounds and secondary sections.
- **Neutral:** A deep carbon black for primary text and a cool light grey for borders and disabled states. 

The color mode is primarily light to ensure maximum legibility of dense data tables, but utilizes the primary navy for "deep" UI sections like sidebars.

## Typography
The typography is designed to mimic the high-impact legibility of scoreboard displays and sports jerseys.
- **Headlines (Anton):** A bold, condensed sans-serif used for major page titles and key statistics. It captures the "Athletic" requirement through its verticality and strength.
- **Body & Data (Archivo Narrow):** A clean, condensed grotesque font that allows for high information density in tables and player bios without feeling cramped.
- **Labels & Mono (JetBrains Mono):** Used for technical metadata, timestamps, and secondary labels to provide a "technical/precision" layer to the dashboard.

## Layout & Spacing
The layout uses a **Fluid 12-column grid** optimized for dashboard modules. 
- **Desktop:** 12 columns with 24px margins. Statistical cards typically span 3, 4, or 6 columns.
- **Tablet:** 8 columns with 16px margins.
- **Mobile:** 4 columns with 16px margins. 

The spacing rhythm follows an 8px base unit. Data density is high; therefore, padding inside data tables is reduced to 12px (vertical) to maximize content visibility. Visual hierarchy is maintained through heavy use of vertical "sections" separated by subtle cream-colored dividers or navy headers.

## Elevation & Depth
This design system avoids soft shadows to maintain its "Modern Athletic" aesthetic. Instead, it utilizes **Tonal Layers** and **Hard Outlines**:
- **Level 0 (Background):** Pure white or very light cream.
- **Level 1 (Cards):** Flat surfaces with a 1px solid border (#D1D5DB).
- **Level 2 (Active/Hover):** A "stamped" effect using a 2px-4px solid offset shadow in the primary navy color, rather than a blur.
- **Level 3 (Modals):** High-contrast navy backgrounds with white text to create an immediate focal shift.

## Shapes
Shapes are disciplined and sharp. A **Soft (0.25rem)** radius is used for most UI components (buttons, input fields) to maintain a modern feel without becoming too "friendly" or organic. 
- Large containers and dashboard cards use the standard `rounded` (0.25rem).
- Interactive indicators (like "Live" pips) may use a full circle/pill shape.
- Stat bars and progress indicators use square ends to reinforce the precision-data aesthetic.

## Components
- **Buttons:** Primary buttons are solid Navy (#2B427B) with white text in Anton (All Caps). Secondary buttons use a thick Navy border with a Cream background. Hover states should trigger the "stamped" hard-shadow effect.
- **Data Tables:** Headers are Navy with White text. Alternating row stripes use the Cream color (#F2E8CF) at 30% opacity for better scanning.
- **Score Chips:** Small, high-contrast badges with the team's primary color as a background and bold, white typography for the score.
- **Stat Cards:** Feature a "Headline-Display" size number for the primary metric (e.g., Possession %), with a JetBrains Mono label below it.
- **Input Fields:** Thick 2px borders that turn Navy when focused. No drop shadows.
- **Progress Bars:** Use a "Segmented" style (like a stadium light bar) rather than a smooth continuous fill.