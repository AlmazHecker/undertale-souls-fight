import {
  Application,
  Container,
  ContainerChild,
  Graphics,
  Point,
  Polygon,
  Sprite,
  Text,
  Ticker,
} from "pixi.js";

export const createTicker = (minFPS = 60, maxFPS = 60) => {
  const ticker = new Ticker();
  ticker.minFPS = minFPS;
  ticker.maxFPS = maxFPS;
  return ticker;
};

type PixiElement = Sprite | Graphics | Text | ContainerChild;
type PaddingXY = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

//Для сравнения элементов как 4 угольники
export const areRectanglesColliding = (
  rect1: PixiElement,
  rect2: PixiElement,
  padding?: Partial<PaddingXY>,
) => {
  const bounds1 = rect1.getBounds();
  const bounds2 = rect2.getBounds();

  const top = padding?.top ?? 0;
  const bottom = padding?.bottom ?? 0;
  const left = padding?.left ?? 0;
  const right = padding?.right ?? 0;

  bounds1.x += left;
  bounds1.y += top;
  bounds1.width -= left + right;
  bounds1.height -= top + bottom;

  return !(
    bounds1.x + bounds1.width < bounds2.x ||
    bounds1.x > bounds2.x + bounds2.width ||
    bounds1.y + bounds1.height < bounds2.y ||
    bounds1.y > bounds2.y + bounds2.height
  );
};

//Для сравнения элементов со сложной формой(с полигонами)
// TODO Оптимизировать эту функцию
function isPointInPolygon(point: Point, polygon: Polygon) {
  let inside = false;
  const { x, y } = point;
  const points = polygon.points;

  for (let i = 0, j = points.length - 2; i < points.length; j = i, i += 2) {
    const xi = points[i],
      yi = points[i + 1];
    const xj = points[j],
      yj = points[j + 1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export const arePolygonsColliding = (
  spriteA: Sprite | Graphics | ContainerChild,
  spriteB: Sprite | Graphics | ContainerChild,
) => {
  const polygonA = spriteA.hitArea as Polygon;
  const polygonB = spriteB.hitArea as Polygon;

  if (!polygonA || !polygonB) return false;

  const globalPositionA = spriteA.toGlobal(new Point(0, 0));
  const globalPositionB = spriteB.toGlobal(new Point(0, 0));

  const distanceSquared =
    Math.pow(globalPositionA.x - globalPositionB.x, 2) +
    Math.pow(globalPositionA.y - globalPositionB.y, 2);

  // если два спрайта не на дистанции 150px, то возвращается false
  // т.к они находятся слишком далеко и абсолютно никак не могут пересекаться
  if (distanceSquared > Math.pow(150, 2)) {
    return false;
  }

  // Get global positions of the sprites
  const globalPointsA = [];
  const globalPointsB = [];

  for (let i = 0; i < polygonA.points.length; i += 2) {
    const point = new Point(polygonA.points[i], polygonA.points[i + 1]);
    spriteA.toGlobal(point, point);
    globalPointsA.push(point.x, point.y);
  }

  for (let i = 0; i < polygonB.points.length; i += 2) {
    const point = new Point(polygonB.points[i], polygonB.points[i + 1]);
    spriteB.toGlobal(point, point);
    globalPointsB.push(point.x, point.y);
  }

  const globalPolygonA = new Polygon(globalPointsA);
  const globalPolygonB = new Polygon(globalPointsB);

  // Check if any point in polygonA is inside polygonB
  for (let i = 0; i < globalPointsA.length; i += 2) {
    const pointA = new Point(globalPointsA[i], globalPointsA[i + 1]);
    if (isPointInPolygon(pointA, globalPolygonB)) {
      return true;
    }
  }

  // Check if any point in polygonB is inside polygonA
  for (let i = 0; i < globalPointsB.length; i += 2) {
    const pointB = new Point(globalPointsB[i], globalPointsB[i + 1]);
    if (isPointInPolygon(pointB, globalPolygonA)) {
      return true;
    }
  }

  return false;
};

export const isOutOfCanvas = (element: Container, app: Application) => {
  return (
    element.x < 0 ||
    element.x > app.renderer.width ||
    element.y < 0 ||
    element.y > app.renderer.height
  );
};
