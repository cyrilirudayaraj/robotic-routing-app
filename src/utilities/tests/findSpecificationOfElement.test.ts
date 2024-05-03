import { calculateAngle, distanceOfaLine } from "../findSpecificationOfElement";

describe("calculateAngle", () => {
  it("should calculate the angle between two points", () => {
    expect(calculateAngle(0, 0, 1, 0)).toBe(0);
    expect(calculateAngle(0, 0, 0, 1)).toBe(90);
    expect(calculateAngle(0, 0, -1, 0)).toBe(180);
    expect(calculateAngle(0, 0, 0, -1)).toBe(270);
    /*Making sure mid angles are working fine*/
    expect(calculateAngle(1, 1, -1, -1)).toBeCloseTo(225);
    expect(calculateAngle(-1, 0, 1, 0)).toBe(0);
    expect(calculateAngle(0, 1, 0, -1)).toBe(270);
  });
});

describe("distanceOfaLine", () => {
  it("should calculate the distance between two points", () => {
    expect(distanceOfaLine(0, 0, 1, 1)).toBeCloseTo(Math.sqrt(2));
    //Making sure it works for negative coordinates
    expect(distanceOfaLine(-3, -4, -6, -8)).toBe(5);
  });
});
