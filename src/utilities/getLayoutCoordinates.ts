//Get the layout coordinates on mouse events
export const getLayoutCoordinates = (
  event: React.MouseEvent<HTMLCanvasElement>
) => {
  const clientX = event.clientX;
  const clientY = event.clientY;
  return { clientX, clientY };
};
