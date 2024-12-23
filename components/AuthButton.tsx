'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
        Sign out
      </Button>
    )
  }
  return (
    <Button onClick={() => signIn("discord")} variant="outline" className="bg-indigo-500 hover:bg-indigo-600 text-white">
      Sign in with Discord
    </Button>
  )
}

