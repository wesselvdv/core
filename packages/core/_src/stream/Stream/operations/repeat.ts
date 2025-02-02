import { StreamInternal } from "@effect/core/stream/Stream/operations/_internal/StreamInternal"

/**
 * Repeats the entire stream using the specified schedule. The stream will
 * execute normally, and then repeat again according to the provided schedule.
 *
 * @tsplus fluent ets/Stream repeat
 */
export function repeatNow_<R, E, A, S, R2, B>(
  self: Stream<R, E, A>,
  schedule: LazyArg<Schedule<S, R2, unknown, B>>,
  __tsplusTrace?: string
): Stream<R | R2, E, A> {
  return self.repeatEither(schedule).collectRight()
}

/**
 * Repeats the entire stream using the specified schedule. The stream will
 * execute normally, and then repeat again according to the provided schedule.
 *
 * @tsplus static ets/Stream/Aspects repeat
 */
export const repeatNow = Pipeable(repeatNow_)

/**
 * Repeats the provided value infinitely.
 *
 * @tsplus static ets/Stream/Ops repeat
 */
export function repeat<A>(
  a: LazyArg<A>,
  __tsplusTrace?: string
): Stream<never, never, A> {
  return new StreamInternal(
    Channel.succeed(a).flatMap((a) => Channel.write(Chunk.single(a)).repeated())
  )
}
