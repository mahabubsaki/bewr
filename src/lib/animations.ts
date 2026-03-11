import type { Variants, Transition } from "framer-motion";

// ─── Easing curve (cubic-bezier equivalent of Apple's overshoot) ───────────────
export const ease = [0.22, 1, 0.36, 1] as const;

// ─── Spring preset ─────────────────────────────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
};

// ─── Page-level transition ─────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.22, ease: "easeIn" } },
};

// ─── Fade up ───────────────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease } },
};

// ─── Fade in ──────────────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

// ─── Scale in ─────────────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

// ─── Slide from right ─────────────────────────────────────────────────────────
export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0,  transition: { type: "spring", stiffness: 380, damping: 36 } },
  exit:    { opacity: 0, x: 28, transition: { duration: 0.2 } },
};

// ─── Stagger container + child ────────────────────────────────────────────────
export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerChild: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.42, ease } },
};

// ─── Overlay backdrop ─────────────────────────────────────────────────────────
export const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

// ─── Panel slide (mobile drawer) ──────────────────────────────────────────────
export const panelVariants: Variants = {
  hidden:  { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } },
  exit:    { x: "100%", transition: { duration: 0.22, ease: "easeIn" } },
};
