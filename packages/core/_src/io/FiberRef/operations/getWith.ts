import { IFiberRefWith } from "@effect/core/io/Effect/definition/primitives"

/**
 * Gets the value associated with the current fiber and uses it to run the
 * specified effect.
 *
 * @tsplus fluent ets/FiberRef getWith
 */
export function getWith_<R, E, A, B, P>(
  self: FiberRef<A, P>,
  f: (a: A) => Effect<R, E, B>,
  __tsplusTrace?: string
): Effect<R, E, B> {
  return new IFiberRefWith(self, f, __tsplusTrace)
}

/**
 * Gets the value associated with the current fiber and uses it to run the
 * specified effect.
 *
 * @tsplus static ets/FiberRef/Aspects getWith
 */
export const getWith = Pipeable(getWith_)
