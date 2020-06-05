module List = Relude.List;
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
     |> Relude.List.map((ImageTypes.{id, text, lineSlots, children}) =>
          <TreeItemCircle key=id id text lineSlots> children </TreeItemCircle>
        )
     |> Relude.List.reverse
     |> Relude.List.toArray}
  </MaterialUi_Lab.TreeView>;
};