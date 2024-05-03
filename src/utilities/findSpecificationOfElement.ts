/*Calculate the angle of the drawn line element */
export const calculateAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  // Calculate the angle in radians
  const angleRadians = Math.atan2(y2 - y1, x2 - x1);

  // Convert radians to degrees
  let angleDegrees = (angleRadians * 180) / Math.PI;

  // Ensure the angle is between 0 and 360
  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return angleDegrees;
};

/*Calculate the distance between the two points of the line */
export const distanceOfaLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let dx = x2 - x1;
  let dy = y2 - y1;

  dx = dx * dx;
  dy = dy * dy;

  return Math.sqrt(dx + dy);
};
