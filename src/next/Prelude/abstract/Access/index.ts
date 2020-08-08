import { HKT3, Kind, URIS } from "../HKT"

export interface AccessF<F> {
  readonly Access: "Access"
  readonly access: <R, A>(f: (r: R) => A) => HKT3<F, R, never, A>
  readonly provide: <R>(r: R) => <E, A>(fa: HKT3<F, R, E, A>) => HKT3<F, unknown, E, A>
}

export interface AccessK<F extends URIS> {
  readonly Access: "Access"
  readonly access: <R, A, In, S = In>(
    f: (r: R) => A
  ) => Kind<F, never, In, S, R, unknown, A>
  readonly provide: <R>(
    r: R
  ) => <Y, X, S, E, A>(fa: Kind<F, Y, X, S, R, E, A>) => Kind<F, Y, X, S, unknown, E, A>
}

export function makeAccess<URI extends URIS>(
  _: URI
): (_: Omit<AccessK<URI>, "URI" | "Access">) => AccessK<URI>
export function makeAccess<URI>(
  URI: URI
): (_: Omit<AccessF<URI>, "URI" | "Access">) => AccessF<URI> {
  return (_) => ({
    URI,
    Access: "Access",
    ..._
  })
}
