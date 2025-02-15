import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F', // Darker blue-black background
        foreground: '#E2E8F0', // Cool white text
        card: {
          DEFAULT: '#131320', // Deep navy
          foreground: '#E2E8F0'
        },
        popover: {
          DEFAULT: '#1A1A2E', // Rich dark blue
          foreground: '#E2E8F0'
        },
        primary: {
          DEFAULT: '#2D2D4A', // Deep purple-blue
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#1F1F35', // Dark indigo
          foreground: '#E2E8F0'
        },
        muted: {
          DEFAULT: '#252538', // Muted purple-gray
          foreground: '#94A3B8' // Muted cool gray
        },
        accent: {
          DEFAULT: '#323250', // Deep slate purple
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#881337', // Deep crimson
          foreground: '#FFFFFF'
        },
        border: '#2A2A40',
        input: '#1F1F35',
        ring: '#323250',
        chart: {
          '1': '#3F3F60',
          '2': '#4B4B70',
          '3': '#575780',
          '4': '#636390',
          '5': '#6F6FA0'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [animate],
} satisfies Config;
