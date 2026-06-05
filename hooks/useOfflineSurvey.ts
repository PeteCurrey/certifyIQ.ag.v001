'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const storageKey = (id: string) => `aos_survey_${id}`

export interface SurveyData {
  propertyType?: string
  constructionYear?: string
  floorArea?: number
  wallType?: string
  wallInsulation?: string
  roofType?: string
  roofInsulation?: string
  floorType?: string
  windowType?: string
  mainHeatType?: string
  mainHeatFuel?: string
  mainHeatEfficiency?: string
  hotWaterSystem?: string
  secondaryHeating?: string
  lightingType?: string
  renewables?: string[]
  assessorNotes?: string
  voiceNotesText?: string
  completedSections?: string[]
  lastSaved?: string
}

const defaultSurveyData: SurveyData = {
  renewables: [],
  completedSections: [],
}

export function useOfflineSurvey(bookingId: string) {
  const [data, setDataState] = useState<SurveyData>(() => {
    if (typeof window === 'undefined') return defaultSurveyData
    try {
      const stored = localStorage.getItem(storageKey(bookingId))
      return stored ? JSON.parse(stored) : defaultSurveyData
    } catch {
      return defaultSurveyData
    }
  })

  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'synced' | 'offline' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const setData = useCallback((updater: SurveyData | ((prev: SurveyData) => SurveyData)) => {
    setDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try {
        localStorage.setItem(storageKey(bookingId), JSON.stringify(next))
        setLastSaved(new Date())
      } catch (e) {
        console.error('LocalStorage save failed:', e)
      }
      return next
    })
  }, [bookingId])

  const syncToServer = useCallback(async () => {
    if (!navigator.onLine) {
      setSyncStatus('offline')
      return { queued: true }
    }
    setSyncStatus('saving')
    const supabase = createClient()
    const { error } = await supabase
      .from('assessments')
      .update({
        survey_data_json: data,
        assessor_notes: data.assessorNotes,
        voice_notes_text: data.voiceNotesText,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)

    if (!error) {
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } else {
      setSyncStatus('error')
      return { error }
    }
    return { error: null }
  }, [data, bookingId])

  return { data, setData, syncToServer, syncStatus, lastSaved }
}
