export const createElementWithClass = <
  K extends keyof HTMLElementTagNameMap = "div",
>(
  tag: string,
  className: string,
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag) as HTMLElementTagNameMap[K];
  element.className = className;
  return element;
};
