import { concreteStream, StreamInternal } from "@effect/core/stream/Stream/operations/_internal/StreamInternal"

/**
 * Executes the provided finalizer after this stream's finalizers run.
 *
 * @tsplus fluent ets/Stream ensuring
 */
export function ensuring_<R, E, A, R1, Z>(
  self: Stream<R, E, A>,
  finalizer: LazyArg<Effect<R1, never, Z>>,
  __tsplusTrace?: string
): Stream<R | R1, E, A> {
  concreteStream(self)
  return new StreamInternal(self.channel.ensuring(finalizer))
}

/**
 * Executes the provided finalizer after this stream's finalizers run.
 */
export const ensuring = Pipeable(ensuring_)
