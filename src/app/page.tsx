import Link from 'next/link'
import { BrandMark } from '@/components/brand-mark'

/**
 * The bare origin gives guests their invitation links and staff their sign-in entry point.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-start justify-center gap-6 px-6 py-12">
      <BrandMark size="lg" />
      <div>
        <span className="type-eyebrow text-xs uppercase tracking-widest text-[var(--blue-ink)]">CHASE Auto Parts</span>
        <h1 className="font-serif text-4xl text-[var(--accent-ink)]">Gala 2026</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          An evening of recognition and celebration at The Grand Hall.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
        <h2 className="font-serif text-lg text-[var(--color-text)]">Guest Invitations</h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          In production, guests arrive via private links printed on their physical cards or sent via email:
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <Link
            href="/i/sample-token"
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--ground)] px-3 py-2 text-sm font-medium hover:border-[var(--color-accent)] transition-colors"
          >
            <span>Jordan Reyes (Reyes Party &middot; Table 4)</span>
            <span className="text-xs text-[var(--accent-ink)] font-mono">&rarr;</span>
          </Link>
          <Link
            href="/i/okafor-token"
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--ground)] px-3 py-2 text-sm font-medium hover:border-[var(--color-accent)] transition-colors"
          >
            <span>Ada Okafor (Okafor Party &middot; Table 7)</span>
            <span className="text-xs text-[var(--accent-ink)] font-mono">&rarr;</span>
          </Link>
          <Link
            href="/i/lindqvist-token"
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--ground)] px-3 py-2 text-sm font-medium hover:border-[var(--color-accent)] transition-colors"
          >
            <span>Mira Lindqvist (Lindqvist Party &middot; Table 2)</span>
            <span className="text-xs text-[var(--accent-ink)] font-mono">&rarr;</span>
          </Link>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-lg text-[var(--color-text)]">Staff &amp; Admin</h2>
          <Link href="/admin/login" className="text-sm font-medium text-[var(--accent-ink)] underline underline-offset-4">
            Sign in &rarr;
          </Link>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Manage event configuration, agenda, meal choices, floor plans, and QR check-ins.
        </p>
        <div className="rounded bg-[var(--ground)] p-2.5 font-mono text-xs text-[var(--color-text-muted)]">
          <div><strong className="text-[var(--color-text)]">Email:</strong> owner@example.com</div>
          <div><strong className="text-[var(--color-text)]">Password:</strong> hunter2hunter2</div>
        </div>
      </div>
    </main>
  )
}
