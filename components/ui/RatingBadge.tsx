import React from 'react'

type Rating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

interface RatingBadgeProps {
  rating: Rating | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ratingColors: Record<string, string> = {
  A: '#9BFF59',
  B: '#7ED321',
  C: '#B8E000',
  D: '#F5A623',
  E: '#E07020',
  F: '#D04020',
  G: '#A01010',
}

const sizes = {
  sm: { width: 32, height: 32, fontSize: '1rem' },
  md: { width: 40, height: 40, fontSize: '1.25rem' },
  lg: { width: 64, height: 64, fontSize: '2rem' },
}

export default function RatingBadge({ rating, size = 'md', className }: RatingBadgeProps) {
  const letter = (rating || 'G').toUpperCase()
  const bg = ratingColors[letter] || '#4A6280'
  const dim = sizes[size]
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        fontFamily: 'DM Mono, monospace',
        fontWeight: 500,
        color: '#000',
        background: bg,
        width: dim.width,
        height: dim.height,
        fontSize: dim.fontSize,
        flexShrink: 0,
      }}
    >
      {letter}
    </span>
  )
}
