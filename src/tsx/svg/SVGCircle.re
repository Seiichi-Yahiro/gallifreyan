[@react.component]
let make =
    (
      ~r: float,
      ~filled: bool=false,
      ~stroke: string="inherit",
      ~fill: string="inherit",
      ~mask: string="",
    ) => {
  <circle
    cx="0"
    cy="0"
    r={r->Js.Float.toString}
    stroke
    fill={filled ? fill : "transparent"}
    mask
  />;
};