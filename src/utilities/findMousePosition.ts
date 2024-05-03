import { findEnds, findInsideClick } from "./findSelectedPosition";
import { ElementType } from "../intefaces/ElementType";

//Find the position of the selection => start || on || end
export const positionWithinElement = (
  x: number,
  y: number,
  element: ElementType
) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "line":
      const on = findInsideClick(x1, y1, x2, y2, x, y);
      const start = findEnds(x, y, x1, y1, "start");
      const end = findEnds(x, y, x2, y2, "end");
      return start || end || on;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

/*Get the element at the position based on x1,y1,by finding the result 
with elements,position of currrent element added
*/
export const getSelectedElement = (x: any, y: any, elements: any) => {
  return elements
    .map((element: any) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element: any) => element.position !== null);
};
