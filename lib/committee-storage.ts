type AnyRecord = Record<string, any>

function parseJSON<T = any>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function stringifyJSON(value: any) {
  try {
    return JSON.stringify(value)
  } catch {
    return "[]"
  }
}

function matchesCommitteeId(obj: AnyRecord, committeeId: string) {
  const id = committeeId?.toLowerCase?.()
  // Try multiple common field names
  const candidates = [
    obj?.committeeId,
    obj?.committee_id,
    obj?.committeeID,
    obj?.id, // sometimes object is keyed just by 'id' for committee row
    obj?.committeeCode,
  ]
  return candidates.some((v) => String(v || "").toLowerCase() === id)
}

// Attempt to filter an array by committee id for many possible shapes.
function filterOutCommittee<T = AnyRecord>(raw: string | null, committeeId: string): string | null {
  const arr = parseJSON<any[]>(raw)
  if (!Array.isArray(arr)) return raw
  const filtered = arr.filter((row) => !matchesCommitteeId(row, committeeId))
  return stringifyJSON(filtered)
}

// Generic key patterns we will remove entirely if the key itself encodes the committee id.
const PER_COMMITTEE_KEY_PATTERNS = (committeeId: string) => [
  `committee:${committeeId}:`,
  `committee_${committeeId}`,
  `committee/${committeeId}`,
  `committees:${committeeId}:`,
  `committees_${committeeId}`,
  `committees/${committeeId}`,
  // add some generic prefixes used by prior versions
  `cmte:${committeeId}:`,
  `cmte_${committeeId}`,
  `cmte/${committeeId}`,
]

// Array keys where data for multiple committees is stored together.
// We'll parse and filter out rows belonging to committeeId.
const ARRAY_KEYS = [
  "committees",
  "committee_list",
  "committeeList",
  "members",
  "committeeMembers",
  "memberList",
  "transactions",
  "committeeTransactions",
  "payments",
  "committeePayments",
  "memberPayments",
  "cycles",
  "committeeCycles",
  "withdrawals",
  "committeeWithdrawals",
  "reports",
  "committeeReports",
  "monthlyData",
  "dues",
  "fees",
  "lateFees",
  "configs",
  "committeeConfigs",
  "ledger",
  "audits",
]

export function wipeCommitteeData(committeeId: string) {
  if (typeof window === "undefined") return

  const id = String(committeeId || "").trim()
  if (!id) return

  // 1) Remove per-committee keys based on known patterns or any key containing the id in a structured way.
  try {
    const patterns = PER_COMMITTEE_KEY_PATTERNS(id)
    const allKeys = Object.keys(localStorage)

    for (const key of allKeys) {
      const lowerKey = key.toLowerCase()
      const shouldRemove =
        // exact pattern matches
        patterns.some((p) => lowerKey.includes(p.toLowerCase())) ||
        // generic heuristics: keys that encode committee in name and include the id
        (lowerKey.includes("committee") && lowerKey.includes(id.toLowerCase()))
      if (shouldRemove) {
        localStorage.removeItem(key)
      }
    }
  } catch (e) {
    // swallow – best effort removal
  }

  // 2) Filter out from array-based stores (committees, payments, members, cycles, withdrawals, etc.)
  try {
    for (const k of ARRAY_KEYS) {
      const next = filterOutCommittee(localStorage.getItem(k), id)
      if (next !== null) localStorage.setItem(k, next)
    }
  } catch (e) {
    // ignore
  }

  // 3) Clear member/admin sessions pointing to this committee
  try {
    const memberSessionRaw = localStorage.getItem("member_session")
    const ms = parseJSON(memberSessionRaw)
    if (ms && matchesCommitteeId(ms, id)) {
      localStorage.removeItem("member_session")
    }
  } catch {}

  try {
    const adminSessionRaw = localStorage.getItem("admin_active_committee")
    const as = parseJSON(adminSessionRaw)
    if (as && matchesCommitteeId(as, id)) {
      localStorage.removeItem("admin_active_committee")
    }
  } catch {}

  // 4) Optional: broadcast a storage event manually so other open tabs update
  try {
    localStorage.setItem("__committee_wipe_ping__", Date.now().toString())
    localStorage.removeItem("__committee_wipe_ping__")
  } catch {}
}

export function wipeCommitteeAndRefresh(committeeId: string) {
  wipeCommitteeData(committeeId)
  // Reload current route to reflect changes immediately
  if (typeof window !== "undefined") {
    try {
      window.location.replace("/admin/committee") // back to main page
    } catch {
      window.location.href = "/admin/committee"
    }
  }
}
