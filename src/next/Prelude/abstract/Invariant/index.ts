import { HasURI, HKT, Kind, URIS } from "../HKT"

export interface InvariantF<F> extends HasURI<F> {
  readonly Invariant: "Invariant"
  readonly invmap: <A, B>(fg: {
    f: (a: A) => B
    g: (b: B) => A
  }) => {
    f: (ma: HKT<F, A>) => HKT<F, B>
    g: (mb: HKT<F, B>) => HKT<F, A>
  }
}

export interface InvariantK<F extends URIS> extends HasURI<F> {
  readonly Invariant: "Invariant"
  readonly invmap: <A, B>(fg: {
    f: (a: A) => B
    g: (b: B) => A
  }) => {
    f: <Y, X, S, R, E>(ma: Kind<F, S, X, S, R, E, A>) => Kind<F, Y, X, S, R, E, B>
    g: <Y, X, S, R, E>(mb: Kind<F, S, X, S, R, E, B>) => Kind<F, Y, X, S, R, E, A>
  }
}

export function makeInvariant<URI extends URIS>(
  _: URI
): (_: Omit<InvariantK<URI>, "URI" | "Invariant">) => InvariantK<URI>
export function makeInvariant<URI>(
  URI: URI
): (_: Omit<InvariantF<URI>, "URI" | "Invariant">) => InvariantF<URI> {
  return (_) => ({
    URI,
    Invariant: "Invariant",
    ..._
  })
}
