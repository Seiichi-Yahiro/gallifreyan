open AppState;

type t = (Action.t, State.t);

let applyEpic =
    (
      ~unwrapper:
         (('wrappedAction, 'wrappedState)) => option(('action, 'state)),
      ~epic: Rx.Observable.t(('action, 'state)) => Rx.Observable.t('action),
      ~wrapper: 'action => 'wrappedAction',
      ro: Rx.Observable.t(('wrappedAction, 'wrappedState)),
    ) =>
  ro
  |> ReductiveObservable.Utils.optmap(unwrapper)
  |> epic
  |> Rx.Operators.map((action, _i) => wrapper(action));

let imageEpic =
  applyEpic(
    ~epic=ImageEpics.root,
    ~unwrapper=
      fun
      | (Action.Image(imageAction), state: State.t) =>
        Some((imageAction, state.image))
      | _ => None,
    ~wrapper=action =>
    Action.Image(action)
  );

let root = (ro: Rx.Observable.t(t)) => Rx.merge([|ro |> imageEpic|]);