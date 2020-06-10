open CommonTypes;

[@react.component]
let make = (~id: uuid, ~text: string) => {
  let dispatch = Store.useDispatch();

  let onMouseEnter = _ => id->Some->Hover->WorkAction->dispatch;
  let onMouseLeave = _ => None->Hover->WorkAction->dispatch;

  let onClick = event => {
    id->Some->Select->WorkAction->dispatch;
    event->ReactEvent.Mouse.preventDefault;
  };

  <div onMouseEnter onMouseLeave onClick> text->React.string </div>;
};