type event;
type eventF = event => unit;

[@bs.val]
external addEventListener: (string, eventF) => unit =
  "window.addEventListener";
[@bs.val]
external removeEventListener: (string, eventF) => unit =
  "window.removeEventListener";

let rec load = _event => {
  removeEventListener("load", load);

  ReactDOMRe.renderToElementWithId(
    <AppStore.Provider store=AppStore.appStore> <App /> </AppStore.Provider>,
    "root",
  );
};

addEventListener("load", load);