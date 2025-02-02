/**
 * Split a stream by a predicate. The faster stream may advance by up to
 * buffer elements further than the slower one.
 *
 * @tsplus fluent ets/Stream partitionEither
 */
export function partitionEither_<R, E, A, R2, E2, A2, A3>(
  self: Stream<R, E, A>,
  p: (a: A) => Effect<R2, E2, Either<A2, A3>>,
  buffer = 16,
  __tsplusTrace?: string
): Effect<
  R | R2 | Scope,
  E | E2,
  Tuple<[Stream<never, E | E2, A2>, Stream<never, E | E2, A3>]>
> {
  return self
    .mapEffect(p)
    .distributedWith(2, buffer, (either) =>
      either.fold(
        () => Effect.succeedNow((_) => _ === 0),
        () => Effect.succeedNow((_) => _ === 1)
      ))
    .flatMap((dequeues) => {
      if (dequeues.length === 2) {
        return Effect.succeedNow(
          Tuple(
            Stream.fromQueueWithShutdown(dequeues.unsafeHead()!)
              .flattenExitOption()
              .collectLeft(),
            Stream.fromQueueWithShutdown(dequeues.unsafeLast()!)
              .flattenExitOption()
              .collectRight()
          )
        )
      }
      return Effect.dieMessage(
        `Stream.partitionEither: expected two streams but received: ${dequeues.length}`
      )
    })
}

/**
 * Split a stream by a predicate. The faster stream may advance by up to
 * buffer elements further than the slower one.
 *
 * @tsplus static ets/Stream/Aspects partitionEither
 */
export const partitionEither = Pipeable(partitionEither_)
