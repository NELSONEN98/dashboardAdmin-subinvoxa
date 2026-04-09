"use client"

import { UserButton } from "@clerk/nextjs"

export function Header({ title }: { title: string }) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  )
}
