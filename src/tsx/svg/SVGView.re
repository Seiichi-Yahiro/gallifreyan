let svgSizeSelector = (state: AppState.appState) => state.image.svgSize;

[@react.component]
let make = () => {
  let size = AppState.useSelector(svgSizeSelector);
  let viewbox = {j|0 0 $size $size|j};

  <div>
    <SVGPanZoom
      width=500
      height=500
      detectAutoPan=false
      toolbarProps={position: "left"}>
      <svg viewBox=viewbox />
    </SVGPanZoom>
  </div>;
};