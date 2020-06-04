[@react.component]
let make = (~className) => {
  let (state, setState) = React.useState(() => "");
  let dispatch = AppState.useDispatch();

  let addSentence = (sentence: string) => {
    dispatch(ImageAction(AddSentence(sentence)));
    setState(_ => "");
  };

  let onTextChange = event => {
    let value = event->ReactEvent.Form.target##value;
    setState(_ => value);
  };

  let onKeyPress = event =>
    if (event->ReactEvent.Keyboard.key === "Enter") {
      addSentence(state);
    };

  let onButtonPress = _ => addSentence(state);

  <div className>
    <MaterialUi.TextField
      type_="text"
      placeholder="Sentence..."
      onChange=onTextChange
      inputProps={"onKeyPress": onKeyPress}
    />
    <MaterialUi.Button onClick=onButtonPress>
      {React.string("Add")}
    </MaterialUi.Button>
  </div>;
};