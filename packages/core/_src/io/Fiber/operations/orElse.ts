import { makeSynthetic } from "@effect/core/io/Fiber/definition"

/**
 * Returns a fiber that prefers `this` fiber, but falls back to the `that` one
 * when `this` one fails. Interrupting the returned fiber will interrupt both
 * fibers, sequentially, from left to right.
 *
 * @tsplus operator ets/Fiber |
 * @tsplus operator ets/RuntimeFiber |
 * @tsplus fluent ets/Fiber orElse
 * @tsplus fluent ets/RuntimeFiber orElse
 */
export function orElse_<E, E1, A, A1>(
  self: Fiber<E, A>,
  that: Fiber<E1, A1>
): Fiber<E | E1, A | A1> {
  return makeSynthetic<E | E1, A | A1>({
    id: self.id().getOrElse(that.id()),
    await: self
      .await()
      .zipWith(that.await(), (e1, e2) => (e1._tag === "Success" ? e1 : e2)),
    children: self.children(),
    inheritRefs: that.inheritRefs() > self.inheritRefs(),
    interruptAs: (id) => self.interruptAs(id) > that.interruptAs(id),
    poll: self
      .poll()
      .zipWith(that.poll(), (o1, o2) => o1.fold(Option.none, (_) => (_._tag === "Success" ? o1 : o2)))
  })
}

/**
 * Returns a fiber that prefers `this` fiber, but falls back to the `that` one
 * when `this` one fails. Interrupting the returned fiber will interrupt both
 * fibers, sequentially, from left to right.
 *
 * @tsplus static ets/Fiber/Aspects orElse
 */
export const orElse = Pipeable(orElse_)
