/**
 * Effectfully accesses the specified service in the environment of the
 * effect.
 *
 * Especially useful for creating "accessor" methods on services' companion
 * objects.
 *
 * @tsplus static ets/Effect/Ops serviceWithEffect
 */
export function serviceWithEffect<T, R, E, A>(
  tag: Tag<T>,
  f: (a: T) => Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R | T, E, A> {
  return Effect.suspendSucceed(
    FiberRef.currentEnvironment.value.get()
      .flatMap((env) => f(env.unsafeGet(tag)))
  )
}
