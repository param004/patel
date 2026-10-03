/**
 * Turbopack treats `?raw` imports as the file's contents as a default-exported
 * string. TypeScript has no built-in knowledge of that query suffix, so the
 * registered Kage component's five sibling-document imports would otherwise
 * fail to resolve. Registered source is not edited to work around this.
 */
declare module "*?raw" {
  const content: string;
  export default content;
}
