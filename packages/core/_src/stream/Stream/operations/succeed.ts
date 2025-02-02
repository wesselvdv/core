/**
 * Creates a single-valued pure stream.
 *
 * @tsplus static ets/Stream/Ops succeed
 */
export function succeed<A>(
  a: LazyArg<A>,
  __tsplusTrace?: string
): Stream<never, never, A> {
  return Stream.fromChunk(Chunk.single(a()))
}
