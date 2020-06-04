open CommonTypes;

module type NodeType = {
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

module rec RecursiveTreeItemCircle: NodeType = {
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
      ->Belt.List.map(child =>
          <RecursiveTreeItemCircle
            key={child.id}
            id={child.id}
            text={child.text}
            lineSlots={child.lineSlots}>
            {child.children}
          </RecursiveTreeItemCircle>
        )
      ->Belt.List.toArray;

    let lineSlots' =
      lineSlots
      ->Belt.List.map(slot => <TreeItemLineSlot key=slot id=slot />)
      ->Belt.List.toArray;

    let numberOfChildren =
      children'->Belt.Array.length + lineSlots'->Belt.Array.length;

    <MaterialUi_Lab.TreeItem nodeId=id label={text->React.string}>
      {if (numberOfChildren > 0) {
         <> children'->React.array lineSlots'->React.array </>;
       } else {
         React.null;
       }}
    </MaterialUi_Lab.TreeItem>;
  };
};

let make = RecursiveTreeItemCircle.make;
let makeProps = RecursiveTreeItemCircle.makeProps;