/**
 * Side-effect stylesheet imports.
 *
 * TypeScript 6 requires a declaration for side-effect imports of non-code
 * modules. Next.js handles the bundling; this only satisfies the type layer.
 */
declare module "*.css";
