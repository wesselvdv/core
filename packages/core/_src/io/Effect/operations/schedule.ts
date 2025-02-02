/**
 * Runs this effect according to the specified schedule.
 *
 * See `scheduleFrom` for a variant that allows the schedule's decision to
 * depend on the result of this effect.
 *
 * @tsplus fluent ets/Effect schedule
 */
export function schedule_<R, E, A, S, R1, A1>(
  self: Effect<R, E, A>,
  schedule: LazyArg<Schedule<S, R1, any, A1>>,
  __tsplusTrace?: string
): Effect<R | R1, E, A1> {
  return self.scheduleFrom(undefined, schedule)
}

/**
 * Runs this effect according to the specified schedule.
 *
 * See `scheduleFrom` for a variant that allows the schedule's decision to
 * depend on the result of this effect.
 *
 * @tsplus static ets/Effect/Aspects schedule
 */
export function schedule<S, R1, A1>(
  schedule: LazyArg<Schedule<S, R1, any, A1>>,
  __tsplusTrace?: string
): <R, E, A>(self: Effect<R, E, A>) => Effect<R | R1, E, A1> {
  return <R, E, A>(self: Effect<R, E, A>): Effect<R | R1, E, A1> => self.schedule(schedule)
}
