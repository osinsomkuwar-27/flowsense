"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/ui/brand-logo"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = [
    { label: "Home", href: "/#home" },
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Integrations", href: "/#integrations" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-[1280px] px-4 pt-3 sm:px-6">
      <div
        className={`rounded-2xl px-4 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border-white/50 bg-white/88 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl"
            : "border-transparent bg-transparent shadow-none backdrop-blur-none"
        }`}
      >
        <div className="mx-auto flex items-center justify-between">
          <BrandLogo whiteIcon={!scrolled} />

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  scrolled
                    ? "text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0F172A]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="hidden sm:inline-flex"
              >
                Get Started
              </Button>
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden rounded-lg p-1.5 ${
                scrolled ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-3 pb-2 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  scrolled
                    ? "text-[#334155] hover:bg-[#f1f5f9]"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 px-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
