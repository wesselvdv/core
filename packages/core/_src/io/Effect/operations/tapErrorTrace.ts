/**
 * A version of `tapError` that gives you the trace of the error.
 *
 * @tsplus fluent ets/Effect tapErrorTrace
 */
export function tapErrorTrace_<R, E, A, R2, E2, X>(
  self: Effect<R, E, A>,
  f: (trace: Trace) => Effect<R2, E2, X>,
  __tsplusTrace?: string
): Effect<R | R2, E | E2, A> {
  return self.foldCauseEffect(
    (cause) =>
      cause.failureTraceOrCause().fold(
        ({ tuple: [_, trace] }) => f(trace).zipRight(Effect.failCauseNow(cause)),
        () => Effect.failCauseNow(cause)
      ),
    Effect.succeedNow
  )
}

/**
 * A version of `tapError` that gives you the trace of the error.
 *
 * @tsplus static ets/Effect/Aspects tapErrorTrace
 */
export const tapErrorTrace = Pipeable(tapErrorTrace_)
