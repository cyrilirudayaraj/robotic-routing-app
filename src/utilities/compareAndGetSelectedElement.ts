import { ElementType } from "../intefaces/ElementType";
export const compareAndGetSelectedElement = (
  x: ElementType,
  y: ElementType
): boolean => {
  return x.x1 === y.x1 && x.y1 === y.y1 && x.x2 === y.x2 && x.y2 === y.y2;
};
