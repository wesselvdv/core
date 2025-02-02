/**
 * Makes a new `TArray` that is initialized with specified values.
 *
 * @tsplus static ets/TArray/Ops empty
 */
export function empty<A>(): STM<never, never, TArray<A>> {
  return TArray.from<A>([])
}
