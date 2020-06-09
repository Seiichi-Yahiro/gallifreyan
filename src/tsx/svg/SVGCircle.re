open CommonTypes;

[@react.component]
let make =
    (
      ~id: uuid,
      ~r: float,
      ~filled: bool=false,
      ~stroke: string="inherit",
      ~fill: string="inherit",
      ~mask: string="",
    ) => {
  let dispatch = AppState.useDispatch();
  let onMouseEnter = _ => id->Some->Hover->WorkAction->dispatch;
  let onMouseLeave = _ => None->Hover->WorkAction->dispatch;
  let onClick = event => {
    id->Some->Select->WorkAction->dispatch;
    event->ReactEvent.Mouse.stopPropagation;
  };

  <circle
    cx="0"
    cy="0"
    r={r->Js.Float.toString}
    stroke
    fill={filled ? fill : "transparent"}
    mask
    onMouseEnter
    onMouseLeave
    onClick
  />;
};