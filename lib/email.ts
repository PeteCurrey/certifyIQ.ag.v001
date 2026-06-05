import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://avorria.co.uk'
const FROM_BOOKINGS = 'Avorria <bookings@avorria.co.uk>'
const FROM_ASSESSMENTS = 'Avorria <assessments@avorria.co.uk>'
const ADMIN_EMAIL = 'petecurrrey@gmail.com'

interface BookingEmailProps {
  toEmail: string
  customerName: string
  bookingRef: string
  propertyAddress: string
  preferredDate: string
  price: number | null
  quoteRequired?: boolean
  serviceType?: string
}

export async function sendBookingConfirmation(props: BookingEmailProps) {
  const { toEmail, customerName, bookingRef, propertyAddress, preferredDate, price, quoteRequired, serviceType } = props

  if (!resend) {
    console.log('[Resend] API key not set — mocking email:', { toEmail, bookingRef })
    return { success: true }
  }

  const priceLine = quoteRequired
    ? `<p><strong>Status:</strong> Quote requested — we'll contact you within 2 working hours</p>`
    : price != null ? `<p><strong>Total paid:</strong> £${price.toFixed(2)}</p>` : ''

  try {
    await resend.emails.send({
      from: FROM_BOOKINGS,
      to: [toEmail],
      subject: `Booking confirmed — ${bookingRef} | Avorria`,
      html: `
        <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #18181B; background: #FAFAFA; padding: 40px 20px;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 24px; font-weight: 700; color: #0F766E;">Avorria</span><span style="color: #0F766E;">.</span>
          </div>
          <h1 style="font-size: 28px; margin: 0 0 8px; color: #18181B;">
            ${quoteRequired ? 'Quote request received' : 'Booking confirmed ✓'}
          </h1>
          <p style="color: #52525B; margin: 0 0 32px;">Hi ${customerName}, thank you for choosing Avorria.</p>

          <div style="background: #fff; border: 1px solid #E4E4E7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="font-family: monospace; font-size: 22px; color: #0F766E; font-weight: 700; margin: 0 0 16px;">${bookingRef}</p>
            <p style="margin: 6px 0;"><strong>Service:</strong> ${serviceType || 'EPC Assessment'}</p>
            <p style="margin: 6px 0;"><strong>Property:</strong> ${propertyAddress}</p>
            <p style="margin: 6px 0;"><strong>Preferred date:</strong> ${preferredDate}</p>
            ${priceLine}
          </div>

          <h2 style="font-size: 18px; margin: 0 0 16px;">What happens next</h2>
          <ol style="color: #52525B; line-height: 2; padding-left: 20px; margin: 0 0 32px;">
            <li>We'll confirm your exact visit time within 24 hours</li>
            <li>Your Elmhurst-accredited assessor visits on ${preferredDate}</li>
            <li>Your certificate is emailed within 24 hours of the assessment</li>
          </ol>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${SITE_URL}/portal" style="background: #0F766E; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">View my booking</a>
          </div>

          <p style="color: #A1A1AA; font-size: 13px; border-top: 1px solid #E4E4E7; padding-top: 24px; margin: 0;">
            Avorria · <a href="${SITE_URL}" style="color: #0F766E;">avorria.co.uk</a><br>
            EPC assessments for England &amp; Wales
          </p>
        </div>
      `,
    })

    // Admin notification
    await resend.emails.send({
      from: FROM_BOOKINGS,
      to: [ADMIN_EMAIL],
      subject: `New booking: ${bookingRef} — ${serviceType || 'EPC'} — ${propertyAddress}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0F766E;">New booking received</h2>
          <p><strong>Ref:</strong> ${bookingRef}</p>
          <p><strong>Customer:</strong> ${customerName} &lt;${toEmail}&gt;</p>
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Property:</strong> ${propertyAddress}</p>
          <p><strong>Date:</strong> ${preferredDate}</p>
          <p><strong>Price:</strong> ${quoteRequired ? 'Quote required' : price != null ? '£' + price.toFixed(2) : 'TBC'}</p>
          <p><a href="${SITE_URL}/admin/jobs">View in admin →</a></p>
        </div>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error('[Resend] Failed to send booking confirmation:', err)
    return { success: false, error: err }
  }
}

export async function sendCertificateIssued({
  toEmail, customerName, bookingRef, propertyAddress, certificateUrl,
}: {
  toEmail: string
  customerName: string
  bookingRef: string
  propertyAddress: string
  certificateUrl: string
}) {
  if (!resend) {
    console.log('[Resend] API key not set — mocking certificate email:', { toEmail, bookingRef })
    return { success: true }
  }

  try {
    await resend.emails.send({
      from: FROM_ASSESSMENTS,
      to: [toEmail],
      subject: `Your EPC certificate is ready — ${propertyAddress}`,
      html: `
        <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #18181B; padding: 40px 20px;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 24px; font-weight: 700; color: #0F766E;">Avorria</span><span style="color: #0F766E;">.</span>
          </div>
          <h1 style="font-size: 28px; margin: 0 0 8px;">Your EPC is ready</h1>
          <p style="color: #52525B;">Hi ${customerName}, your Energy Performance Certificate for <strong>${propertyAddress}</strong> has been issued and lodged on the national register.</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${certificateUrl}" style="background: #0F766E; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Download your certificate</a>
          </div>

          <p style="color: #52525B;">Your certificate is valid for 10 years. You can also view it on the <a href="https://epc.opendatacommunities.org" style="color: #0F766E;">government EPC register</a>.</p>
          <p style="color: #A1A1AA; font-size: 13px; border-top: 1px solid #E4E4E7; padding-top: 24px;">Avorria · <a href="${SITE_URL}" style="color: #0F766E;">avorria.co.uk</a></p>
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('[Resend] Failed to send certificate email:', err)
    return { success: false, error: err }
  }
}

export async function sendEnquiryNotification({
  type, name, email, phone, details,
}: {
  type: string
  name: string
  email: string
  phone?: string
  details: Record<string, string>
}) {
  if (!resend) {
    console.log('[Resend] API key not set — mocking enquiry email:', { name, type })
    return { success: true }
  }

  const detailRows = Object.entries(details)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
    .join('')

  try {
    await resend.emails.send({
      from: FROM_BOOKINGS,
      to: [ADMIN_EMAIL],
      subject: `New ${type} enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0F766E;">New ${type} enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <hr/>
          ${detailRows}
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('[Resend] Failed to send enquiry email:', err)
    return { success: false, error: err }
  }
}
