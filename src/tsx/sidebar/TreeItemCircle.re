module List = Relude.List;
module Array = Relude.Array;
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
      |> Relude.List.map((ImageTypes.{id, text, lineSlots, children}) =>
           <RecursiveTreeItemCircle key=id id text lineSlots>
             children
           </RecursiveTreeItemCircle>
         )
      |> Relude.List.toArray;

    let lineSlots' =
      lineSlots
      |> Relude.List.map(slot => <TreeItemLineSlot key=slot id=slot />)
      |> Relude.List.toArray;

    let numberOfChildren =
      Relude.Array.length(children') + Relude.Array.length(lineSlots');

    <MaterialUi_Lab.TreeItem nodeId=id label={text |> React.string}>
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