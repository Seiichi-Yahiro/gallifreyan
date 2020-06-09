open CommonTypes;

module type RecursiveSVGCircleItemType = {
  let make:
    {
      .
      "parentId": option(uuid),
      "circleItem": ImageTypes.circleItem,
    } =>
    React.element;

  let makeProps:
    (
      ~parentId: uuid=?,
      ~circleItem: ImageTypes.circleItem,
      ~key: string=?,
      unit
    ) =>
    {
      .
      "parentId": option(uuid),
      "circleItem": ImageTypes.circleItem,
    };
};

module rec RecursiveSVGCircleItemType: RecursiveSVGCircleItemType = {
  [@react.component]
  let make =
      (
        ~parentId: option(uuid)=?,
        ~circleItem as
          {id, type_, lineSlots, children}: ImageTypes.circleItem,
      )
      : React.element => {
    let circleSelector =
      React.useCallback1(
        (state: AppState.appState) =>
          state.image.circles->Tablecloth.StrDict.get(~key=id),
        [|id|],
      );

    let circle: option(ImageTypes.circle) =
      AppState.useSelector(circleSelector);

    switch (circle) {
    | None => React.null
    | Some({r, filled, pos}) =>
      let (x, y) = pos->TextTransforms.calculateTranslation;

      let children' = {
        children
        ->Tablecloth.List.map(~f=child =>
            <RecursiveSVGCircleItemType
              key={child.id}
              parentId=id
              circleItem=child
            />
          )
        ->Tablecloth.Array.fromList
        ->React.array;
      };

      let lineSlots' =
        lineSlots
        ->Tablecloth.List.map(~f=slot => <SVGLineSlot key=slot id=slot />)
        ->Tablecloth.Array.fromList
        ->React.array;

      <SVGGroup id x y>
        {switch (type_) {
         | Sentence => <SVGSentence id r filled />
         | Word => <SVGWord id r filled letters=children />
         | Letter(Consonant(posType, _)) =>
           <SVGConsonant id parentId posType x y r filled />
         | Letter(Vocal(_, _)) => <SVGVocal id r filled />
         | Dot => <SVGDot id r filled />
         }}
        lineSlots'
        children'
      </SVGGroup>;
    };
  };
};

let make = RecursiveSVGCircleItemType.make;
let makeProps = RecursiveSVGCircleItemType.makeProps;