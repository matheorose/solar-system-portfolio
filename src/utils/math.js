export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const lerp = (start, end, t) => start + (end - start) * t;
export const randomInRange = (min, max) => Math.random() * (max - min) + min;
export const degToRad = degrees => (degrees * Math.PI) / 180;
export const radToDeg = radians => (radians * 180) / Math.PI;
