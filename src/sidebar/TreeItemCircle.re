module type RecursiveTreeItemCircleType = {
  let make: {. "circleItem": ImageTypes.circleItem} => React.element;

  let makeProps:
    (~circleItem: ImageTypes.circleItem, ~key: string=?, unit) =>
    {. "circleItem": ImageTypes.circleItem};
};

module rec RecursiveTreeItemCircle: RecursiveTreeItemCircleType = {
  [@react.component]
  let make =
    React.memo(
      (~circleItem as {id, text, lineSlots, children}: ImageTypes.circleItem) => {
      let children' =
        children
        ->Tablecloth.List.map(~f=child =>
            <RecursiveTreeItemCircle key={child.id} circleItem=child />
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
    });
};

let make = RecursiveTreeItemCircle.make;
let makeProps = RecursiveTreeItemCircle.makeProps;