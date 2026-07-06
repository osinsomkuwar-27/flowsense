import Link from "next/link"
import { BrandLogo } from "@/components/ui/brand-logo"

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Integrations", href: "/#integrations" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(140%_120%_at_50%_100%,rgba(202,229,255,0.55)_0%,rgba(152,181,237,0.28)_28%,rgba(74,78,105,0.62)_54%,rgba(34,34,59,0.88)_100%)] text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[820px] -translate-x-1/2 rounded-full bg-[#64748B]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#8F2D56]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-10 lg:px-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/30 bg-white/12 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              Built for engineering teams
            </span>

            <h2 className="max-w-[14ch] text-4xl leading-tight font-display tracking-tight lg:text-5xl">
              Your DevOps pulse, always visible.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              FlowSense monitors your development workflows, detects anomalies, and suggests AI-powered fixes — so your team can ship with confidence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  {category}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
          <BrandLogo whiteIcon iconSize={18} />
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} FlowSense. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
