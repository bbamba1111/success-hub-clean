import type { Config } from "tailwindcss"

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Visual Design System™ (Phase 5.4.2) — three families only:
        //   sans  (body / UI / labels / nav)          → Montserrat
        //   display (H1: hero + primary page titles)   → Playfair Display
        //   serif  (editorial quotes / affirmations)   → Playfair Display
        // Lora has been fully removed; `serif`/`lora` now resolve to Playfair so
        // any remaining editorial-italic usage stays elegant and on-system.
        sans: ['var(--font-montserrat)', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        lora: ['var(--font-playfair)', 'Georgia', 'serif'],
        // Legacy fonts — retained for marketing/landing until the page-migration pass.
        poppins: ['var(--font-poppins)', 'sans-serif'],
        'great-vibes': ['var(--font-great-vibes)', 'cursive'],
      },
      colors: {
        // Brand palette — the single source of truth for on-brand color.
        // Use `brand-*` utilities (e.g. text-brand-green, bg-brand-blush) in
        // place of scattered inline hex values.
        brand: {
          green: "#5D9D61",
          "green-dark": "#4A7D4E",
          "green-soft": "#8AC28E",
          coral: "#E26C73",
          "coral-dark": "#C9545B",
          blush: "#F6E4E7",
          // Visual Design System™ (Phase 5.4.2): near-black text for readability.
          // ink = primary body/headings, ink-soft = secondary (still high-contrast).
          ink: "#1A1A1A",
          "ink-soft": "#3A3A3A",
          // "cream" is now WHITE — the platform canvas is white everywhere.
          // Kept as a token so existing bg-brand-cream markup stays valid.
          cream: "#FFFFFF",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      // Harmony Lane™ shape hierarchy: forms → buttons → cards → panels → hero.
      borderRadius: {
        lg: "var(--radius)" /* 10px — standard cards */,
        md: "calc(var(--radius) - 2px)" /* 8px — buttons / inputs */,
        sm: "calc(var(--radius) - 4px)" /* 6px — form controls */,
        xl: "calc(var(--radius) + 4px)" /* 14px — workspace panels */,
        "2xl": "calc(var(--radius) + 8px)" /* 18px — hero / major surfaces */,
      },
      // Standardized elevation scale — warm, soft shadows tuned to the brand ink.
      boxShadow: {
        "ds-sm": "0 1px 2px rgba(58, 46, 51, 0.06)",
        "ds": "0 4px 16px rgba(58, 46, 51, 0.08)",
        "ds-md": "0 10px 30px rgba(58, 46, 51, 0.10)",
        "ds-lg": "0 20px 50px rgba(58, 46, 51, 0.12)",
        "ds-glow": "0 10px 30px rgba(93, 157, 97, 0.22)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
export default config
