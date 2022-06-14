import { concreteTQueue } from "@effect/core/stm/TQueue/operations/_internal/InternalTQueue"

/**
 * The maximum capacity of the queue.
 *
 * @tsplus getter ets/TQueue capacity
 */
export function capacity<A>(self: TQueue<A>): number {
  concreteTQueue(self)
  return self.capacity
}
