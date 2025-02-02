/**
 * Returns an effect that effectfully "peeks" at the failure or success of
 * this effect.
 *
 * @tsplus fluent ets/Effect tapBoth
 */
export function tapBoth_<R, E, A, R2, E2, X, R3, E3, X1>(
  self: Effect<R, E, A>,
  f: (e: E) => Effect<R2, E2, X>,
  g: (a: A) => Effect<R3, E3, X1>,
  __tsplusTrace?: string
): Effect<R | R2 | R3, E | E2 | E3, A> {
  return self.foldCauseEffect(
    (cause) =>
      cause.failureOrCause().fold(
        (e) => f(e).zipRight(Effect.failCauseNow(cause)),
        () => Effect.failCauseNow(cause)
      ),
    (a) => g(a).as(a)
  )
}

/**
 * Returns an effect that effectfully "peeks" at the failure or success of
 * this effect.
 *
 * @tsplus static ets/Effect/Aspects tapBoth
 */
export const tapBoth = Pipeable(tapBoth_)
