'use client'
import React from 'react'
import { Calendar, Home, FileCheck } from 'lucide-react'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
  const steps = [
    { 
      num: '01', 
      title: 'Book online', 
      desc: 'Select your property type, preferred date and pay securely. Takes 2 minutes.', 
      note: 'Takes 2 minutes', 
      icon: <Calendar size={28} className={styles.icon} /> 
    },
    { 
      num: '02', 
      title: 'We visit your property', 
      desc: 'A fully accredited RdSAP 10 assessor visits and carries out a thorough on-site assessment.', 
      note: '30–60 min assessment', 
      icon: <Home size={28} className={styles.icon} /> 
    },
    { 
      num: '03', 
      title: 'Certificate issued', 
      desc: 'Your EPC is lodged on the national database and emailed to you — ready to use.', 
      note: 'Within 24 hours', 
      icon: <FileCheck size={28} className={styles.icon} /> 
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Simple process</p>
          <h2 className={styles.h2}>Three steps to certified</h2>
        </div>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img src="/how-it-works.jpg" alt="Professional assessor visiting a beautifully lit modern home" className={styles.image} />
            </div>
          </div>
          <div className={styles.stepsCol}>
            <div className={styles.steps}>
              {steps.map((step, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <div className={styles.stepContent}>
                    <span className={styles.stepNum}>{step.num}</span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                    <span className={styles.stepNote}>{step.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
