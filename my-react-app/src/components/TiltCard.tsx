import type { ReactNode } from 'react'

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={`tilt-card ${className ?? ''}`.trim()}>{children}</article>
}

export default TiltCard
