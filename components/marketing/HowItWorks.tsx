'use client'
import React from 'react'
import styles from './HowItWorks.module.css'

const STEPS = [
  { num: '01', title: 'Book online', desc: 'Select your property type, preferred date and pay securely. Takes 2 minutes.', note: 'Takes 2 minutes', icon: '📅' },
  { num: '02', title: 'We visit your property', desc: 'A fully accredited RdSAP 10 assessor visits and carries out a thorough on-site assessment.', note: '30–60 min assessment', icon: '🏡' },
  { num: '03', title: 'Certificate issued', desc: 'Your EPC is lodged on the national database and emailed to you — ready to use.', note: 'Within 24 hours', icon: '📋' },
]

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Simple process</p>
        <h2 className={styles.h2}>Three steps to certified</h2>
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepContent}>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                <span className={styles.stepNote}>{step.note}</span>
              </div>
              {i < STEPS.length - 1 && <div className={styles.connector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
