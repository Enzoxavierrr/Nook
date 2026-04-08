/// <reference types="vite/client" />

// SVG imports como URLs (vite default)
declare module '*.svg' {
  const src: string
  export default src
}
