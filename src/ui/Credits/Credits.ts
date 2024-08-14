import css from "./Credits.module.css";

export const Credits = () => {
  const container = document.createElement("div");
  container.className = css.container;

  const paragraph = document.createElement("p");
  paragraph.style.fontSize = "24px";
  container.append(paragraph);
  paragraph.innerHTML = `This is my first 2D game on the web. It took me 31 days to develop, and I've realized there's a lot to explore on the frontend. It's not just about buttons and inputs - graphics play a huge role too. Before this, I had zero knowledge of graphics. Developing this game taught me about running JavaScript on both the GPU and CPU.

Well, I used to think that developing games on the web was super hard and that the web wasn’t ready for it. But now I know—anything can be developed on the web!

P.S, you're mining cryptocurrency for me while reading this text xd
`;

  return container;
};
