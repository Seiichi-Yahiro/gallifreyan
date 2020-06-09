let defaultRadius = (type_: ImageTypes.circleType): float =>
  switch (type_) {
  | Sentence => 450.0
  | Word => 100.0
  | Letter(Consonant(_, _)) => 50.0
  | Letter(Vocal(_, _)) => 20.0
  | Dot => 5.0
  };

let defaultDistance =
    (~type_: ImageTypes.circleType, ~ownRadius: float, ~parentRadius: float)
    : float =>
  switch (type_) {
  | Sentence => 0.0
  | Word => parentRadius -. ownRadius -. 10.0
  | Letter(Consonant(posType, _)) =>
    switch (posType) {
    | DeepCut => parentRadius -. ownRadius /. 2.0 *. 1.25
    | ShallowCut => parentRadius +. ownRadius /. 2.0
    | OnLine => parentRadius
    | Inside => parentRadius -. ownRadius -. 5.0
    }
  | Letter(Vocal(posType, _)) =>
    switch (posType) {
    | Inside => parentRadius -. ownRadius -. 5.0
    | Outside => parentRadius +. ownRadius +. 5.0
    | OnLine => parentRadius
    }
  | Dot => parentRadius -. ownRadius *. 2.0
  };

let defaultAngle =
    (
      ~type_: ImageTypes.circleType,
      ~numberOfSiblings: int,
      ~parentAngle: float, // Only necessary for Dots
      index: int,
    )
    : float =>
  switch (type_) {
  | Dot =>
    let letterSideAngle = parentAngle -. 180.0;
    let dotDistanceAngle = (-45.0);
    let centerDotsOnLetterSideAngle =
      (numberOfSiblings - 1)->float_of_int *. dotDistanceAngle /. 2.0;

    index->float_of_int
    *. dotDistanceAngle
    -. centerDotsOnLetterSideAngle
    +. letterSideAngle;
  | _ =>
    let angleStep = (-360.0) /. numberOfSiblings->float_of_int;
    index->float_of_int *. angleStep;
  };

let defaultLineSlotAngle =
    (
      ~numberOfSiblings: int,
      ~parentAngle: float,
      ~pointOutside=false,
      index: int,
    )
    : float => {
  let parentSideAngle = parentAngle -. (pointOutside ? 0.0 : 180.0);
  let lineDistanceAngle = (-45.0);
  let centerLinesOnParentSideAngle =
    (numberOfSiblings - 1)->float_of_int *. lineDistanceAngle /. 2.0;
  index->float_of_int
  *. lineDistanceAngle
  -. centerLinesOnParentSideAngle
  +. parentSideAngle;
};

let isFilled = (type_: ImageTypes.circleType): bool =>
  switch (type_) {
  | Dot => true
  | _ => false
  };