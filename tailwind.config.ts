
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
					DEFAULT: '#FF6B5B', // Coral vibrante
					foreground: '#FFFFFF',
					50: '#FFF0EE',
					100: '#FFE0DC',
					200: '#FFC1B8',
					300: '#FFA295',
					400: '#FF8471',
					500: '#FF6B5B',
					600: '#FF3B27',
					700: '#F31A00',
					800: '#C01500',
					900: '#8D0F00',
				},
				secondary: {
					DEFAULT: '#FFD752', // Amarelo
					foreground: '#000000',
					50: '#FFFAED',
					100: '#FFF5DB',
					200: '#FFEAB6',
					300: '#FFE092',
					400: '#FFD66D',
					500: '#FFD752',
					600: '#FFC70F',
					700: '#DBA600',
					800: '#A87F00',
					900: '#755800',
				},
				accent: {
					DEFAULT: '#75B4FF', // Azul suave
					foreground: '#FFFFFF',
					50: '#F0F8FF',
					100: '#E1F1FF',
					200: '#C3E2FF',
					300: '#A5D4FF',
					400: '#87C4FF',
					500: '#75B4FF',
					600: '#4898FF',
					700: '#1A7DFF',
					800: '#0062E6',
					900: '#004DB3',
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
				// Dark mode specific colors
				dark: {
					background: '#121212',
					card: '#1E1E1E',
					text: '#EDEDED',
					textSecondary: '#B3B3B3',
					border: '#2C2C2C',
					primary: '#FF6B00',
					secondary: '#FF9E3D',
					hover: '#FF8333',
					disabled: '#555555',
					error: '#FF4C4C',
					success: '#4CAF50',
					link: '#FFA756',
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
