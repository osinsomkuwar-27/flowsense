import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { colors } from "@/lib/colors"

export function BrandLogo({
  href = "/",
  iconSize = 24,
  whiteIcon = false,
}: {
  href?: string
  iconSize?: number
  whiteIcon?: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
      }}
      aria-label="FlowSense home"
    >
      <Logo size={iconSize} white={whiteIcon} />
    </Link>
  )
}
