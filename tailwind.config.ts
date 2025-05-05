import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Neomorphic specific colors
				neo: {
					bg: 'var(--neo-bg)',
					shadow: {
						dark: 'var(--neo-shadow-dark)',
						light: 'var(--neo-shadow-light)'
					},
					primary: 'var(--neo-primary)',
					secondary: 'var(--neo-secondary)',
					accent: 'var(--neo-accent)',
					text: {
						primary: 'var(--neo-text-primary)',
						secondary: 'var(--neo-text-secondary)'
					}
				}
			},
			boxShadow: {
				'neo-flat': '3px 3px 6px #d3d0e2, -3px -3px 6px #ffffff',
				'neo-pressed': 'inset 3px 3px 6px #d3d0e2, inset -3px -3px 6px #ffffff',
				'neo-convex': '3px 3px 6px #d3d0e2, -3px -3px 6px #ffffff, inset 1px 1px 1px #ffffff, inset -1px -1px 1px #d3d0e2',
				'neo-concave': '3px 3px 6px #d3d0e2, -3px -3px 6px #ffffff, inset 1px 1px 1px #d3d0e2, inset -1px -1px 1px #ffffff',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [
		tailwindcssAnimate,
		plugin(function({ addUtilities, theme, matchUtilities }) {
			matchUtilities(
				{
					'ring-neo-primary': (value) => ({
						'--tw-ring-color': `var(--neo-primary)`
					}),
				},
				{ values: { DEFAULT: '1' } }
			);
		})
	],
} satisfies Config;
