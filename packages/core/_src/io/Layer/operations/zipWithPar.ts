import { ILayerZipWithPar } from "@effect/core/io/Layer/definition"

/**
 * Combines this layer the specified layer, producing a new layer that has the
 * inputs of both, and the outputs of both combined using the specified
 * function.
 *
 * @tsplus fluent ets/Layer zipWithPar
 */
export function zipWithPar_<R, E, A, R1, E1, A1, A2>(
  self: Layer<R, E, A>,
  that: LazyArg<Layer<R1, E1, A1>>,
  f: (a: Env<A>, b: Env<A1>) => Env<A2>
): Layer<R | R1, E | E1, A2> {
  return Layer.suspend(new ILayerZipWithPar(self, that(), f))
}

/**
 * Combines this layer the specified layer, producing a new layer that has the
 * inputs of both, and the outputs of both combined using the specified
 * function.
 *
 * @tsplus static ets/Layer/Aspects zipWithPar
 */
export const zipWithPar = Pipeable(zipWithPar_)
