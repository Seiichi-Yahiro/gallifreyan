let toRadian = (degree: float): float => degree *. (Js.Math._PI /. 180.0);

let rotate = (x: float, y: float, angle: float): (float, float) => {
  let radian = angle->toRadian;
  let cosAngle = radian->Js.Math.cos;
  let sinAngle = radian->Js.Math.sin;

  let rotatedX = x *. cosAngle -. y *. sinAngle;
  let rotatedY = x *. sinAngle +. y *. cosAngle;

  (rotatedX, rotatedY);
};

let calculateTranslation = (pos: ImageTypes.positionData): (float, float) =>
  rotate(0.0, pos.distance, pos.angle);