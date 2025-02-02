import { concreteTArray } from "@effect/core/stm/TArray/operations/_internal/InternalTArray"

/**
 * Find the last element in the array matching a predicate.
 *
 * @tsplus fluent ets/TArray findLast
 */
export function findLast_<A>(
  self: TArray<A>,
  f: Predicate<A>
): STM<never, never, Option<A>> {
  return STM.Effect((journal) => {
    concreteTArray(self)
    let i = self.chunk.length - 1
    let res = Option.emptyOf<A>()
    while (res.isNone() && i >= 0) {
      const a = self.chunk.unsafeGet(i)!.unsafeGet(journal)
      if (f(a)) {
        res = Option.some(a)
      }
      i = i - 1
    }
    return res
  })
}

/**
 * Find the last element in the array matching a predicate.
 *
 * @tsplus static ets/TArray/Aspects findLast
 */
export const findLast = Pipeable(findLast_)
