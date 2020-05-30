type toolbarProps = {position: string};

[@react.component] [@bs.module "react-svg-pan-zoom"]
external make:
  (
    ~width: int,
    ~height: int,
    ~detectAutoPan: bool=?,
    ~toolbarProps: toolbarProps=?,
    ~children: React.element=?,
    unit
  ) =>
  React.element =
  "UncontrolledReactSVGPanZoom";