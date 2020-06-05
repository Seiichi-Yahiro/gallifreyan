open TreeIcons;

let textSelector = (state: AppState.appState) => state.image.text;

[@react.component]
let make = (~className) => {
  let text = AppState.useSelector(textSelector);

  <MaterialUi_Lab.TreeView
    defaultCollapseIcon={<MinusSquare />}
    defaultExpandIcon={<PlusSquare />}
    defaultEndIcon={<CloseSquare />}
    className>
    {text
     ->Tablecloth.List.map(~f=({id, text, lineSlots, children}) =>
         <TreeItemCircle key=id id text lineSlots> children </TreeItemCircle>
       )
     ->Tablecloth.List.reverse
     ->Tablecloth.Array.fromList}
  </MaterialUi_Lab.TreeView>;
};