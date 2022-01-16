// ets_tracing: off

import * as Tp from "../../Collections/Immutable/Tuple"
import type { Managed } from "../definition"
import { managedApply } from "../definition"
import * as T from "./_internal/effect"

/**
 * Returns a managed whose success is mapped by the specified `f` function.
 */
export function map_<R, E, A, B>(
  self: Managed<R, E, A>,
  f: (a: A) => B,
  __trace?: string
) {
  return managedApply<R, E, B>(
    T.map_(self.effect, ({ tuple: [fin, a] }) => Tp.tuple(fin, f(a)), __trace)
  )
}

/**
 * Returns a managed whose success is mapped by the specified `f` function.
 *
 * @ets_data_first map_
 */
export function map<A, B>(f: (a: A) => B, __trace?: string) {
  return <R, E>(self: Managed<R, E, A>) => map_(self, f, __trace)
}
