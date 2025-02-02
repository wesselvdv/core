describe.concurrent("Effect", () => {
  describe.concurrent("validate", () => {
    it("returns all errors if never valid", async () => {
      const chunk = Chunk.fill(10, () => 0)
      const program = Effect.validate(chunk, Effect.failNow).flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })

    it("accumulate errors and ignore successes", async () => {
      const chunk = Chunk.range(0, 10)
      const program = Effect.validate(chunk, (n) => n % 2 === 0 ? Effect.succeed(n) : Effect.fail(n)).flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == Chunk(1, 3, 5, 7, 9))
    })

    it("accumulate successes", async () => {
      const chunk = Chunk.range(0, 10)
      const program = Effect.validate(chunk, Effect.succeedNow)

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })

    it("fails", async () => {
      const program = Effect.succeed(1).validate(Effect.fail(2)).sandbox().either()

      const result = await program.unsafeRunPromise()

      assert.isTrue(
        result.mapLeft((cause) => cause.untraced()) ==
          Either.left(Cause.fail(2))
      )
    })

    it("combines both cause", async () => {
      const program = Effect.fail(1).validate(Effect.fail(2)).sandbox().either()

      const result = await program.unsafeRunPromise()

      assert.isTrue(
        result.mapLeft((cause) => cause.untraced()) ==
          Either.left(Cause.fail(1) + Cause.fail(2))
      )
    })
  })

  describe.concurrent("validateDiscard", () => {
    it("returns all errors if never valid", async () => {
      const chunk = Chunk.fill(10, () => 0)
      const program = Effect.validateDiscard(chunk, Effect.failNow).flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })
  })

  describe.concurrent("validatePar", () => {
    it("returns all errors if never valid", async () => {
      const chunk = Chunk.fill(1000, () => 0)
      const program = Effect.validatePar(chunk, Effect.failNow).flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })

    it("accumulate errors and ignore successes", async () => {
      const chunk = Chunk.range(0, 10)
      const program = Effect.validatePar(chunk, (n) => n % 2 === 0 ? Effect.succeed(n) : Effect.fail(n)).flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == Chunk(1, 3, 5, 7, 9))
    })

    it("accumulate successes", async () => {
      const chunk = Chunk.range(0, 10)
      const program = Effect.validatePar(chunk, Effect.succeedNow)

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })
  })

  describe.concurrent("validateParDiscard", () => {
    it("returns all errors if never valid", async () => {
      const chunk = Chunk.fill(10, () => 0)
      const program = Effect.validateParDiscard(chunk, Effect.failNow).flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })
  })

  describe.concurrent("validateFirst", () => {
    it("returns all errors if never valid", async () => {
      const chunk = Chunk.fill(10, () => 0)
      const program = Effect.validateFirst(chunk, Effect.failNow)
        .flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })

    it("runs sequentially and short circuits on first success validation", async () => {
      function f(n: number): Effect.IO<number, number> {
        return n === 6 ? Effect.succeed(n) : Effect.fail(n)
      }

      const chunk = Chunk.range(1, 10)
      const program = Effect.Do()
        .bind("counter", () => Ref.make<number>(0))
        .bind("result", ({ counter }) => Effect.validateFirst(chunk, (n) => counter.update((n) => n + 1) > f(n)))
        .bind("count", ({ counter }) => counter.get())

      const { count, result } = await program.unsafeRunPromise()

      assert.strictEqual(result, 6)
      assert.strictEqual(count, 6)
    })

    it("returns errors in correct order", async () => {
      const list = List(2, 4, 6, 3, 5, 6)
      const program = Effect.validateFirst(list, Effect.failNow)
        .flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == Chunk(2, 4, 6, 3, 5, 6))
    })
  })

  describe.concurrent("validateFirstPar", () => {
    it("returns all errors if never valid", async () => {
      const chunk = Chunk.fill(1000, () => 0)
      const program = Effect.validateFirstPar(chunk, Effect.failNow)
        .flip()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == chunk)
    })

    it("returns success if valid", async () => {
      function f(n: number): Effect.IO<number, number> {
        return n === 6 ? Effect.succeed(n) : Effect.fail(n)
      }

      const chunk = Chunk.range(1, 10)
      const program = Effect.validateFirstPar(chunk, f)

      const result = await program.unsafeRunPromise()

      assert.strictEqual(result, 6)
    })
  })

  describe.concurrent("validateWith", () => {
    it("succeeds", async () => {
      const program = Effect.succeed(1).validateWith(Effect.succeed(2), (a, b) => a + b)

      const result = await program.unsafeRunPromise()

      assert.strictEqual(result, 3)
    })
  })
})
