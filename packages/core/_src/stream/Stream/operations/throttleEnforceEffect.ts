import { concreteStream, StreamInternal } from "@effect/core/stream/Stream/operations/_internal/StreamInternal"

/**
 * Throttles the chunks of this stream according to the given bandwidth
 * parameters using the token bucket algorithm. Allows for burst in the
 * processing of elements by allowing the token bucket to accumulate tokens up
 * to a `units + burst` threshold. Chunks that do not meet the bandwidth
 * constraints are dropped. The weight of each chunk is determined by the
 * `costFn` effectful function.
 *
 * @tsplus fluent ets/Stream throttleEnforceEffect
 */
export function throttleEnforceEffect_<R, E, A, R2, E2>(
  self: Stream<R, E, A>,
  units: number,
  duration: LazyArg<Duration>,
  costFn: (input: Chunk<A>) => Effect<R2, E2, number>,
  burst = 0,
  __tsplusTrace?: string
): Stream<R | R2, E | E2, A> {
  concreteStream(self)
  return new StreamInternal(
    Channel.succeed(duration)
      .zip(Channel.fromEffect(Clock.currentTime))
      .flatMap(
        ({ tuple: [duration, timestamp] }) =>
          self.channel >>
          loop<E, A, R2, E2>(units, duration, costFn, burst, units, timestamp)
      )
  )
}

/**
 * Throttles the chunks of this stream according to the given bandwidth
 * parameters using the token bucket algorithm. Allows for burst in the
 * processing of elements by allowing the token bucket to accumulate tokens up
 * to a `units + burst` threshold. Chunks that do not meet the bandwidth
 * constraints are dropped. The weight of each chunk is determined by the
 * `costFn` effectful function.
 *
 * @tsplus static ets/Stream/Aspects throttleEnforceEffect
 */
export const throttleEnforceEffect = Pipeable(throttleEnforceEffect_)

function loop<E, A, R2, E2>(
  units: number,
  duration: Duration,
  costFn: (input: Chunk<A>) => Effect<R2, E2, number>,
  burst: number,
  tokens: number,
  timestamp: number,
  __tsplusTrace?: string
): Channel<R2, E | E2, Chunk<A>, unknown, E | E2, Chunk<A>, void> {
  return Channel.readWith(
    (input: Chunk<A>) =>
      Channel.unwrap(
        costFn(input)
          .zip(Clock.currentTime)
          .map(({ tuple: [weight, current] }) => {
            const elapsed = current - timestamp
            const cycles = elapsed / duration.millis
            const sum = tokens + cycles * units
            const max = units + burst < 0 ? Number.MAX_SAFE_INTEGER : units + burst
            const available = sum < 0 ? max : Math.min(sum, max)
            return weight <= available
              ? Channel.write(input) >
                loop<E, A, R2, E2>(
                  units,
                  duration,
                  costFn,
                  burst,
                  available - weight,
                  current
                )
              : loop<E, A, R2, E2>(units, duration, costFn, burst, available, current)
          })
      ),
    (err) => Channel.fail(err),
    () => Channel.unit
  )
}
