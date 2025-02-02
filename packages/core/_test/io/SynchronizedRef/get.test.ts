import { State } from "@effect/core/test/io/SynchronizedRef/test-utils"

const current = "value"
const update = "new value"
const failure = "failure"

describe.concurrent("SynchronizedRef", () => {
  describe.concurrent("simple", () => {
    it("get", async () => {
      const program = SynchronizedRef.make(current).flatMap((ref) => ref.get())

      const result = await program.unsafeRunPromise()

      assert.strictEqual(result, current)
    })
  })

  describe.concurrent("getAndUpdateEffect", () => {
    it("happy path", async () => {
      const program = Effect.Do()
        .bind("ref", () => SynchronizedRef.make(current))
        .bind("v1", ({ ref }) => ref.getAndUpdateEffect(() => Effect.succeed(update)))
        .bind("v2", ({ ref }) => ref.get())

      const { v1, v2 } = await program.unsafeRunPromise()

      assert.strictEqual(v1, current)
      assert.strictEqual(v2, update)
    })

    it("with failure", async () => {
      const program = SynchronizedRef.make(current).flatMap((ref) => ref.getAndUpdateEffect(() => Effect.fail(failure)))

      const result = await program.unsafeRunPromiseExit()

      assert.isTrue(result.untraced() == Exit.fail(failure))
    })
  })

  describe.concurrent("getAndUpdateSomeEffect", () => {
    it("happy path", async () => {
      const program = Effect.Do()
        .bind("ref", () => SynchronizedRef.make<State>(State.Active))
        .bind(
          "v1",
          ({ ref }) =>
            ref.getAndUpdateSomeEffect((state) =>
              state.isClosed() ? Option.some(Effect.succeed(State.Changed)) : Option.none
            )
        )
        .bind("v2", ({ ref }) => ref.get())

      const { v1, v2 } = await program.unsafeRunPromise()

      assert.deepEqual(v1, State.Active)
      assert.deepEqual(v2, State.Active)
    })

    it("twice", async () => {
      const program = Effect.Do()
        .bind("ref", () => SynchronizedRef.make<State>(State.Active))
        .bind(
          "v1",
          ({ ref }) =>
            ref.getAndUpdateSomeEffect((state) =>
              state.isActive() ? Option.some(Effect.succeed(State.Changed)) : Option.none
            )
        )
        .bind("v2", ({ ref }) =>
          ref.getAndUpdateSomeEffect((state) =>
            state.isClosed()
              ? Option.some(Effect.succeed(State.Active))
              : state.isChanged()
              ? Option.some(Effect.succeed(State.Closed))
              : Option.none
          ))
        .bind("v3", ({ ref }) => ref.get())

      const { v1, v2, v3 } = await program.unsafeRunPromise()

      assert.deepEqual(v1, State.Active)
      assert.deepEqual(v2, State.Changed)
      assert.deepEqual(v3, State.Closed)
    })

    it("with failure", async () => {
      const program = SynchronizedRef.make<State>(State.Active).flatMap((ref) =>
        ref.getAndUpdateSomeEffect((state) => state.isActive() ? Option.some(Effect.fail(failure)) : Option.none)
      )

      const result = await program.unsafeRunPromiseExit()

      assert.isTrue(result.untraced() == Exit.fail(failure))
    })

    it("interrupt parent fiber and update", async () => {
      const program = Effect.Do()
        .bind("deferred", () => Deferred.make<never, SynchronizedRef<State>>())
        .bind("latch", () => Deferred.make<never, void>())
        .bindValue(
          "makeAndWait",
          ({ deferred, latch }) => deferred.complete(SynchronizedRef.make<State>(State.Active)) > latch.await()
        )
        .bind("fiber", ({ makeAndWait }) => makeAndWait.fork())
        .bind("ref", ({ deferred }) => deferred.await())
        .tap(({ fiber }) => fiber.interrupt())
        .flatMap(({ ref }) => ref.updateAndGetEffect(() => Effect.succeed(State.Closed)))

      const result = await program.unsafeRunPromise()

      assert.deepEqual(result, State.Closed)
    })
  })
})
