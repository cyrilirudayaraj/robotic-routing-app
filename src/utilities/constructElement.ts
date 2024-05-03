/* Create individual elements and sends back Element id with its 
coordinates,later stored in state (elementscopy)
*/
export const constructElement = (
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string
) => {
  switch (type) {
    case "line":
      return { id, x1, y1, x2, y2, type };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};
