/**
 * Makes a new `TMap` that is initialized with specified values.
 *
 * @tsplus static ets/TMap/Ops make
 * @tsplus static ets/TMap/Ops __call
 */
export function make<K, V>(...data: Array<Tuple<[K, V]>>): USTM<TMap<K, V>> {
  return TMap.fromIterable(data)
}
