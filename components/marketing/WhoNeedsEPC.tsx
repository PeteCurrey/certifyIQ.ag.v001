import React from 'react'
import styles from './WhoNeedsEPC.module.css'

const CARDS = [
  {
    icon: '🏠',
    title: 'Homeowners selling',
    subtitle: 'Required by law',
    body: 'A valid EPC is required before listing your property for sale. Marketing a home without one can result in fines up to £1,000.',
    badge: 'Mandatory',
    badgeColor: '#FF5C5C',
  },
  {
    icon: '🔑',
    title: 'Landlords',
    subtitle: 'Rental compliance',
    body: 'Properties must have a minimum E rating to rent legally today. From 2028, a minimum C rating will be required — plan ahead now.',
    badge: 'C rating from 2028',
    badgeColor: '#F5A623',
  },
  {
    icon: '🏢',
    title: 'Estate agents',
    subtitle: 'Bulk & portfolio orders',
    body: 'We offer bulk ordering and fast turnaround for agents managing multiple listings. Agent portal with branded reports available.',
    badge: 'Bulk discounts',
    badgeColor: '#9BFF59',
  },
  {
    icon: '👷',
    title: 'Developers & Builders',
    subtitle: 'New builds & SAP',
    body: 'SAP calculations and On-Construction EPCs are mandatory for all new builds. We support developers from the design stage through to final completion.',
    badge: 'New Build',
    badgeColor: '#60A5FA',
  },
  {
    icon: '🏢',
    title: 'Commercial Landlords',
    subtitle: 'MEES compliance',
    body: 'MEES regulations require a minimum EPC band C by April 2027, rising to band B by 2030. Act now to ensure your portfolio remains rentable.',
    badge: 'Band C by 2027',
    badgeColor: '#F5A623',
  },
]

export default function WhoNeedsEPC() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Who needs an EPC?</p>
        <h2 className={styles.h2}>Required by law in more situations than you might think</h2>
        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{card.icon}</span>
                <span className={styles.badge} style={{ background: card.badgeColor + '22', color: card.badgeColor, border: `1px solid ${card.badgeColor}44` }}>{card.badge}</span>
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <p className={styles.cardBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
