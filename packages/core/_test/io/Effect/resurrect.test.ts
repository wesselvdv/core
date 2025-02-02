describe.concurrent("Effect", () => {
  describe.concurrent("resurrect", () => {
    it("should fail checked", async () => {
      const error = new Error("fail")
      const program = Effect.fail(error).asUnit().orDie().resurrect().either()

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == Either.left(error))
    })
  })
})
