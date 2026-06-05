'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useVoiceDictation() {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const clearError = useCallback(() => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000)
  }, [])

  const startListening = useCallback(() => {
    setError(null)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice dictation not available in this browser')
      clearError()
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-GB'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognition.onerror = (e: any) => {
      setIsListening(false)
      setInterimTranscript('')
      if (e.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings.')
        clearError()
      } else if (e.error === 'network') {
        setError('Network required for voice recognition. Check your connection.')
        clearError()
      } else if (e.error === 'no-speech') {
        // Silent timeout — not an error
      } else if (e.error !== 'aborted') {
        setError(`Voice error: ${e.error}`)
        clearError()
      }
    }

    recognition.onresult = (e: any) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript
        } else {
          interim += e.results[i][0].transcript
        }
      }
      if (final) setTranscript(prev => prev + (prev ? ' ' : '') + final.trim())
      setInterimTranscript(interim)
    }

    recognition.start()
    recognitionRef.current = recognition
  }, [clearError])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    setTranscript
  }
}
