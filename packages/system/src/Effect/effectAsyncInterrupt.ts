// ets_tracing: off

import * as Tp from "../Collections/Immutable/Tuple"
import * as E from "../Either"
import type { FiberID } from "../Fiber/id"
import * as O from "../Option"
import { AtomicBoolean } from "../Support/AtomicBoolean"
import { OneShot } from "../Support/OneShot"
import type { Canceler } from "./Canceler"
import type { Cb } from "./Cb"
import * as core from "./core"
import type { Effect } from "./effect"
import { flatten } from "./flatten"
import { onInterrupt_ } from "./interruption"

/**
 * Imports an asynchronous side-effect into an effect. The effect also
 * returns a canceler, which will be used by the runtime to cancel the
 * asynchronous effect if the fiber executing the effect is interrupted.
 *
 * The list of fibers, that may complete the async callback, is used to
 * provide better diagnostics.
 */
export function effectAsyncInterrupt<R, E, A>(
  register: (cb: Cb<Effect<R, E, A>>) => E.Either<Canceler<R>, Effect<R, E, A>>,
  __trace?: string
) {
  return effectAsyncInterruptBlockingOn<R, E, A>(register, [], __trace)
}

/**
 * Imports an asynchronous side-effect into an effect. The effect also
 * returns a canceler, which will be used by the runtime to cancel the
 * asynchronous effect if the fiber executing the effect is interrupted.
 *
 * The list of fibers, that may complete the async callback, is used to
 * provide better diagnostics.
 */
export function effectAsyncInterruptBlockingOn<R, E, A>(
  register: (cb: Cb<Effect<R, E, A>>) => E.Either<Canceler<R>, Effect<R, E, A>>,
  blockingOn: readonly FiberID[],
  __trace?: string
) {
  return core.chain_(
    core.succeedWith(() =>
      Tp.tuple(new AtomicBoolean(false), new OneShot<Canceler<R>>())
    ),
    ({ tuple: [started, cancel] }) =>
      onInterrupt_(
        flatten(
          core.effectAsyncOptionBlockingOn(
            (k: (f: Effect<unknown, never, Effect<R, E, A>>) => void) => {
              if (!started.getAndSet(true)) {
                try {
                  const result = register((io) => k(core.succeed(io)))

                  if (E.isLeft(result)) {
                    cancel.set(result.left)

                    return O.none
                  } else {
                    return O.some(core.succeed(result.right))
                  }
                } finally {
                  if (!cancel.isSet()) {
                    cancel.set(core.unit)
                  }
                }
              } else {
                return O.none
              }
            },
            blockingOn,
            __trace
          )
        ),
        () =>
          core.suspend(() => {
            if (started.getAndSet(true)) {
              return cancel.get()
            } else {
              return core.unit
            }
          })
      )
  )
}
