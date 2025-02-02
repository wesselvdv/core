/**
 * Zips this stream that is sorted by distinct keys and the specified stream
 * that is sorted by distinct keys to produce a new stream that is sorted by
 * distinct keys. Keeps only values from that stream, using the specified
 * value `default` to fill in missing values.
 *
 * This allows zipping potentially unbounded streams of data by key in
 * constant space but the caller is responsible for ensuring that the
 * streams are sorted by distinct keys.
 *
 * @tsplus fluent ets/SortedByKey zipAllSortedByKeyRight
 * @tsplus fluent ets/Stream zipAllSortedByKeyRight
 */
export function zipAllSortedByKeyRight_<R, E, K, A>(
  self: SortedByKey<R, E, K, A>,
  ord: Ord<K>
) {
  return <R2, E2, B>(
    that: LazyArg<SortedByKey<R2, E2, K, B>>,
    def: LazyArg<B>,
    __tsplusTrace?: string
  ): Stream<R | R2, E | E2, Tuple<[K, B]>> => self.zipAllSortedByKeyWith(ord)(that, def, identity, (_, b) => b)
}

/**
 * Zips this stream that is sorted by distinct keys and the specified stream
 * that is sorted by distinct keys to produce a new stream that is sorted by
 * distinct keys. Keeps only values from that stream, using the specified
 * value `default` to fill in missing values.
 *
 * This allows zipping potentially unbounded streams of data by key in
 * constant space but the caller is responsible for ensuring that the
 * streams are sorted by distinct keys.
 *
 * @tsplus static ets/SortedByKey/Aspects zipAllSortedByKeyRight
 */
export const zipAllSortedByKeyRight = Pipeable(zipAllSortedByKeyRight_)
