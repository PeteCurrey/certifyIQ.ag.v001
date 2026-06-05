'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { UserPlus, Mail, Phone, Calendar, ShieldCheck, ShieldAlert, Award } from 'lucide-react'
import styles from '../admin.module.css'

interface Assessor {
  id: string
  full_name: string
  email: string
  phone: string
  accreditation_body: string
  accreditation_number: string
  accreditation_expiry: string
  service_area_postcodes: string[]
  is_active: boolean
}

export default function TeamPage() {
  const [assessors, setAssessors] = useState<Assessor[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  
  // New Assessor state
  const [newAssessor, setNewAssessor] = useState({
    fullName: '',
    email: '',
    phone: '',
    body: 'elmhurst',
    number: '',
    expiry: '',
    postcodes: '',
  })

  const supabase = createClient()

  useEffect(() => {
    async function loadTeam() {
      try {
        const { data, error } = await supabase
          .from('assessors')
          .select('*')
          .order('full_name', { ascending: true })

        if (error) throw error
        setAssessors(data || [])
      } catch (err) {
        console.error('Failed to load assessors team:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTeam()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('assessors')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setAssessors(prev => prev.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a))
    } catch (err) {
      console.error(err)
      alert('Failed to update assessor status')
    }
  }

  const handleCreateAssessor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const postcodeArr = newAssessor.postcodes
        .split(',')
        .map(p => p.trim().toUpperCase())
        .filter(p => p.length > 0)

      const { data, error } = await supabase
        .from('assessors')
        .insert({
          full_name: newAssessor.fullName,
          email: newAssessor.email,
          phone: newAssessor.phone,
          accreditation_body: newAssessor.body,
          accreditation_number: newAssessor.number,
          accreditation_expiry: newAssessor.expiry,
          service_area_postcodes: postcodeArr,
          is_active: true,
        })
        .select('*')
        .single()

      if (error) throw error

      setAssessors(prev => [...prev, data])
      setInviteModalOpen(false)
      setNewAssessor({
        fullName: '',
        email: '',
        phone: '',
        body: 'elmhurst',
        number: '',
        expiry: '',
        postcodes: '',
      })
    } catch (err: any) {
      console.error(err)
      alert('Failed to register assessor: ' + err.message)
    }
  }

  const checkExpiryWarning = (expiryDateStr: string) => {
    const today = new Date()
    const expiry = new Date(expiryDateStr)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return { level: 'expired', msg: 'Accreditation EXPIRED' }
    if (diffDays <= 30) return { level: 'warning', msg: `Expiring soon (${diffDays} days)` }
    return { level: 'ok', msg: 'Accredited' }
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading assessor credentials...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header} style={{ marginBottom: '2.5rem' }}>
        <div>
          <span className={styles.eyebrow}>Assessor Network</span>
          <h2>Field Operations Team</h2>
        </div>
        
        <button onClick={() => setInviteModalOpen(true)} className={styles.addCta} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <UserPlus size={16} />
          <span>Add Assessor</span>
        </button>
      </div>

      {/* Grid of Assessors */}
      <div className={styles.grid}>
        {assessors.map(assessor => {
          const warn = checkExpiryWarning(assessor.accreditation_expiry)
          const isExpired = warn.level === 'expired'
          const isWarning = warn.level === 'warning'

          return (
            <div key={assessor.id} className={styles.card} style={{ position: 'relative' }}>
              {/* Status Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 className={styles.cardTitle} style={{ margin: 0 }}>{assessor.full_name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    ID: {assessor.accreditation_number}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleStatus(assessor.id, assessor.is_active)}
                  style={{
                    background: assessor.is_active ? 'rgba(155, 255, 89, 0.1)' : 'rgba(255, 92, 92, 0.1)',
                    border: '1px solid ' + (assessor.is_active ? 'var(--accent-lime)' : 'var(--accent-red)'),
                    color: assessor.is_active ? 'var(--accent-lime)' : 'var(--accent-red)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {assessor.is_active ? 'Active' : 'Suspended'}
                </button>
              </div>

              {/* Warnings */}
              {(isExpired || isWarning) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: isExpired ? 'rgba(255,92,92,0.1)' : 'rgba(245,166,35,0.1)',
                  border: '1px solid ' + (isExpired ? 'var(--accent-red)' : '#F5A623'),
                  color: isExpired ? 'var(--accent-red)' : '#F5A623',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                }}>
                  <ShieldAlert size={14} />
                  <span>{warn.msg}</span>
                </div>
              )}

              {/* Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} />
                  <span>{assessor.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} />
                  <span>{assessor.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} />
                  <span>Expiry: {assessor.accreditation_expiry}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={14} />
                  <span style={{ textTransform: 'capitalize' }}>Accreditation: {assessor.accreditation_body}</span>
                </div>
              </div>

              {/* Covered Postcodes */}
              <div style={{ marginTop: '1.25rem' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}>Covered Postcodes</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {assessor.service_area_postcodes.map(pc => (
                    <span key={pc} style={{
                      fontSize: '0.7rem',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}>
                      {pc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#0d1527',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '450px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.25rem', color: '#fff', marginBottom: '1.25rem' }}>
              Register Assessor Account
            </h3>

            <form onSubmit={handleCreateAssessor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newAssessor.fullName}
                  onChange={e => setNewAssessor(p => ({ ...p, fullName: e.target.value }))}
                  style={{ width: '100%', background: '#080d18', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@avorria.co.uk"
                    value={newAssessor.email}
                    onChange={e => setNewAssessor(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', background: '#080d18', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Phone</label>
                  <input
                    type="tel"
                    placeholder="07700 900000"
                    value={newAssessor.phone}
                    onChange={e => setNewAssessor(p => ({ ...p, phone: e.target.value }))}
                    style={{ width: '100%', background: '#080d18', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Accreditation Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="EES-12345"
                    value={newAssessor.number}
                    onChange={e => setNewAssessor(p => ({ ...p, number: e.target.value }))}
                    style={{ width: '100%', background: '#080d18', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Accreditation Expiry *</label>
                  <input
                    type="date"
                    required
                    value={newAssessor.expiry}
                    onChange={e => setNewAssessor(p => ({ ...p, expiry: e.target.value }))}
                    style={{ width: '100%', background: '#080d18', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Postcode Coverage (comma-separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S40, S41, DE4"
                  value={newAssessor.postcodes}
                  onChange={e => setNewAssessor(p => ({ ...p, postcodes: e.target.value }))}
                  style={{ width: '100%', background: '#080d18', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem 1rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'var(--accent-lime)', color: '#000', fontWeight: 600, border: 'none', borderRadius: '6px', padding: '0.5rem 1.25rem', cursor: 'pointer' }}
                >
                  Register Assessor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
