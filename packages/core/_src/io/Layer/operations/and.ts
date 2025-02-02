import { ILayerZipWithPar } from "@effect/core/io/Layer/definition"

/**
 * Combines this layer with the specified layer, producing a new layer that
 * has the inputs and outputs of both.
 *
 * @tsplus operator ets/Layer +
 * @tsplus fluent ets/Layer and
 */
export function and_<
  RIn,
  E,
  ROut,
  RIn2,
  E2,
  ROut2
>(
  self: Layer<RIn, E, ROut>,
  that: LazyArg<Layer<RIn2, E2, ROut2>>
): Layer<RIn | RIn2, E | E2, ROut | ROut2> {
  return Layer.suspend(new ILayerZipWithPar(self, that(), (a, b) => a.merge(b)))
}

/**
 * Combines this layer with the specified layer, producing a new layer that
 * has the inputs and outputs of both.
 *
 * @tsplus static ets/Layer/Aspects and
 */
export const and = Pipeable(and_)
