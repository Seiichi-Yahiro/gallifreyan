type toolbarProps = {position: string};

[@react.component] [@bs.module "react-svg-pan-zoom"]
external make:
  (
    ~width: float,
    ~height: float,
    ~detectAutoPan: bool=?,
    ~toolbarProps: toolbarProps=?,
    ~children: React.element,
    unit
  ) =>
  React.element =
  "UncontrolledReactSVGPanZoom";