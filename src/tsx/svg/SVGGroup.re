open CommonTypes;

let hoverColor = "#2196f3";
let selectedColor = "#ff1744";

let getColor = (~isSelected: bool, ~isHovered: bool) =>
  switch (isSelected, isHovered) {
  | (true, _) => selectedColor
  | (false, true) => hoverColor
  | (false, false) => "inherit"
  };

[@react.component]
let make = (~id: uuid, ~x: float, ~y: float, ~children: React.element) => {
  let isSelected = Hooks.useIsSelected(id);
  let isHovered = Hooks.useIsHovered(id);

  let color = getColor(~isSelected, ~isHovered);

  let style =
    ReactDOMRe.Style.make(
      ~stroke=color,
      ~fill=color,
      ~transform={j|translate($(x)px, $(y)px)|j},
      (),
    );

  <g style> children </g>;
};