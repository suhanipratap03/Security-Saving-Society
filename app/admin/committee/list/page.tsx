"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CommitteeListPageRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin/committee?tab=existing")
  }, [router])

  return null
}
