// ets_tracing: off

import * as E from "../Either"
import { succeedWith, suspend } from "./core"
import { effectAsyncInterrupt } from "./effectAsyncInterrupt"

/**
 * Returns a effect that will never produce anything. The moral equivalent of
 * `while(true) {}`, only without the wasted CPU cycles.
 */
export const never = suspend(() =>
  effectAsyncInterrupt<unknown, never, never>(() => {
    const interval = setInterval(() => {
      //
    }, 60000)
    return E.left(
      succeedWith(() => {
        clearInterval(interval)
      })
    )
  })
)
