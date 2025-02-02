/**
 * @tsplus static ets/Channel/Ops mergeAllUnbounded
 */
export function mergeAllUnbounded_<
  Env,
  Env1,
  InErr,
  InErr1,
  InElem,
  InElem1,
  InDone,
  InDone1,
  OutErr,
  OutErr1,
  OutElem
>(
  channels: Channel<
    Env,
    InErr,
    InElem,
    InDone,
    OutErr,
    Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem, unknown>,
    unknown
  >
): Channel<
  Env | Env1,
  InErr & InErr1,
  InElem & InElem1,
  InDone & InDone1,
  OutErr | OutErr1,
  OutElem,
  unknown
> {
  return Channel.mergeAllWith(channels, Number.MAX_SAFE_INTEGER, () => undefined)
}

/**
 * @tsplus static ets/Channel/Aspects mergeAllUnbounded
 */
export const mergeAllUnbounded = Pipeable(mergeAllUnbounded_)
