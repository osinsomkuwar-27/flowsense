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
    <footer className="relative overflow-hidden bg-[#f8f9fd] border-t border-slate-100 text-[#0f172a]">
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-10 lg:px-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-[#6f7bd2]/30 bg-[#6f7bd2]/10 px-4 py-1.5 text-sm font-medium text-[#6f7bd2]">
              Continuous Intelligence
            </span>

            <h2 className="text-4xl leading-tight font-display tracking-tight lg:text-5xl text-[#0f172a]">
              Your DevOps pulse,
              <br />
              always visible.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-[#64748b]">
              FlowSense monitors your development workflows, detects anomalies, and suggests AI-powered fixes — so your team can ship with confidence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0f172a]/50">
                  {category}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#64748b] transition-colors hover:text-[#0f172a]"
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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <BrandLogo iconSize={18} />
          <p className="text-xs text-[#64748b]/80">
            © {new Date().getFullYear()} FlowSense. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
