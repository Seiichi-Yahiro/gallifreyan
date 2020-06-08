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

let rec createCircles =
        (
          ~angleStep: float,
          ~parentRadius: float,
          ~parentAngle: float,
          ~numberOfSelf: int,
          indexOfSelf: int,
          circleItem: ImageTypes.circleItem,
        )
        : list(ImageTypes.circle) => {
  let numberOfChildren = circleItem.children->Tablecloth.List.length;
  let childAngleStep = (-360.0) /. numberOfChildren->float_of_int;
  let angle = ref(indexOfSelf->float_of_int *. angleStep);
  let filled = ref(false);

  let (r, distance) =
    switch (circleItem.type_) {
    | Sentence =>
      let r = 450.0;
      let distance = 0.0;
      (r, distance);
    | Word =>
      let r = 100.0;
      let distance = parentRadius -. r -. 10.0;
      (r, distance);
    | Letter(Consonant(posType, _)) =>
      let r = 50.0;
      let distance =
        switch (posType) {
        | DeepCut => parentRadius -. r /. 2.0 *. 1.25
        | ShallowCut => parentRadius +. r /. 2.0
        | OnLine => parentRadius
        | Inside => parentRadius -. r -. 5.0
        };
      (r, distance);
    | Letter(Vocal(posType, _)) =>
      let r = 20.0;
      let distance =
        switch (posType) {
        | Inside => parentRadius -. r -. 5.0
        | Outside => parentRadius +. r +. 5.0
        | OnLine => parentRadius
        };
      (r, distance);
    | Dot =>
      let r = 5.0;
      let distance = parentRadius -. r *. 2.0;
      filled := true;

      let letterSideAngle = parentAngle -. 180.0;
      let dotDistanceAngle = (-45.0);
      let centerDotsOnLetterSideAngle =
        (numberOfSelf - 1)->float_of_int *. dotDistanceAngle /. 2.0;
      angle :=
        indexOfSelf->float_of_int
        *. dotDistanceAngle
        -. centerDotsOnLetterSideAngle
        +. letterSideAngle;
      (r, distance);
    };

  let children =
    circleItem.children
    ->Tablecloth.List.indexedMap(
        ~f=
          createCircles(
            ~angleStep=childAngleStep,
            ~parentRadius=r,
            ~parentAngle=angle^,
            ~numberOfSelf=numberOfChildren,
          ),
      )
    ->Tablecloth.List.concat;

  let self: ImageTypes.circle = {
    id: circleItem.id,
    r,
    filled: filled^,
    pos: {
      angle: angle^,
      distance,
    },
  };

  [self, ...children];
};