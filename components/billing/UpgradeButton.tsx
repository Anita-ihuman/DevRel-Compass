import { PLAN } from '@/lib/plan'

// Placeholder for the upgrade call to action. There is no payment provider
// wired up right now, so this renders a disabled button instead of starting a
// checkout. Swap the body for a real checkout call when a provider is added.
export default function UpgradeButton({
  className = 'profile-plan-link',
}: {
  className?: string
}) {
  return (
    <button className={className} disabled aria-disabled="true">
      {PLAN.name} coming soon
    </button>
  )
}
