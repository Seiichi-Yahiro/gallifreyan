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
     ->Belt.List.map(item =>
         <TreeItemCircle
           key={item.id}
           id={item.id}
           text={item.text}
           lineSlots={item.lineSlots}>
           {item.children}
         </TreeItemCircle>
       )
     ->Belt.List.reverse
     ->Belt.List.toArray}
  </MaterialUi_Lab.TreeView>;
};