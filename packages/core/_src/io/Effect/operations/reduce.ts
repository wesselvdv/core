/**
 * Folds an `Collection<A>` using an effectual function f, working sequentially from left to right.
 *
 * @tsplus static ets/Effect/Ops reduce
 */
export function reduce<A, Z, R, E>(
  as: LazyArg<Collection<A>>,
  z: LazyArg<Z>,
  f: (z: Z, a: A) => Effect<R, E, Z>,
  __tsplusTrace?: string
): Effect<R, E, Z> {
  return Effect.suspendSucceed(
    as().reduce(Effect.succeed(z) as Effect<R, E, Z>, (acc, el) => acc.flatMap((a) => f(a, el)))
  )
}
