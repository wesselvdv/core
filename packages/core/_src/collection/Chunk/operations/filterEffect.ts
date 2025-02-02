import { concreteChunkId } from "@tsplus/stdlib/collections/Chunk/definition"

/**
 * Filters this chunk by the specified effectful predicate, retaining all
 * elements for which the predicate evaluates to true.
 *
 * @tsplus fluent Chunk filterEffect
 */
export function filterEffect_<R, E, A>(
  self: Chunk<A>,
  f: (a: A) => Effect<R, E, boolean>,
  __tsplusTrace?: string
): Effect<R, E, Chunk<A>> {
  return Effect.suspendSucceed(() => {
    const iterator = concreteChunkId(self)._arrayLikeIterator()
    let next
    let dest: Effect<R, E, Chunk<A>> = Effect.succeedNow(Chunk.empty<A>())

    while ((next = iterator.next()) && !next.done) {
      const array = next.value
      const len = array.length
      let i = 0
      while (i < len) {
        const a = array[i]!
        dest = dest.zipWith(f(a), (d, b) => (b ? d.append(a) : d))
        i++
      }
    }
    return dest
  })
}

/**
 * Filters this chunk by the specified effectful predicate, retaining all elements for
 * which the predicate evaluates to true.
 *
 * @tsplus static Chunk/Aspects filterEffect
 */
export const filterEffect = Pipeable(filterEffect_)
