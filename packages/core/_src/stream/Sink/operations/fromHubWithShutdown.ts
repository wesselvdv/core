/**
 * Create a sink which publishes each element to the specified hub. The hub
 * will be shutdown once the stream is closed.
 *
 * @tsplus static ets/Sink/Ops fromHubWithShutdown
 */
export function fromHubWithShutdown<In>(
  hub: LazyArg<Hub<In>>,
  __tsplusTrace?: string
): Sink<never, never, In, never, void> {
  return Sink.fromQueueWithShutdown(hub)
}
