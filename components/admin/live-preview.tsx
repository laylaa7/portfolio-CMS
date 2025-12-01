"use client"

import React from "react"

export function LivePreview({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="mt-4 border-2 p-4 rounded" style={{ borderColor: 'var(--preview-border)' }}>
        {children}
      </div>
    </div>
  )
}

export default LivePreview
