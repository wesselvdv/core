/**
 * Drops elements from the queue while they do not satisfy the predicate,
 * taking and returning the first element that does satisfy the predicate.
 * Retries if no elements satisfy the predicate.
 *
 * @tsplus fluent ets/TQueue seek
 */
export function seek_<A>(self: TQueue<A>, f: (a: A) => boolean): USTM<A> {
  return self.take.flatMap((b) => f(b) ? STM.succeedNow(b) : self.seek(f))
}

/**
 * Drops elements from the queue while they do not satisfy the predicate,
 * taking and returning the first element that does satisfy the predicate.
 * Retries if no elements satisfy the predicate.
 *
 * @tsplus static ets/TQueue/Aspects seek
 */
export const seek = Pipeable(seek_)
