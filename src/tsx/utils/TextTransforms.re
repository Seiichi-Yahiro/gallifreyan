let createCircle = (circleItem: ImageTypes.circleItem): ImageTypes.circle =>
  switch (circleItem.type_) {
  | Sentence => {
      id: circleItem.id,
      r:
        float_of_int @@ Tablecloth.List.length(circleItem.children) * 100 + 20,
      filled: false,
      pos: {
        angle: 0.0,
        distance: 0.0,
      },
    }
  | Word => {
      id: circleItem.id,
      r:
        float_of_int @@ Tablecloth.List.length(circleItem.children) * 50 + 20,
      filled: false,
      pos: {
        angle: 0.0,
        distance: 0.0,
      },
    }
  | Letter(letterType) =>
    switch (letterType) {
    | Vocal(_, _) => {
        id: circleItem.id,
        r: 20.0,
        filled: false,
        pos: {
          angle: 0.0,
          distance: 0.0,
        },
      }
    | Consonant(_, _) => {
        id: circleItem.id,
        r: 50.0,
        filled: false,
        pos: {
          angle: 0.0,
          distance: 0.0,
        },
      }
    }
  | Dot => {
      id: circleItem.id,
      r: 3.0,
      filled: true,
      pos: {
        angle: 0.0,
        distance: 0.0,
      },
    }
  };

let rec flatMapCircleItemDeep =
        (~f: ImageTypes.circleItem => 'a, circleItem: ImageTypes.circleItem)
        : list(ImageTypes.circle) => {
  circleItem.children
  ->Tablecloth.List.map(~f=flatMapCircleItemDeep(~f))
  ->Tablecloth.List.concat
  ->Tablecloth.List.cons(f(circleItem), _);
};