let rec createCircles =
        (
          ~angleStep: float,
          ~parentRadius: float,
          indexOfSelf: int,
          circleItem: ImageTypes.circleItem,
        )
        : list(ImageTypes.circle) => {
  let numberOfChildren = circleItem.children->Tablecloth.List.length;
  let childAngleStep = (-360.0) /. numberOfChildren->float_of_int;
  let angle = indexOfSelf->float_of_int *. angleStep;
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
      (r, distance);
    };

  let filled =
    switch (circleItem.type_) {
    | Dot => true
    | _ => false
    };

  circleItem.children
  ->Tablecloth.List.indexedMap(
      ~f=createCircles(~angleStep=childAngleStep, ~parentRadius=r),
    )
  ->Tablecloth.List.concat
  ->Tablecloth.List.cons(
      ImageTypes.{
        id: circleItem.id,
        r,
        filled,
        pos: {
          angle,
          distance,
        },
      },
      _,
    );
};