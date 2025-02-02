import { makeWithState } from "@effect/core/io/Schedule/operations/_internal/makeWithState"

/**
 * Returns a new schedule that maps the output of this schedule through the
 * specified effectful function.
 *
 * @tsplus fluent ets/Schedule mapEffect
 * @tsplus fluent ets/Schedule/WithState mapEffect
 */
export function mapEffect_<State, Env, In, Out, Env1, Out2>(
  self: Schedule<State, Env, In, Out>,
  f: (out: Out) => Effect.RIO<Env1, Out2>
): Schedule<State, Env | Env1, In, Out2> {
  return makeWithState(self._initial, (now, input, state) =>
    self
      ._step(now, input, state)
      .flatMap(({ tuple: [state, out, decision] }) => f(out).map((out2) => Tuple(state, out2, decision))))
}

/**
 * Returns a new schedule that maps the output of this schedule through the
 * specified effectful function.
 *
 * @tsplus static ets/Schedule/Aspects mapEffect
 */
export const mapEffect = Pipeable(mapEffect_)
