'use client'

import { useEffect, useRef } from 'react'

// Dialog with the Substack sign-up form, so people can subscribe without
// leaving the page they're on. The owner controls `open` (the nav has one
// dialog shared by its desktop and mobile "Newsletter" buttons). The iframe is
// only mounted while the dialog is open, so Substack isn't loaded on every
// page view.
const SUBSTACK_EMBED_URL = 'https://anitaihuman.substack.com/embed'

export default function SubstackDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="substack-dialog"
      aria-labelledby="substack-dialog-title"
      onClose={onClose}
      // A click on the backdrop lands on the dialog element itself, outside the panel.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="substack-panel">
        <div className="substack-head">
          <h2 id="substack-dialog-title" className="substack-title">Subscribe to the newsletter</h2>
          <button type="button" className="substack-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {open && (
          <iframe
            src={SUBSTACK_EMBED_URL}
            title="Subscribe to the DevRel Compass newsletter on Substack"
            width="480"
            height="320"
            className="substack-frame"
            scrolling="no"
          />
        )}
      </div>
    </dialog>
  )
}
