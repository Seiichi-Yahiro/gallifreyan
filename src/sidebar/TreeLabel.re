open CommonTypes;

[@react.component]
let make = (~id: uuid, ~text: string) => {
  let dispatch = Store.useDispatch();

  let onMouseEnter = _ => id->Some->Hover->Work->dispatch;
  let onMouseLeave = _ => None->Hover->Work->dispatch;

  let onClick = event => {
    id->Some->Select->Work->dispatch;
    event->ReactEvent.Mouse.preventDefault;
  };

  <div onMouseEnter onMouseLeave onClick> text->React.string </div>;
};