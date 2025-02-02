import { concreteStream } from "@effect/core/stream/Stream/operations/_internal/StreamInternal"

/**
 * Like `Stream.runIntoQueue`, but provides the result as a scoped effect to
 * allow for scope composition.
 *
 * @tsplus fluent ets/Stream runIntoQueueElementsScoped
 */
export function runIntoQueueElementsScoped_<R, E extends E1, A, E1>(
  self: Stream<R, E, A>,
  queue: LazyArg<Enqueue<Exit<Option<E1>, A>>>,
  __tsplusTrace?: string
): Effect<R | Scope, E | E1, void> {
  const writer: Channel<
    R,
    E,
    Chunk<A>,
    unknown,
    E,
    Exit<Option<E | E1>, A>,
    unknown
  > = Channel.readWith(
    (input: Chunk<A>) =>
      input.reduce(
        Channel.unit as Channel<
          R,
          E,
          Chunk<A>,
          unknown,
          E,
          Exit<Option<E | E1>, A>,
          unknown
        >,
        (channel, a) => channel > Channel.write(Exit.succeed(a))
      ) > writer,
    (err) => Channel.write(Exit.fail(Option.some(err))),
    () => Channel.write(Exit.fail(Option.none))
  )
  concreteStream(self)
  return (self.channel >> writer)
    .mapOutEffect((take) => queue().offer(take))
    .drain()
    .runScoped()
    .asUnit()
}

/**
 * Like `Stream.runIntoQueue`, but provides the result as a scoped effect to
 * allow for scope composition.
 *
 * @tsplus static ets/Stream/Aspects runIntoQueueElementsScoped
 */
export const runIntoQueueElementsScoped = Pipeable(runIntoQueueElementsScoped_)
