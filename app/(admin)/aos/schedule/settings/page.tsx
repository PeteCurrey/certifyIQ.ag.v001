'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Save, Plus, Trash2, AlertTriangle } from 'lucide-react'
import styles from './settings.module.css'

type Tab = 'working_hours' | 'lead_times' | 'blocked' | 'durations' | 'global'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AosScheduleSettingsPage() {
  const [tab, setTab] = useState<Tab>('working_hours')
  const [assessors, setAssessors] = useState<any[]>([])
  const [selectedAssessorId, setSelectedAssessorId] = useState<string | null>(null)
  const [workingHours, setWorkingHours] = useState<any[]>([])
  const [blockedSlots, setBlockedSlots] = useState<any[]>([])
  const [leadTimes, setLeadTimes] = useState<any[]>([])
  const [durations, setDurations] = useState<any[]>([])
  const [globalSettings, setGlobalSettings] = useState<any>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [newBlock, setNewBlock] = useState({ reason: '', start_date: '', end_date: '', all_day: true })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [assessorsRes, leadRes, durRes, settingsRes, blockedRes] = await Promise.all([
        supabase.from('assessors').select('*').eq('is_active', true),
        supabase.from('lead_time_rules').select('*').order('service_type'),
        supabase.from('service_durations').select('*').order('service_type'),
        supabase.from('scheduling_settings').select('*').limit(1).maybeSingle(),
        supabase.from('blocked_slots').select('*').order('date_from', { ascending: false }).limit(50)
      ])
      const aList = assessorsRes.data || []
      setAssessors(aList)
      if (aList.length > 0) setSelectedAssessorId(aList[0].id)
      setLeadTimes(leadRes.data || [])
      setDurations(durRes.data || [])
      setGlobalSettings(settingsRes.data || {})
      setBlockedSlots(blockedRes.data || [])
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedAssessorId) return
    supabase.from('assessor_working_hours').select('*').eq('assessor_id', selectedAssessorId).then(({ data }) => {
      const rows = DAYS.map((day, idx) => {
        const existing = (data || []).find((r: any) => r.day_of_week === (idx + 1))
        return existing || { assessor_id: selectedAssessorId, day_of_week: idx + 1, start_time: '09:00', end_time: '17:30', is_available: idx < 5 }
      })
      setWorkingHours(rows)
    })
  }, [selectedAssessorId])

  async function saveWorkingHours() {
    if (!selectedAssessorId) return
    setSaveStatus('saving')
    try {
      await supabase.from('assessor_working_hours').upsert(workingHours.map(h => ({ ...h, assessor_id: selectedAssessorId })), { onConflict: 'assessor_id,day_of_week' })
      setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2500)
    } catch { setSaveStatus('error') }
  }

  async function saveGlobal() {
    setSaveStatus('saving')
    try {
      if (globalSettings.id) { await supabase.from('scheduling_settings').update(globalSettings).eq('id', globalSettings.id) }
      else { await supabase.from('scheduling_settings').insert(globalSettings) }
      setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2500)
    } catch { setSaveStatus('error') }
  }

  async function addBlockedSlot() {
    if (!newBlock.start_date) return
    const endDt = newBlock.end_date || newBlock.start_date
    const { data, error } = await supabase.from('blocked_slots').insert({
      assessor_id: selectedAssessorId,
      date_from: newBlock.start_date,
      date_to: endDt,
      reason: newBlock.reason || 'Admin blocked'
    }).select().maybeSingle()
    if (!error && data) { setBlockedSlots(prev => [data, ...prev]); setNewBlock({ reason: '', start_date: '', end_date: '', all_day: true }) }
  }

  async function deleteBlockedSlot(id: string) {
    await supabase.from('blocked_slots').delete().eq('id', id)
    setBlockedSlots(prev => prev.filter(b => b.id !== id))
  }

  async function saveLeadTimes() {
    setSaveStatus('saving')
    try { await supabase.from('lead_time_rules').upsert(leadTimes); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2500) }
    catch { setSaveStatus('error') }
  }

  async function saveDurations() {
    setSaveStatus('saving')
    try { await supabase.from('service_durations').upsert(durations, { onConflict: 'service_type,size_band' }); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2500) }
    catch { setSaveStatus('error') }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'working_hours', label: 'Working Hours' },
    { key: 'blocked', label: 'Blocked Slots' },
    { key: 'lead_times', label: 'Lead Times' },
    { key: 'durations', label: 'Service Durations' },
    { key: 'global', label: 'Global Settings' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Scheduling Settings</h1>
        <div className={styles.viewSwitcher}>
          <Link href="/aos/schedule/kanban" className={styles.viewTab}>Kanban</Link>
          <Link href="/aos/schedule/calendar" className={styles.viewTab}>Calendar</Link>
          <Link href="/aos/schedule/map" className={styles.viewTab}>Map View</Link>
          <button className={`${styles.viewTab} ${styles.viewTabActive}`}>Settings</button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.tabNav}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>

          {tab === 'working_hours' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Assessor Working Hours</h2>
                <select value={selectedAssessorId || ''} onChange={e => setSelectedAssessorId(e.target.value)} className={styles.select}>
                  {assessors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </div>
              <div className={styles.hoursGrid}>
                {workingHours.map((h, i) => (
                  <div key={h.day_of_week} className={styles.hoursRow}>
                    <label className={styles.dayLabel}>
                      <input type="checkbox" checked={h.is_available} onChange={e => { const u = [...workingHours]; u[i] = { ...h, is_available: e.target.checked }; setWorkingHours(u) }} className={styles.checkbox} />
                      <span className={h.is_available ? styles.dayActive : styles.dayInactive}>{DAYS[i]}</span>
                    </label>
                    <input type="time" disabled={!h.is_available} value={h.start_time} onChange={e => { const u = [...workingHours]; u[i] = { ...h, start_time: e.target.value }; setWorkingHours(u) }} className={styles.timeInput} />
                    <span className={styles.timeSep}>→</span>
                    <input type="time" disabled={!h.is_available} value={h.end_time} onChange={e => { const u = [...workingHours]; u[i] = { ...h, end_time: e.target.value }; setWorkingHours(u) }} className={styles.timeInput} />
                  </div>
                ))}
              </div>
              <div className={styles.saveRow}>
                <button onClick={saveWorkingHours} className={styles.saveBtn}>
                  <Save size={14} />{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save Working Hours'}
                </button>
              </div>
            </section>
          )}

          {tab === 'blocked' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Blocked Periods</h2>
                <select value={selectedAssessorId || ''} onChange={e => setSelectedAssessorId(e.target.value)} className={styles.select}>
                  <option value="">All Assessors</option>
                  {assessors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </div>
              <div className={styles.blockForm}>
                <h3>Add Blocked Period</h3>
                <div className={styles.blockFormGrid}>
                  <div>
                    <label>Reason</label>
                    <input type="text" value={newBlock.reason} onChange={e => setNewBlock(p => ({ ...p, reason: e.target.value }))} placeholder="Holiday, Training, Sick leave…" className={styles.input} />
                  </div>
                  <div>
                    <label>Start Date</label>
                    <input type="date" value={newBlock.start_date} onChange={e => setNewBlock(p => ({ ...p, start_date: e.target.value }))} className={styles.input} />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input type="date" value={newBlock.end_date} onChange={e => setNewBlock(p => ({ ...p, end_date: e.target.value }))} className={styles.input} />
                  </div>
                </div>
                <button onClick={addBlockedSlot} className={styles.addBtn}><Plus size={14} />Add Blocked Period</button>
              </div>
              <div className={styles.blockList}>
                {blockedSlots.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No blocked periods.</p>}
                {blockedSlots.map(b => (
                  <div key={b.id} className={styles.blockItem}>
                    <AlertTriangle size={14} color="#d97706" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.reason}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.date_from} → {b.date_to}</div>
                    </div>
                    <button onClick={() => deleteBlockedSlot(b.id)} className={styles.deleteBtn} title="Delete"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'lead_times' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}><h2>Lead Time Rules</h2></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>
                Minimum days between booking and assessment date, per service type and region.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Service Type</th><th>Region</th><th>Min Lead Days</th><th>Overnight?</th><th>Priority</th></tr>
                  </thead>
                  <tbody>
                    {leadTimes.map((lt, i) => (
                      <tr key={lt.id || i}>
                        <td className={styles.serviceCell}>{lt.service_type?.replace(/_/g, ' ') || 'All'}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{lt.postcode_region || 'national'}</td>
                        <td>
                          <input type="number" min={0} max={90} value={lt.min_lead_days}
                            onChange={e => { const u = [...leadTimes]; u[i] = { ...lt, min_lead_days: Number(e.target.value) }; setLeadTimes(u) }}
                            className={styles.numInput} />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input type="checkbox" checked={lt.requires_overnight || false}
                            onChange={e => { const u = [...leadTimes]; u[i] = { ...lt, requires_overnight: e.target.checked }; setLeadTimes(u) }}
                            className={styles.checkbox} />
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{lt.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.saveRow}>
                <button onClick={saveLeadTimes} className={styles.saveBtn}><Save size={14} />{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save Lead Times'}</button>
              </div>
            </section>
          )}

          {tab === 'durations' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}><h2>Service Durations</h2></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>Assessment duration (minutes) by service type and property size band.</p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>Service Type</th><th>Size Band</th><th>Duration (mins)</th><th>Travel Buffer (mins)</th></tr></thead>
                  <tbody>
                    {durations.map((d, i) => (
                      <tr key={d.id || i}>
                        <td className={styles.serviceCell}>{d.service_type?.replace(/_/g, ' ')}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{d.size_band || '—'}</td>
                        <td>
                          <input type="number" min={0} max={480} step={15} value={d.duration_minutes}
                            onChange={e => { const u = [...durations]; u[i] = { ...d, duration_minutes: Number(e.target.value) }; setDurations(u) }}
                            className={styles.numInput} />
                        </td>
                        <td>
                          <input type="number" min={0} max={120} step={5} value={d.travel_buffer_minutes || 30}
                            onChange={e => { const u = [...durations]; u[i] = { ...d, travel_buffer_minutes: Number(e.target.value) }; setDurations(u) }}
                            className={styles.numInput} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.saveRow}>
                <button onClick={saveDurations} className={styles.saveBtn}><Save size={14} />{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save Durations'}</button>
              </div>
            </section>
          )}

          {tab === 'global' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}><h2>Global Scheduling Settings</h2></div>
              <div className={styles.globalGrid}>
                <div className={styles.globalField}>
                  <label>Max jobs per assessor per day</label>
                  <input type="number" min={1} max={20} value={globalSettings.max_jobs_per_assessor_per_day || 4} onChange={e => setGlobalSettings((p: any) => ({ ...p, max_jobs_per_assessor_per_day: Number(e.target.value) }))} className={styles.numInput} />
                </div>
                <div className={styles.globalField}>
                  <label>Max daily travel miles</label>
                  <input type="number" min={10} max={500} value={globalSettings.max_daily_travel_miles || 150} onChange={e => setGlobalSettings((p: any) => ({ ...p, max_daily_travel_miles: Number(e.target.value) }))} className={styles.numInput} />
                </div>
                <div className={styles.globalField}>
                  <label>Overnight threshold (miles)</label>
                  <input type="number" min={50} max={500} value={globalSettings.overnight_stay_threshold_miles || 100} onChange={e => setGlobalSettings((p: any) => ({ ...p, overnight_stay_threshold_miles: Number(e.target.value) }))} className={styles.numInput} />
                </div>
                <div className={styles.globalField}>
                  <label>Buffer between jobs (mins)</label>
                  <input type="number" min={0} max={120} step={5} value={globalSettings.buffer_between_jobs_minutes || 30} onChange={e => setGlobalSettings((p: any) => ({ ...p, buffer_between_jobs_minutes: Number(e.target.value) }))} className={styles.numInput} />
                </div>
                <div className={styles.globalField}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={globalSettings.allow_weekend_bookings || false} onChange={e => setGlobalSettings((p: any) => ({ ...p, allow_weekend_bookings: e.target.checked }))} className={styles.checkbox} />
                    Allow weekend bookings
                  </label>
                </div>
                <div className={styles.globalField}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={globalSettings.send_confirmation_email !== false} onChange={e => setGlobalSettings((p: any) => ({ ...p, send_confirmation_email: e.target.checked }))} className={styles.checkbox} />
                    Send confirmation emails
                  </label>
                </div>
              </div>
              <div className={styles.saveRow}>
                <button onClick={saveGlobal} className={styles.saveBtn}><Save size={14} />{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save Global Settings'}</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
