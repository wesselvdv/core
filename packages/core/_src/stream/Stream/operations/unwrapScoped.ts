/**
 * Creates a stream produced from a scoped effect.
 *
 * @tsplus static ets/Stream/Ops unwrapScoped
 */
export function unwrapScoped<R, E, R1, E1, A>(
  managed: LazyArg<Effect<R, E, Stream<R1, E1, A>>>,
  __tsplusTrace?: string
): Stream<Exclude<R, Scope> | R1, E | E1, A> {
  return Stream.scoped(managed).flatten()
}
