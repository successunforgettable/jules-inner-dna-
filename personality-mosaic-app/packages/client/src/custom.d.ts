declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

// For other assets like images, fonts, etc. if needed in the future
// declare module '*.svg' {
//   const content: React.FC<React.SVGProps<SVGSVGElement>>;
//   export default content;
// }
// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.gif';
// declare module '*.bmp';
// declare module '*.tiff';
// declare module '*.woff';
// declare module '*.woff2';
// declare module '*.eot';
// declare module '*.ttf';
// declare module '*.otf';
