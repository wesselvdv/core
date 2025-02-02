/**
 * Returns an effect that races this effect with all the specified effects,
 * yielding the value of the first effect to succeed with a value. Losers of
 * the race will be interrupted immediately
 *
 * @tsplus fluent ets/Effect raceAll
 */
export function raceAll_<R, E, A, R1, E1, A1>(
  self: Effect<R, E, A>,
  effects: LazyArg<Collection<Effect<R1, E1, A1>>>,
  __tsplusTrace?: string
): Effect<R | R1, E | E1, A | A1> {
  return Do(($) => {
    const ios = $(Effect.succeed(Chunk.from(effects())))
    const done = $(Deferred.make<E | E1, Tuple<[A | A1, Fiber<E | E1, A | A1>]>>())
    const fails = $(Ref.make(ios.size))
    return $(Effect.uninterruptibleMask(({ restore }) =>
      Do(($) => {
        const head = $(self.interruptible().fork())
        const tail = $(Effect.forEach(ios, (io) => io.interruptible().fork()))
        const fs = tail.prepend(head) as Chunk<Fiber.Runtime<E | E1, A | A1>>
        $(fs.reduce(
          Effect.unit,
          (io, fiber) => io > fiber.await().flatMap(arbiter(fs, fiber, done, fails)).fork()
        ))
        const inheritRefs = (res: Tuple<[A | A1, Fiber<E | E1, A | A1>]>) => res.get(1).inheritRefs().as(res.get(0))
        return $(
          restore(done.await().flatMap(inheritRefs)).onInterrupt(() =>
            fs.reduce(Effect.unit, (io, fiber) => io < fiber.interrupt())
          )
        )
      })
    ))
  })
}

/**
 * Returns an effect that races this effect with all the specified effects,
 * yielding the value of the first effect to succeed with a value. Losers of
 * the race will be interrupted immediately
 *
 * @tsplus static ets/Effect/Aspects raceAll
 */
export const raceAll = Pipeable(raceAll_)

function arbiter<E, E1, A, A1>(
  fibers: Chunk<Fiber<E | E1, A | A1>>,
  winner: Fiber<E | E1, A | A1>,
  promise: Deferred<E | E1, Tuple<[A | A1, Fiber<E | E1, A | A1>]>>,
  fails: Ref<number>
) {
  return (exit: Exit<E, A | A1>): Effect.RIO<never, void> => {
    return exit.foldEffect(
      (e) =>
        fails
          .modify((c) => Tuple(c === 0 ? promise.failCause(e).asUnit() : Effect.unit, c - 1))
          .flatten(),
      (a) =>
        promise
          .succeed(Tuple(a, winner))
          .flatMap((set) =>
            set
              ? fibers.reduce(Effect.unit, (io, fiber) => fiber === winner ? io : io.zipLeft(fiber.interrupt()))
              : Effect.unit
          )
    )
  }
}
