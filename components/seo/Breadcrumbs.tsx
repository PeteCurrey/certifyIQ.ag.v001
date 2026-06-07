import React from 'react'
import Link from 'next/link'
import { BreadcrumbSchema, Crumb } from './BreadcrumbSchema'

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (!crumbs || crumbs.length === 0) return null

  // Ensure "Home" is always the first crumb logically
  const fullCrumbs = crumbs[0].name === 'Home' 
    ? crumbs 
    : [{ name: 'Home', url: '/' }, ...crumbs]

  return (
    <>
      <BreadcrumbSchema crumbs={fullCrumbs} />
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
        <ol style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0, 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          {fullCrumbs.map((crumb, index) => {
            const isLast = index === fullCrumbs.length - 1
            return (
              <li key={crumb.url} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isLast ? (
                  <span style={{ color: 'var(--text-secondary)' }} aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.url} style={{ color: 'var(--accent-lime)', textDecoration: 'none' }}>
                      {crumb.name}
                    </Link>
                    <span>/</span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
