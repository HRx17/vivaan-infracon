import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        bg: v("background"),
        surface: v("surface"),
        fg: v("text"),
        muted: v("muted"),
        line: v("border"),
        primary: { DEFAULT: v("primary"), fg: v("on-primary") },
        secondary: v("secondary"),
        accent: v("accent"),
        danger: v("danger"),
        success: v("success"),
      },
      fontFamily: {
        heading: ["var(--font-heading)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", btn: "var(--radius-button)" },
      spacing: { section: "var(--space-section)", gap: "var(--space-gap)", card: "var(--space-card)", tap: "44px" },
      maxWidth: { container: "var(--container-max)" },
      transitionTimingFunction: { brand: "var(--ease)" },
      transitionDuration: { brand: "var(--duration)" },
      letterSpacing: { eyebrow: "0.18em" },
    },
  },
  plugins: [],
} satisfies Config;
