import { DEFAULT_CHUNK_SIZE } from "@effect/core/stream/Stream/definition"

/**
 * Creates a stream from a `Queue` of values. The queue will be shutdown once
 * the stream is closed.
 *
 * @param maxChunkSize
 *   Maximum number of queued elements to put in one chunk in the stream.
 *
 * @tsplus static ets/Stream/Ops fromQueueWithShutdown
 */
export function fromQueueWithShutdown<A>(
  queue: LazyArg<Dequeue<A>>,
  maxChunkSize = DEFAULT_CHUNK_SIZE,
  __tsplusTrace?: string
): Stream<never, never, A> {
  return Stream.succeed(queue).flatMap((queue) => Stream.fromQueue(queue, maxChunkSize).ensuring(queue.shutdown))
}
