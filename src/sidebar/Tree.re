open TreeIcons;

let textSelector = (state: Store.State.t) => state.image.text;
let selectedSelector = (state: Store.State.t) =>
  state.work.selected->Tablecloth.Option.withDefault(~default="");

[@react.component]
let make = (~className) => {
  let text = Store.useSelector(textSelector);

  let selected = Store.useSelector(selectedSelector);

  <MaterialUi_Lab.TreeView
    selected={`String(selected)}
    defaultCollapseIcon={<MinusSquare />}
    defaultExpandIcon={<PlusSquare />}
    defaultEndIcon={<CloseSquare />}
    className>
    {text
     ->Tablecloth.List.map(~f=circleItem =>
         <TreeItemCircle key={circleItem.id} circleItem />
       )
     ->Tablecloth.List.reverse
     ->Tablecloth.Array.fromList}
  </MaterialUi_Lab.TreeView>;
};