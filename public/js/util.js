/**
 * Creates an HTML element with optional class names and text content.
 *
 * @param {keyof HTMLElementTagNameMap} tag - The HTML tag name (e.g. 'div', 'p', 'img').
 * @param {string} [classList] - Optional CSS class(es) to assign.
 * @param {string} [innerText] - Optional text content (ignored if falsy).
 * @returns {HTMLElementTagNameMap[keyof HTMLElementTagNameMap]} The created element.
 */
export function createHtmlElement (tag, classList, innerText) {
  const element = document.createElement(tag)
  if (classList) element.className = classList
  if (innerText) element.innerText = innerText
  return element
}
