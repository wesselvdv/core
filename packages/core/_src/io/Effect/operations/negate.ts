/**
 * Returns a new effect where boolean value of this effect is negated.
 *
 * @tsplus fluent ets/Effect negate
 */
export function negate<R, E>(
  self: Effect<R, E, boolean>,
  __tsplusTrace?: string
): Effect<R, E, boolean> {
  return self.map((b) => !b)
}
