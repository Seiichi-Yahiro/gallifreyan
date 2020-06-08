let hoverColor = "#2196f3";
let selectedColor = "#ff1744";

[@react.component]
let make =
    (
      ~x: float,
      ~y: float,
      ~isHovered: bool=false,
      ~isSelected: bool=false,
      ~children: React.element,
    ) => {
  let color =
    switch (isSelected, isHovered) {
    | (true, _) => selectedColor
    | (false, true) => hoverColor
    | (false, false) => "inherit"
    };

  let style =
    ReactDOMRe.Style.make(
      ~stroke=color,
      ~fill=color,
      ~transform={j|translate($(x)px, $(y)px)|j},
      (),
    );

  <g style> children </g>;
};