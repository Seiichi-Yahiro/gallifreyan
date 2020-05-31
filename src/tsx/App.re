[@bs.module] external appScss: _ = "./App.scss";

[@react.component]
let make = () => {
  <div className="app"> <Sidebar /> <SVGView /> </div>;
};