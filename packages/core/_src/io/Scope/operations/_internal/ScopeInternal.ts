import type { Scope } from "@effect/core/io/Scope/definition"
import { ScopeSym } from "@effect/core/io/Scope/definition"

export class ScopeInternal implements Scope {
  readonly [ScopeSym]: ScopeSym = ScopeSym

  constructor(
    readonly _fork: Effect.UIO<Scope.Closeable>,
    readonly _addFinalizerExit: (finalizer: Scope.Finalizer) => Effect.UIO<void>
  ) {}
}

/**
 * @tsplus macro remove
 */
export function concreteScope(_: Scope): asserts _ is ScopeInternal {
  //
}
