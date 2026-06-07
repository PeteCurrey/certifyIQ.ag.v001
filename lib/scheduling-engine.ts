import { addBusinessDays, addDays, addMinutes, differenceInMinutes, format, isBefore, isWeekend, startOfDay, endOfDay, parse, parseISO } from 'date-fns'

export interface LeadTimeRule {
  id: string
  service_type: string | null
  postcode_region: string | null
  min_lead_days: number
  requires_overnight: boolean
  overnight_days: number
  notes: string | null
  priority: number
}

export interface AvailableSlot {
  type?: string
  message?: string
  date?: Date
  start?: Date
  end?: Date
  assessorId?: string
  travelMinutes?: number
  travelMiles?: number
  requiresOvernight?: boolean
  overnightDays?: number
  leadDaysApplied?: number
}

// Helper to determine if checkDate is working day
function isWorkingDay(date: Date): boolean {
  // Check if weekend, Saturday morning might be open but Sunday is off.
  // We can let assessor_working_hours handle the day_of_week check.
  return true; 
}

// Get global scheduling setting
export async function getSchedulingSetting(supabase: any, key: string, defaultValue: string = ''): Promise<string> {
  const { data } = await supabase
    .from('scheduling_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  return data?.value ?? defaultValue
}

// ──────────────────────────────
// 2A: POSTCODE REGION LOOKUP
// ──────────────────────────────
export async function getPostcodeRegion(
  supabase: any,
  postcode: string
): Promise<string> {
  if (!postcode) return 'national'
  const prefix = postcode.toUpperCase().trim().split(' ')[0]
  
  // Try direct prefix match (e.g. S40)
  const { data } = await supabase
    .from('postcode_regions')
    .select('region')
    .eq('postcode_prefix', prefix)
    .maybeSingle()
  
  if (data?.region) return data.region

  // Try stripped prefix match (e.g. S40 -> S)
  const basePrefix = prefix.replace(/\d+$/, '')
  if (basePrefix && basePrefix !== prefix) {
    const { data: fallbackData } = await supabase
      .from('postcode_regions')
      .select('region')
      .eq('postcode_prefix', basePrefix)
      .maybeSingle()
    if (fallbackData?.region) return fallbackData.region
  }

  return 'national'
}

// ──────────────────────────────
// 2B: GET MIN LEAD DAYS
// ──────────────────────────────
export async function getMinLeadDays(
  supabase: any,
  serviceType: string,
  postcode: string
): Promise<{
  days: number
  requiresOvernight: boolean
  overnightDays: number
  rule: LeadTimeRule | null
}> {
  const region = await getPostcodeRegion(supabase, postcode)
  
  const { data: rules } = await supabase
    .from('lead_time_rules')
    .select('*')
    .eq('is_active', true)
    .or(`service_type.eq.${serviceType},service_type.is.null`)
    .or(`postcode_region.eq.${region},postcode_region.is.null,postcode_region.eq.national`)
    .order('priority', { ascending: false })
  
  if (!rules?.length) {
    return { days: 3, requiresOvernight: false, overnightDays: 0, rule: null }
  }
  
  const best = rules.find((r: any) =>
    r.service_type === serviceType && r.postcode_region === region
  ) ?? rules.find((r: any) =>
    r.service_type === serviceType
  ) ?? rules[0]
  
  return {
    days: best.min_lead_days,
    requiresOvernight: best.requires_overnight,
    overnightDays: best.overnight_days ?? 0,
    rule: best
  }
}

// ──────────────────────────────
// 2C: GET SIZE BAND / SERVICE DURATION
// ──────────────────────────────
export function getSizeBand(
  serviceType: string,
  booking: any
): string {
  if (serviceType === 'domestic') {
    const beds = Number(booking.bed_count || booking.bedroom_count || 3)
    if (beds <= 2) return '1-2_bed'
    if (beds === 3) return '3_bed'
    if (beds === 4) return '4_bed'
    return '5plus_bed'
  }
  if (serviceType.startsWith('commercial')) {
    const area = Number(booking.floor_area_sqm || 150)
    if (area <= 100) return 'up_to_100'
    if (area <= 250) return '101_to_250'
    if (area <= 500) return '251_to_500'
    if (area <= 750) return '501_to_750'
    if (area <= 1000) return '751_to_1000'
    return '1000plus'
  }
  if (serviceType === 'commercial_tm44') {
    const units = Number(booking.ac_unit_count || 1)
    if (units <= 2) return '1_2_units'
    if (units <= 5) return '3_5_units'
    if (units <= 10) return '6_10_units'
    return '10plus_units'
  }
  return 'any'
}

export async function getServiceDuration(
  supabase: any,
  serviceType: string,
  sizeBand: string
): Promise<{ durationMinutes: number; travelBufferMinutes: number; requiresSiteVisit: boolean }> {
  const { data } = await supabase
    .from('service_durations')
    .select('*')
    .eq('service_type', serviceType)
    .eq('size_band', sizeBand)
    .maybeSingle()

  return {
    durationMinutes: data?.duration_minutes ?? 60,
    travelBufferMinutes: data?.travel_buffer_minutes ?? 30,
    requiresSiteVisit: data?.requires_site_visit ?? true
  }
}

// ──────────────────────────────
// 2D: TRAVEL TIME ESTIMATION
// ──────────────────────────────
export async function estimateTravelTime(
  fromPostcode: string,
  toPostcode: string
): Promise<{ minutes: number; miles: number }> {
  if (!fromPostcode || !toPostcode) {
    return { minutes: 30, miles: 5 }
  }
  
  try {
    const cleanFrom = encodeURIComponent(fromPostcode.toUpperCase().trim())
    const cleanTo = encodeURIComponent(toPostcode.toUpperCase().trim())

    const [fromRes, toRes] = await Promise.all([
      fetch(`https://api.postcodes.io/postcodes/${cleanFrom}`).then(r => r.json()),
      fetch(`https://api.postcodes.io/postcodes/${cleanTo}`).then(r => r.json())
    ])
    
    if (!fromRes.result || !toRes.result) {
      return { minutes: 60, miles: 20 }
    }
    
    // Haversine formula
    const R = 3959 // radius in miles
    const lat1 = fromRes.result.latitude * Math.PI / 180
    const lat2 = toRes.result.latitude * Math.PI / 180
    const dLat = lat2 - lat1
    const dLon = (toRes.result.longitude - fromRes.result.longitude) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2
    const miles = R * 2 * Math.asin(Math.sqrt(a))
    
    const avgSpeed = miles < 10 ? 30 : miles < 30 ? 45 : 55
    const minutes = Math.round((miles / avgSpeed) * 60)
    
    return { minutes, miles: Math.round(miles * 10) / 10 }
  } catch (err) {
    console.error('Postcode API failed, using fallbacks:', err)
    return { minutes: 60, miles: 20 }
  }
}

// ──────────────────────────────
// 2E: FIND AVAILABLE SLOTS
// ──────────────────────────────
export async function findAvailableSlots(supabase: any, params: {
  serviceType: string
  sizeBand: string
  clientPostcode: string
  assessorId?: string
  requestedDate?: Date
  daysToSearch?: number
}): Promise<AvailableSlot[]> {
  const { serviceType, sizeBand, clientPostcode, assessorId, requestedDate, daysToSearch = 30 } = params

  const leadTime = await getMinLeadDays(supabase, serviceType, clientPostcode)
  const duration = await getServiceDuration(supabase, serviceType, sizeBand)
  
  if (!duration.requiresSiteVisit) {
    return [{ type: 'desk_based', message: 'No site visit required' }]
  }
  
  const today = new Date()
  const earliestDate = addBusinessDays(today, leadTime.days)
  
  const basePostcode = await getSchedulingSetting(supabase, 'base_postcode', 'S40 2EJ')
  const travel = await estimateTravelTime(basePostcode, clientPostcode)
  
  const totalMinutes = travel.minutes + duration.durationMinutes + duration.travelBufferMinutes
  
  let assessors: { id: string }[] = []
  if (assessorId) {
    assessors = [{ id: assessorId }]
  } else {
    const { data: activeAssessors } = await supabase
      .from('assessors')
      .select('id')
      .eq('is_active', true)
    assessors = activeAssessors || []
  }
  
  const availableSlots: AvailableSlot[] = []
  const startDate = requestedDate
    ? (isBefore(requestedDate, earliestDate) ? earliestDate : requestedDate)
    : earliestDate
  
  for (let d = 0; d < daysToSearch && availableSlots.length < 15; d++) {
    const checkDate = addDays(startDate, d)
    
    for (const assessor of assessors) {
      const slots = await getAvailableSlotsForAssessorDay(
        supabase, assessor.id, checkDate, totalMinutes
      )
      for (const slot of slots) {
        availableSlots.push({
          date: checkDate,
          start: slot.start,
          end: addMinutes(slot.start, totalMinutes),
          assessorId: assessor.id,
          travelMinutes: travel.minutes,
          travelMiles: travel.miles,
          requiresOvernight: leadTime.requiresOvernight,
          overnightDays: leadTime.overnightDays,
          leadDaysApplied: leadTime.days
        })
      }
    }
  }
  
  return availableSlots
}

async function getAvailableSlotsForAssessorDay(
  supabase: any,
  assessorId: string,
  date: Date,
  requiredMinutes: number
): Promise<{ start: Date }[]> {
  const dayOfWeek = date.getDay()
  
  const { data: hours } = await supabase
    .from('assessor_working_hours')
    .select('*')
    .eq('assessor_id', assessorId)
    .eq('day_of_week', dayOfWeek)
    .maybeSingle()
  
  if (!hours?.is_working) return []
  
  const dateStr = format(date, 'yyyy-MM-dd')
  
  const { data: blocks } = await supabase
    .from('blocked_slots')
    .select('*')
    .eq('is_active', true)
    .lte('date_from', dateStr)
    .gte('date_to', dateStr)
    .or(`assessor_id.eq.${assessorId},blocks_all_assessors.eq.true`)
  
  if (blocks?.some((b: any) => !b.time_from && !b.time_to)) return [] // Full day block
  
  const dayStart = startOfDay(date).toISOString()
  const dayEnd = endOfDay(date).toISOString()
  
  const { data: existing } = await supabase
    .from('scheduled_slots')
    .select('start_datetime, end_datetime')
    .eq('assessor_id', assessorId)
    .gte('start_datetime', dayStart)
    .lte('start_datetime', dayEnd)
    .neq('status', 'cancelled')
  
  if ((existing?.length ?? 0) >= (hours.max_jobs_per_day ?? 4)) return []
  
  // Setup working hours range
  const workStart = parse(hours.start_time || '08:00:00', 'HH:mm:ss', date)
  const workEnd = parse(hours.end_time || '18:00:00', 'HH:mm:ss', date)
  
  const busyPeriods = [
    ...(existing ?? []).map((e: any) => ({
      start: parseISO(e.start_datetime),
      end: parseISO(e.end_datetime)
    })),
    ...(blocks ?? []).filter((b: any) => b.time_from).map((b: any) => ({
      start: parse(b.time_from, 'HH:mm:ss', date),
      end: parse(b.time_to, 'HH:mm:ss', date)
    }))
  ].sort((a, b) => a.start.getTime() - b.start.getTime())
  
  const available: { start: Date }[] = []
  let cursor = workStart
  
  for (const busy of busyPeriods) {
    if (differenceInMinutes(busy.start, cursor) >= requiredMinutes) {
      // Slot fits before busy period
      available.push({ start: new Date(cursor) })
    }
    // Advance past busy period
    if (busy.end > cursor) {
      cursor = busy.end
    }
  }
  
  if (differenceInMinutes(workEnd, cursor) >= requiredMinutes) {
    available.push({ start: new Date(cursor) })
  }
  
  return available
}
