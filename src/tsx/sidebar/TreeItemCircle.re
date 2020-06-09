open CommonTypes;

module type RecursiveTreeItemCircleType = {
  let make:
    {
      .
      "id": uuid,
      "text": string,
      "lineSlots": list(uuid),
      "children": list(ImageTypes.circleItem),
    } =>
    React.element;

  let makeProps:
    (
      ~id: uuid,
      ~text: string,
      ~lineSlots: list(uuid),
      ~children: list(ImageTypes.circleItem),
      ~key: string=?,
      unit
    ) =>
    {
      .
      "id": uuid,
      "text": string,
      "lineSlots": list(uuid),
      "children": list(ImageTypes.circleItem),
    };
};

module rec RecursiveTreeItemCircle: RecursiveTreeItemCircleType = {
  [@react.component]
  let make =
      (
        ~id: uuid,
        ~text: string,
        ~lineSlots: list(uuid),
        ~children: list(ImageTypes.circleItem),
      ) => {
    let children' =
      children
      ->Tablecloth.List.map(~f=({id, text, lineSlots, children}) =>
          <RecursiveTreeItemCircle key=id id text lineSlots>
            children
          </RecursiveTreeItemCircle>
        )
      ->Tablecloth.Array.fromList;

    let lineSlots' =
      lineSlots
      ->Tablecloth.List.map(~f=slot => <TreeItemLineSlot key=slot id=slot />)
      ->Tablecloth.Array.fromList;

    let numberOfChildren =
      Tablecloth.Array.length(children')
      + Tablecloth.Array.length(lineSlots');

    <MaterialUi_Lab.TreeItem nodeId=id label={<TreeLabel id text />}>
      {if (numberOfChildren > 0) {
         <> {React.array(children')} {React.array(lineSlots')} </>;
       } else {
         React.null;
       }}
    </MaterialUi_Lab.TreeItem>;
  };
};

let make = RecursiveTreeItemCircle.make;
let makeProps = RecursiveTreeItemCircle.makeProps;