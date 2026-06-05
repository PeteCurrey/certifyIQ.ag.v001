import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

interface BookingEmailProps {
  toEmail: string
  customerName: string
  bookingRef: string
  propertyAddress: string
  preferredDate: string
  price: number
}

export async function sendBookingConfirmation({ toEmail, customerName, bookingRef, propertyAddress, preferredDate, price }: BookingEmailProps) {
  if (!resend) {
    console.log('RESEND_API_KEY not set. Mocking email send:', { toEmail, bookingRef })
    return { success: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'CertifyIQ <bookings@certifyiq.co.uk>',
      to: [toEmail],
      subject: `Booking Confirmed: EPC Assessment (${bookingRef})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="color: #0D1A30;">Booking Confirmed</h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for booking your EPC assessment with CertifyIQ. We've received your payment and your assessment is now scheduled.</p>
          
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0D1A30;">Booking Details</h3>
            <p><strong>Reference:</strong> ${bookingRef}</p>
            <p><strong>Property:</strong> ${propertyAddress}</p>
            <p><strong>Preferred Date:</strong> ${preferredDate} (We will confirm the exact time window shortly)</p>
            <p><strong>Total Paid:</strong> £${price.toFixed(2)}</p>
          </div>

          <p><strong>What happens next?</strong></p>
          <p>Our assessor will be in touch shortly to confirm your exact arrival window. Please ensure there is clear access to the property, the boiler, and the loft hatch (if applicable).</p>

          <p>You can view your booking status and download your certificate once issued by logging into your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal">Client Portal</a>.</p>
          
          <p>Best regards,<br/>The CertifyIQ Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Failed to send email:', err)
    return { success: false, error: err }
  }
}

export async function sendCertificateIssued({ toEmail, customerName, bookingRef, propertyAddress, certificateUrl }: { toEmail: string, customerName: string, bookingRef: string, propertyAddress: string, certificateUrl: string }) {
  if (!resend) {
    console.log('RESEND_API_KEY not set. Mocking email send:', { toEmail, bookingRef })
    return { success: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'CertifyIQ <assessments@certifyiq.co.uk>',
      to: [toEmail],
      subject: `Your EPC is Ready: ${propertyAddress}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="color: #0D1A30;">Your EPC is Ready</h1>
          <p>Hi ${customerName},</p>
          <p>Good news! The Energy Performance Certificate for <strong>${propertyAddress}</strong> has been issued and lodged with the central register.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal" style="background-color: #9BFF59; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">View & Download Certificate</a>
          </div>

          <p>Your certificate is valid for 10 years. If you have any questions about the rating or the recommended improvements, please don't hesitate to reach out.</p>

          <p>Best regards,<br/>The CertifyIQ Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Failed to send email:', err)
    return { success: false, error: err }
  }
}
