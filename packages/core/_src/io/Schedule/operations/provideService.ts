import { makeWithState } from "@effect/core/io/Schedule/operations/_internal/makeWithState"

/**
 * Returns a new schedule with the single service it requires provided to it.
 * If the schedule requires multiple services use `provideEnvironment`
 * instead.
 *
 * @tsplus fluent ets/Schedule provideService
 * @tsplus fluent ets/Schedule/WithState provideService
 */
export function provideService_<State, R, In, Out, T, T1 extends T>(
  self: Schedule<State, R | T, In, Out>,
  tag: Tag<T>,
  service: LazyArg<T1>
): Schedule<State, Exclude<R, T>, In, Out> {
  return makeWithState(
    self._initial,
    (now, input, state) =>
      Effect.environmentWithEffect((env: Env<Exclude<R, T>>) =>
        self
          ._step(now, input, state)
          .provideEnvironment(env.add(tag, service()))
      )
  )
}

/**
 * Returns a new schedule with the single service it requires provided to it.
 * If the schedule requires multiple services use `provideEnvironment`
 * instead.
 *
 * @tsplus static ets/Schedule/Aspects provideService
 */
export const provideService = Pipeable(provideService_)
