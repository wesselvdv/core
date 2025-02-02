import { SynchronizedRefInternal } from "@effect/core/io/Ref/Synchronized/operations/_internal/SynchronizedRefInternal"

/**
 * Creates a new `Ref.Synchronized` with the specified value.
 *
 * @tsplus static ets/Ref/Synchronized/Ops make
 */
export function make<A>(
  value: LazyArg<A>,
  __tsplusTrace?: string
): Effect<never, never, SynchronizedRef<A>> {
  return Effect.Do()
    .bind("ref", () => Ref.make<A>(value))
    .bind("semaphore", () => Semaphore.make(1))
    .map(({ ref, semaphore }) => new SynchronizedRefInternal(ref, semaphore))
}
