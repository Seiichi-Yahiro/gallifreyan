let convertCircleItemToCircle =
    (circleItem: ImageTypes.circleItem): ImageTypes.circle =>
  switch (circleItem.type_) {
  | Sentence => {
      id: circleItem.id,
      r: float_of_int @@ circleItem.children->Belt.List.length * 100 + 20,
      filled: false,
      pos: {
        angle: 0.0,
        distance: 0.0,
      },
    }
  | Word => {
      id: circleItem.id,
      r: float_of_int @@ circleItem.children->Belt.List.length * 50 + 20,
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

let rec convertCircleItemToCircleRecursive =
        (circleItem: ImageTypes.circleItem): list(ImageTypes.circle) => {
  circleItem.children
  ->Belt.List.map(convertCircleItemToCircleRecursive)
  ->Belt.List.flatten
  ->Belt.List.add(convertCircleItemToCircle(circleItem));
};