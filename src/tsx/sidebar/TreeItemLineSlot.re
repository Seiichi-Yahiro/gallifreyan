open CommonTypes;

[@react.component]
let make = (~id: uuid) => {
  <MaterialUi_Lab.TreeItem nodeId=id label={<TreeLabel id text="LINE" />} />;
};