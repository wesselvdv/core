import { Entry } from "@effect/core/stm/STM/Entry"
import type { Journal } from "@effect/core/stm/STM/Journal"

export function getOrMakeEntry<A>(self: TRef<A>, journal: Journal): Entry {
  if (journal.has(self)) {
    return journal.get(self)!
  }
  const entry = Entry(self, false)
  journal.set(self, entry)
  return entry
}
