import { ICheckInterrupt, IInterruptStatus } from "@effect/core/io/Effect/definition/primitives"

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Used to restore the inherited interruptibility
 */
export interface InterruptStatusRestore {
  readonly restore: <R, E, A>(
    effect: LazyArg<Effect<R, E, A>>,
    __tsplusTrace?: string
  ) => Effect<R, E, A>
  /**
   * Returns a new effect that, if the parent region is uninterruptible, can
   * be interrupted in the background instantaneously. If the parent region is
   * interruptible, then the effect can be interrupted normally, in the
   * foreground.
   */
  readonly force: <R, E, A>(
    effect: LazyArg<Effect<R, E, A>>,
    __tsplusTrace?: string
  ) => Effect<R, E, A>
}

export class InterruptStatusRestoreImpl implements InterruptStatusRestore {
  constructor(readonly flag: InterruptStatus) {}

  restore = <R, E, A>(
    effect: LazyArg<Effect<R, E, A>>,
    __tsplusTrace?: string
  ): Effect<R, E, A> => {
    return Effect.suspendSucceed(effect().interruptStatus(this.flag))
  }

  force = <R, E, A>(
    effect: LazyArg<Effect<R, E, A>>,
    __tsplusTrace?: string
  ): Effect<R, E, A> => {
    return Effect.suspendSucceed(
      this.flag.isUninterruptible
        ? effect().uninterruptible().disconnect().interruptible()
        : effect().interruptStatus(this.flag)
    )
  }
}

// -----------------------------------------------------------------------------
// Operations
// -----------------------------------------------------------------------------

/**
 * Returns an effect that is interrupted by the current fiber
 *
 * @tsplus static ets/Effect/Ops interrupt
 */
export const interrupt = Effect.fiberId.flatMap((fiberId) => Effect.interruptAs(fiberId))

/**
 * Switches the interrupt status for this effect. If `true` is used, then the
 * effect becomes interruptible (the default), while if `false` is used, then
 * the effect becomes uninterruptible. These changes are compositional, so
 * they only affect regions of the effect.
 *
 * @tsplus fluent ets/Effect interruptStatus
 */
export function interruptStatus_<R, E, A>(
  self: Effect<R, E, A>,
  flag: LazyArg<InterruptStatus>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return new IInterruptStatus(self, flag, __tsplusTrace)
}

/**
 * Switches the interrupt status for this effect. If `true` is used, then the
 * effect becomes interruptible (the default), while if `false` is used, then
 * the effect becomes uninterruptible. These changes are compositional, so
 * they only affect regions of the effect.
 *
 * @tsplus static ets/Effect/Aspects interruptStatus
 */
export const interruptStatus = Pipeable(interruptStatus_)

/**
 * Returns a new effect that performs the same operations as this effect, but
 * interruptibly, even if composed inside of an uninterruptible region.
 *
 * Note that effects are interruptible by default, so this function only has
 * meaning if used within an uninterruptible region.
 *
 * **WARNING**: This operator "punches holes" into effects, allowing them to be
 * interrupted in unexpected places. Do not use this operator unless you know
 * exactly what you are doing. Instead, you should use `uninterruptibleMask`.
 *
 * @tsplus fluent ets/Effect interruptible
 */
export function interruptible<R, E, A>(
  self: Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return self.interruptStatus(InterruptStatus.Interruptible)
}

/**
 * Performs this effect uninterruptibly. This will prevent the effect from
 * being terminated externally, but the effect may fail for internal reasons
 * (e.g. an uncaught error) or terminate due to defect.
 *
 * Uninterruptible effects may recover from all failure causes (including
 * interruption of an inner effect that has been made interruptible).
 *
 * @tsplus fluent ets/Effect uninterruptible
 */
export function uninterruptible<R, E, A>(
  self: Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return self.interruptStatus(InterruptStatus.Uninterruptible)
}

/**
 * Checks the interrupt status, and produces the effect returned by the
 * specified callback.
 *
 * @tsplus static ets/Effect/Ops checkInterruptible
 */
export function checkInterruptible<R, E, A>(
  f: (interruptStatus: InterruptStatus) => Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return new ICheckInterrupt(f, __tsplusTrace)
}

/**
 * Makes the effect interruptible, but passes it a restore function that can
 * be used to restore the inherited interruptibility from whatever region the
 * effect is composed into.
 *
 * @tsplus static ets/Effect/Ops interruptibleMask
 */
export function interruptibleMask<R, E, A>(
  f: (statusRestore: InterruptStatusRestore) => Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return checkInterruptible((flag) => f(new InterruptStatusRestoreImpl(flag)).interruptible())
}

/**
 * Makes the effect uninterruptible, but passes it a restore function that can
 * be used to restore the inherited interruptibility from whatever region the
 * effect is composed into.
 *
 * @tsplus static ets/Effect/Ops uninterruptibleMask
 */
export function uninterruptibleMask<R, E, A>(
  f: (statusRestore: InterruptStatusRestore) => Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return checkInterruptible((flag) => f(new InterruptStatusRestoreImpl(flag)).uninterruptible())
}

/**
 * Returns an effect whose interruption will be disconnected from the
 * fiber's own interruption, being performed in the background without
 * slowing down the fiber's interruption.
 *
 * This method is useful to create "fast interrupting" effects. For
 * example, if you call this on a bracketed effect, then even if the
 * effect is "stuck" in acquire or release, its interruption will return
 * immediately, while the acquire / release are performed in the
 * background.
 *
 * See timeout and race for other applications.
 *
 * @tsplus fluent ets/Effect disconnect
 */
export function disconnect<R, E, A>(
  effect: Effect<R, E, A>,
  __tsplusTrace?: string
): Effect<R, E, A> {
  return uninterruptibleMask(({ restore }) =>
    Do(($) => {
      const id = $(Effect.fiberId)
      const fiber = $(restore(effect).forkDaemon())
      return $(restore(fiber.join()).onInterrupt(() => fiber.interruptAs(id).forkDaemon()))
    })
  )
}

/**
 * Calls the specified function, and runs the effect it returns, if this
 * effect is interrupted.
 *
 * @tsplus fluent ets/Effect onInterrupt
 */
export function onInterrupt_<R, E, A, R2, X>(
  self: Effect<R, E, A>,
  cleanup: (interruptors: HashSet<FiberId>) => Effect<R2, never, X>,
  __tsplusTrace?: string
): Effect<R | R2, E, A> {
  return Effect.uninterruptibleMask(({ restore }) =>
    restore(self).foldCauseEffect(
      (cause) =>
        cause.isInterrupted()
          ? cleanup(cause.interruptors()) > Effect.failCauseNow(cause)
          : Effect.failCauseNow(cause),
      Effect.succeedNow
    )
  )
}

/**
 * Calls the specified function, and runs the effect it returns, if this
 * effect is interrupted.
 *
 * @tsplus static ets/Effect/Aspects onInterrupt
 */
export const onInterrupt = Pipeable(onInterrupt_)

/**
 * Calls the specified function, and runs the effect it returns, if this
 * effect is interrupted (allows for expanding error).
 *
 * @tsplus fluent ets/Effect onInterruptPolymorphic
 */
export function onInterruptPolymorphic_<R, E, A, R2, E2, X>(
  self: Effect<R, E, A>,
  cleanup: (interruptors: HashSet<FiberId>) => Effect<R2, E2, X>,
  __tsplusTrace?: string
): Effect<R | R2, E | E2, A> {
  return Effect.uninterruptibleMask(({ restore }) =>
    restore(self).foldCauseEffect(
      (cause) =>
        cause.isInterrupted()
          ? cleanup(cause.interruptors()).foldCauseEffect(
            (_) => Effect.failCauseNow(_),
            () => Effect.failCauseNow(cause)
          )
          : Effect.failCauseNow(cause),
      Effect.succeedNow
    )
  )
}

/**
 * Calls the specified function, and runs the effect it returns, if this
 * effect is interrupted (allows for expanding error).
 *
 * @tsplus static ets/Effect/Aspects onInterruptPolymorphic
 */
export const onInterruptPolymorphic = Pipeable(onInterruptPolymorphic_)

/**
 * Returns an effect that is interrupted as if by the specified fiber.
 *
 * @tsplus static ets/Effect/Ops interruptAs
 */
export function interruptAs(fiberId: LazyArg<FiberId>, __tsplusTrace?: string) {
  return Effect.failCause(Cause.interrupt(fiberId()))
}
