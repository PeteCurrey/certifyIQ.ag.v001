'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, AlertTriangle, CheckCircle, Clock, 
  Building2, FileText, Plus, ChevronRight, ArrowUpRight,
  Shield, Zap, Activity, Calendar
} from 'lucide-react'
import styles from './dashboard.module.css'

// Mock data for visual demonstration
const STATS = [
  { label: 'Total Properties', value: '47', sub: '+3 this month', icon: Building2, color: '#9BFF59', bg: 'rgba(155,255,89,0.1)' },
  { label: 'Compliance Score', value: '78%', sub: '↑ 4% from last month', icon: Shield, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  { label: 'Upcoming Expiries', value: '12', sub: 'Next 90 days', icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  { label: 'Outstanding Actions', value: '8', sub: '3 urgent', icon: AlertTriangle, color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
]

const RISK_PROPERTIES = [
  { address: '14 Mill Lane, Derby DE1 3EF', type: 'Terraced', score: 32, risk: 'High', expiry: 'EPC expired 45 days ago', expColor: '#F87171' },
  { address: '7 Oak Street, Chesterfield S40 2JL', type: 'Semi-Detached', score: 48, risk: 'Medium', expiry: 'Gas Safety expires in 18 days', expColor: '#F59E0B' },
  { address: 'Unit 4, Industrial Park, Sheffield S1 2FF', type: 'Commercial', score: 41, risk: 'High', expiry: 'Commercial EPC expires in 12 days', expColor: '#F87171' },
  { address: '22 Victoria Road, Matlock DE4 3BT', type: 'Detached', score: 55, risk: 'Medium', expiry: 'EICR expires in 28 days', expColor: '#F59E0B' },
]

const TIMELINE_ITEMS = [
  { date: 'Jun 12', label: 'Gas Safety — 7 Oak Street', status: 'urgent', days: 7 },
  { date: 'Jun 20', label: 'EICR — 22 Victoria Road', status: 'warning', days: 15 },
  { date: 'Jul 5', label: 'EPC — 31 Beech Drive', status: 'upcoming', days: 30 },
  { date: 'Jul 18', label: 'Fire Risk — Unit 4 Sheffield', status: 'upcoming', days: 43 },
  { date: 'Aug 1', label: 'EPC — 103 Lime Street', status: 'ok', days: 57 },
  { date: 'Sep 10', label: 'SAP Calc — Plot 7 Meadowbrook', status: 'ok', days: 97 },
]

const RECENT_TASKS = [
  { title: 'Renew EPC at 14 Mill Lane', priority: 'Critical', service: 'EPC' },
  { title: 'Book Gas Safety at 7 Oak Street', priority: 'Urgent', service: 'Gas Safety' },
  { title: 'Upload missing Fire Risk Assessment', priority: 'High', service: 'Fire Risk' },
  { title: 'Book EICR at 22 Victoria Road', priority: 'Medium', service: 'EICR' },
]

function ComplianceGauge({ score }: { score: number }) {
  const angle = (score / 100) * 180 - 90
  const color = score >= 70 ? '#9BFF59' : score >= 45 ? '#F59E0B' : '#F87171'
  
  return (
    <div className={styles.gaugeContainer}>
      <svg width="160" height="90" viewBox="0 0 160 90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#9BFF59" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <path d="M 15 80 A 65 65 0 0 1 145 80" fill="none" stroke="#1E2D4A" strokeWidth="12" strokeLinecap="round" />
        {/* Color track */}
        <path d="M 15 80 A 65 65 0 0 1 145 80" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" />
        {/* Needle */}
        <g transform={`rotate(${angle}, 80, 80)`}>
          <line x1="80" y1="80" x2="80" y2="25" stroke="#E8F4FF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="80" r="5" fill={color} />
        </g>
      </svg>
      <div className={styles.gaugeScore} style={{ color }}>{score}%</div>
      <div className={styles.gaugeLabel}>Portfolio Compliance</div>
    </div>
  )
}

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  return (
    <div className={styles.dashboardPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Compliance Dashboard</h1>
          <p className={styles.pageSubtitle}>Thursday, 5 June 2026 — Portfolio overview for John Smith</p>
        </div>
        <Link href="/dashboard/properties/add" className={styles.addPropBtn}>
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {/* Top Stats Row */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: stat.bg }}>
                <Icon size={22} color={stat.color} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statSub}>{stat.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main 2-column layout */}
      <div className={styles.mainGrid}>
        {/* Left: Risk Properties + Tasks */}
        <div className={styles.leftCol}>

          {/* AI Insight Banner */}
          <div className={styles.aiBanner}>
            <div className={styles.aiBannerLeft}>
              <span className={styles.aiPulse}></span>
              <span className={styles.aiBannerIcon}>✨</span>
              <div>
                <p className={styles.aiBannerTitle}>AI Compliance Alert</p>
                <p className={styles.aiBannerText}>14 Mill Lane has an expired EPC (45 days overdue). This property cannot legally be re-let until the certificate is renewed. Book today to resolve this.</p>
              </div>
            </div>
            <Link href="/dashboard/ai-assistant" className={styles.aiBannerCta}>Open AI Assistant <ArrowUpRight size={14} /></Link>
          </div>

          {/* High Risk Properties */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><AlertTriangle size={18} color="#F87171" /> Risk Properties</h2>
              <Link href="/dashboard/risks" className={styles.viewAll}>View all <ChevronRight size={14} /></Link>
            </div>
            <div className={styles.riskList}>
              {RISK_PROPERTIES.map((p, i) => (
                <div key={i} className={styles.riskItem}>
                  <div className={styles.riskScore} style={{ 
                    borderColor: p.score < 45 ? '#F87171' : '#F59E0B',
                    color: p.score < 45 ? '#F87171' : '#F59E0B' 
                  }}>
                    {p.score}
                  </div>
                  <div className={styles.riskInfo}>
                    <p className={styles.riskAddress}>{p.address}</p>
                    <p className={styles.riskType}>{p.type}</p>
                    <p className={styles.riskExpiry} style={{ color: p.expColor }}>{p.expiry}</p>
                  </div>
                  <div className={styles.riskBadge} data-risk={p.risk.toLowerCase()}>{p.risk}</div>
                  <Link href="/dashboard/properties/1" className={styles.riskAction}>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Tasks */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Zap size={18} color="#9BFF59" /> Outstanding Tasks</h2>
              <Link href="/dashboard/tasks" className={styles.viewAll}>View all <ChevronRight size={14} /></Link>
            </div>
            <div className={styles.taskList}>
              {RECENT_TASKS.map((task, i) => (
                <div key={i} className={styles.taskItem}>
                  <div className={styles.taskDot} data-priority={task.priority.toLowerCase()}></div>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskTitle}>{task.title}</p>
                    <span className={styles.taskService}>{task.service}</span>
                  </div>
                  <span className={styles.taskPriority} data-priority={task.priority.toLowerCase()}>{task.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Gauge + Timeline */}
        <div className={styles.rightCol}>

          {/* Compliance Score Card */}
          <div className={`${styles.card} ${styles.gaugeCard}`}>
            <ComplianceGauge score={78} />
            <div className={styles.gaugeBreakdown}>
              <div className={styles.gaugeItem}>
                <CheckCircle size={14} color="#9BFF59" />
                <span>32 properties compliant</span>
              </div>
              <div className={styles.gaugeItem}>
                <Clock size={14} color="#F59E0B" />
                <span>9 at risk within 90 days</span>
              </div>
              <div className={styles.gaugeItem}>
                <AlertTriangle size={14} color="#F87171" />
                <span>6 with expired certificates</span>
              </div>
            </div>
          </div>

          {/* Compliance Timeline */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Calendar size={18} color="#60A5FA" /> Compliance Timeline</h2>
            </div>
            <div className={styles.timeline}>
              {TIMELINE_ITEMS.map((item, i) => (
                <div key={i} className={`${styles.timelineItem} ${styles[item.status]}`}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineDate}>{item.date}</div>
                  <div className={styles.timelineLabel}>{item.label}</div>
                  <div className={styles.timelineDays} data-status={item.status}>
                    {item.days < 14 ? `${item.days}d` : `${Math.round(item.days / 7)}w`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Book */}
          <div className={`${styles.card} ${styles.quickBookCard}`}>
            <h3 className={styles.quickBookTitle}>Quick Book a Service</h3>
            <div className={styles.quickBookGrid}>
              {['EPC', 'SAP Calc', 'Air Test', 'EICR', 'Gas Safety', 'Commercial EPC'].map(svc => (
                <Link key={svc} href={`/book?service=${svc}`} className={styles.quickBookBtn}>{svc}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
