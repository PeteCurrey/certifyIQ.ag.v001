'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { DollarSign, TrendingUp, Calendar, CreditCard, Sparkles } from 'lucide-react'
import styles from '../admin.module.css'

interface FinancialStat {
  month: string
  revenue: number
  jobsCount: number
}

export default function RevenuePage() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [monthlyStats, setMonthlyStats] = useState<FinancialStat[]>([])

  const supabase = createClient()

  useEffect(() => {
    async function loadFinancials() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('price_gbp, status, preferred_date, service_type')
          .neq('status', 'cancelled')
          .neq('status', 'refunded')

        if (error) throw error

        setBookings(data || [])

        // Group by month
        const monthlyGroups: Record<string, { revenue: number; jobsCount: number }> = {}

        ;(data || []).forEach(b => {
          if (!b.preferred_date) return
          const monthKey = b.preferred_date.slice(0, 7) // 'YYYY-MM'
          if (!monthlyGroups[monthKey]) {
            monthlyGroups[monthKey] = { revenue: 0, jobsCount: 0 }
          }
          monthlyGroups[monthKey].revenue += Number(b.price_gbp || 0)
          monthlyGroups[monthKey].jobsCount += 1
        })

        const sortedStats: FinancialStat[] = Object.entries(monthlyGroups)
          .map(([month, val]) => ({
            month,
            revenue: val.revenue,
            jobsCount: val.jobsCount,
          }))
          .sort((a, b) => a.month.localeCompare(b.month))

        setMonthlyStats(sortedStats)
      } catch (err) {
        console.error('Error loading revenue reports:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFinancials()
  }, [])

  // Overall stats
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.price_gbp || 0), 0)
  const averageTicket = bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : '0.00'

  // Service breakdown
  const serviceBreakdown: Record<string, { count: number; value: number }> = {}
  bookings.forEach(b => {
    const sType = b.service_type || 'domestic'
    if (!serviceBreakdown[sType]) {
      serviceBreakdown[sType] = { count: 0, value: 0 }
    }
    serviceBreakdown[sType].count += 1
    serviceBreakdown[sType].value += Number(b.price_gbp || 0)
  })

  // SVG Chart sizing
  const maxRevenue = monthlyStats.reduce((max, s) => Math.max(max, s.revenue), 100)
  const chartHeight = 160
  const chartWidth = 500

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Calculating financial projections...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header} style={{ marginBottom: '2.5rem' }}>
        <div>
          <span className={styles.eyebrow}>Assessor Desk</span>
          <h2>Financial Operations Dashboard</h2>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={styles.metricsRow} style={{ marginBottom: '2.5rem' }}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <DollarSign className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
            <span>Consolidated Revenue</span>
          </div>
          <div className={styles.metricValue}>£{totalRevenue.toLocaleString()}</div>
          <p className={styles.metricLabel}>Excludes cancelled/refunded bills</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <TrendingUp className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
            <span>Average Order Value</span>
          </div>
          <div className={styles.metricValue}>£{averageTicket}</div>
          <p className={styles.metricLabel}>Per lodged certificate</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <CreditCard className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
            <span>Total Sales Volume</span>
          </div>
          <div className={styles.metricValue}>{bookings.length}</div>
          <p className={styles.metricLabel}>Invoiced transactions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* SVG Revenue Chart */}
        <div className={styles.jobsCard}>
          <h3 className={styles.sectionTitle} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-lime)' }} />
            <span>Monthly Revenue Progress</span>
          </h3>

          {monthlyStats.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-secondary)' }}>
              No monthly sales data compiled yet.
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', padding: '10px' }}>
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                  const y = chartHeight - (val * (chartHeight - 40)) - 20
                  return (
                    <g key={idx}>
                      <line x1="50" y1={y} x2={chartWidth - 20} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <text x="10" y={y + 4} fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">
                        £{Math.round(val * maxRevenue)}
                      </text>
                    </g>
                  )
                })}

                {/* Bars */}
                {monthlyStats.map((stat, idx) => {
                  const barWidth = 35
                  const xGap = (chartWidth - 100) / monthlyStats.length
                  const x = 60 + (idx * xGap)
                  const height = (stat.revenue / maxRevenue) * (chartHeight - 40)
                  const y = chartHeight - height - 20

                  return (
                    <g key={idx}>
                      {/* Interactive hoverable bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        fill="var(--accent-lime)"
                        rx="4"
                        style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                        opacity="0.85"
                      />
                      
                      {/* X label */}
                      <text x={x + barWidth / 2} y={chartHeight - 4} fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                        {stat.month}
                      </text>

                      {/* Tooltip value */}
                      <text x={x + barWidth / 2} y={y - 6} fill="#fff" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">
                        £{Math.round(stat.revenue)}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Service Breakdown */}
        <div className={styles.jobsCard}>
          <h3 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Service Breakdown</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(serviceBreakdown).map(([srv, val]) => (
              <div key={srv} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ textTransform: 'capitalize', color: '#fff' }}>{srv.replace(/_/g, ' ')}</strong>
                  <span style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>£{val.value.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Count: {val.count} jobs</span>
                  <span>Avg: £{(val.value / val.count).toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
