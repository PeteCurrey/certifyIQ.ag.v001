import React from 'react'
import styles from './SocialProof.module.css'

const TESTIMONIALS = [
  { 
    name: 'Sarah M.', 
    type: 'Homeowner · Sheffield', 
    rating: 5, 
    text: 'Fast, professional, and the assessor explained everything clearly. Certificate came through the next morning exactly as promised.' 
  },
  { 
    name: 'James R.', 
    type: 'Landlord · Chesterfield', 
    rating: 5, 
    text: 'I used Avorria for four of my rental properties. The bulk pricing saved me a significant amount and the turnaround was outstanding.' 
  },
  { 
    name: 'Premier Homes', 
    type: 'Estate Agent · Derby', 
    rating: 5, 
    text: 'We use Avorria as our preferred EPC provider. Fast, reliable, and the branded reports are a nice touch for our clients.' 
  },
]

function Stars({ count }: { count: number }) {
  return <div className={styles.stars}>{Array.from({ length: count }).map((_, i) => <span key={i}>★</span>)}</div>
}

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Client reviews</p>
            <h2 className={styles.h2}>What our clients say</h2>
          </div>
          <div className={styles.aggregate}>
            <div className={styles.aggStars}>★★★★★</div>
            <p className={styles.aggScore}>4.9 / 5</p>
            <p className={styles.aggCount}>Based on 120+ reviews</p>
          </div>
        </div>
        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.card}>
              <Stars count={t.rating} />
              <p className={styles.text}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.name[0]}</div>
                <div>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>{t.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
