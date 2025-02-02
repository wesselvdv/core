import { concreteStream, StreamInternal } from "@effect/core/stream/Stream/operations/_internal/StreamInternal"

/**
 * Maps each element of this stream to another stream and returns the
 * non-deterministic merge of those streams, executing up to `n` inner streams
 * concurrently. Up to `bufferSize` elements of the produced streams may be
 * buffered in memory by this operator.
 *
 * @tsplus fluent ets/Stream flatMapPar
 */
export function flatMapPar_<R, E, A, R2, E2, B>(
  self: Stream<R, E, A>,
  n: number,
  f: (a: A) => Stream<R2, E2, B>,
  bufferSize = 16,
  __tsplusTrace?: string
): Stream<R | R2, E | E2, B> {
  concreteStream(self)
  return new StreamInternal(
    self.channel.concatMap(Channel.writeChunk).mergeMap(
      n,
      (a: A) => {
        const stream = f(a)
        concreteStream(stream)
        return stream.channel
      },
      bufferSize
    )
  )
}

/**
 * Maps each element of this stream to another stream and returns the
 * non-deterministic merge of those streams, executing up to `n` inner streams
 * concurrently. Up to `bufferSize` elements of the produced streams may be
 * buffered in memory by this operator.
 *
 * @tsplus static ets/Stream/Aspects flatMapPar
 */
export const flatMapPar = Pipeable(flatMapPar_)
