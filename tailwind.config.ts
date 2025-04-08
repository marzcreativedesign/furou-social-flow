
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				display: ['Quicksand', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#8B5CF6',
					foreground: '#FFFFFF',
					50: '#F3EEFF',
					100: '#E4D9FE',
					200: '#C9B3FD',
					300: '#AD8EFB',
					400: '#9E75F8',
					500: '#8B5CF6',
					600: '#7339F5',
					700: '#5A17E3',
					800: '#4711B7',
					900: '#350D89',
				},
				secondary: {
					DEFAULT: '#F97316',
					foreground: '#FFFFFF',
					50: '#FFF5ED',
					100: '#FEEBDC',
					200: '#FDD2B0',
					300: '#FCB885',
					400: '#FA9B52',
					500: '#F97316',
					600: '#DE5A02',
					700: '#AC4502',
					800: '#7A3101',
					900: '#471C01',
				},
				accent: {
					DEFAULT: '#0EA5E9',
					foreground: '#FFFFFF',
					50: '#F0F9FF',
					100: '#E0F2FE',
					200: '#B9E6FE',
					300: '#7CD4FD',
					400: '#36BFFA',
					500: '#0EA5E9',
					600: '#0284C7',
					700: '#0369A1',
					800: '#075985',
					900: '#0C4A6E',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"pulse-soft": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.8" },
				},
				"bounce-small": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10%)" },
				},
				"slide-in-bottom": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-soft": "pulse-soft 2s infinite ease-in-out",
				"bounce-small": "bounce-small 2s infinite ease-in-out",
				"slide-in-bottom": "slide-in-bottom 0.5s ease-out",
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
