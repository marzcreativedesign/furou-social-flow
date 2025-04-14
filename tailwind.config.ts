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
				dyslexic: ['OpenDyslexic', 'sans-serif'],
				serif: ['Georgia', 'serif'],
				mono: ['Courier New', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))',
					active: 'hsl(var(--primary-active))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))',
				},
				
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					hover: 'hsl(var(--secondary-hover))',
					active: 'hsl(var(--secondary-active))',
					light: 'hsl(var(--secondary-light))',
					dark: 'hsl(var(--secondary-dark))',
				},
				
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					foreground: 'hsl(var(--tertiary-foreground))',
					hover: 'hsl(var(--tertiary-hover))',
					active: 'hsl(var(--tertiary-active))',
					light: 'hsl(var(--tertiary-light))',
					dark: 'hsl(var(--tertiary-dark))',
				},
				
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
				
				muted: {
					DEFAULT: "hsl(0 0% 90%)", // Cinza claro mais escuro
					foreground: "hsl(0 0% 40%)", // Texto do muted mais escuro para contraste
				},
				
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				
				// Accessibility
				'high-contrast': {
					background: '#000000',
					foreground: '#FFFFFF',
					border: '#FFFFFF',
					primary: '#F69B65',
					secondary: '#F6C73C',
					tertiary: '#F768AC',
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
				"reduced": "none",
			},
			backgroundImage: {
				'cta-gradient': 'linear-gradient(45deg, #F6C73C 0%, #F69B65 50%, #F768AC 100%)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
