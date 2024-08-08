import "./Health.css";
import EventEmitter from "eventemitter3";

type HealthBarArgs = {
  initialPoints?: number;
  maxPoints?: number;
};

export const HealthBar = ({
  initialPoints = 20,
  maxPoints = 20,
}: HealthBarArgs): [HTMLDivElement, Health] => {
  let points = initialPoints;
  const container = document.createElement("div");
  container.className = "health-bar";
  const healthPoint = document.createElement("div");
  healthPoint.className = "health-point";
  container.append(healthPoint);

  const calculateWidth = (points: number) => {
    return `${(points / maxPoints) * 100}%`;
  };

  const health = new Health(initialPoints, maxPoints);
  health.on("health", (points) => {
    healthPoint.style.width = calculateWidth(points);
  });

  healthPoint.style.width = calculateWidth(points);

  return [container, health];
};

interface Events {
  health: (points: number) => void;
}

export class Health extends EventEmitter<Events> {
  points = 0;
  maxPoints = 0;
  constructor(initialPoints = 20, maxPoints = 20) {
    super();
    this.points = initialPoints;
    this.maxPoints = maxPoints;
  }

  incrementHealth() {
    this.points = Math.min(this.points + 1, this.maxPoints);
    this.emit("health", this.points);
  }

  decrementHealth() {
    this.points = Math.max(this.points - 1, 0);
    this.emit("health", this.points);
  }

  setHealthPoints(value: number) {
    let val = this.points + value;
    if (val > this.maxPoints) val = this.maxPoints;
    if (val < 0) val = 0;
    this.points = val;
    this.emit("health", this.points);
  }
}
