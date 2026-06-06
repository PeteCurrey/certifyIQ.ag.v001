import React from 'react';

interface CommercialEpcQuoteEmailProps {
  propertyAddress: string;
  buildingUseType: string;
  floorAreaSqm: number;
  level: number;
  quotedPriceGbp: number;
  stripePaymentUrl: string;
}

export function CommercialEpcQuoteEmail({
  propertyAddress,
  buildingUseType,
  floorAreaSqm,
  level,
  quotedPriceGbp,
  stripePaymentUrl,
}: CommercialEpcQuoteEmailProps) {
  const vatAmount = quotedPriceGbp * 0.2;
  const totalPrice = quotedPriceGbp + vatAmount;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      padding: '40px 20px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
    }}>
      <h1 style={{
        fontSize: '24px',
        color: '#0f172a',
        fontWeight: 'bold',
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px',
      }}>
        Commercial EPC Quote
      </h1>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
        Thank you for requesting a commercial EPC quote with Avorria. We have assessed your property details and generated your quote below.
      </p>

      <div style={{
        backgroundColor: '#f8fafc',
        padding: '24px',
        borderRadius: '8px',
        margin: '24px 0',
        border: '1px solid #e2e8f0',
      }}>
        <h2 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 16px 0', fontWeight: 'semibold' }}>
          Quote Summary
        </h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b', fontSize: '14px' }}>Property Address</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'medium', fontSize: '14px', color: '#0f172a' }}>{propertyAddress}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b', fontSize: '14px' }}>Building Use</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'medium', fontSize: '14px', color: '#0f172a' }}>{buildingUseType}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b', fontSize: '14px' }}>Floor Area</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'medium', fontSize: '14px', color: '#0f172a' }}>{floorAreaSqm} m²</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b', fontSize: '14px' }}>Level Confirmed</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'medium', fontSize: '14px', color: '#0f172a' }}>Level {level}</td>
            </tr>
            <tr style={{ borderTop: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px 0 4px 0', color: '#64748b', fontSize: '14px' }}>Net Price</td>
              <td style={{ padding: '12px 0 4px 0', textAlign: 'right', fontSize: '14px', color: '#0f172a' }}>£{quotedPriceGbp.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: '#64748b', fontSize: '14px' }}>VAT (20%)</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontSize: '14px', color: '#0f172a' }}>£{vatAmount.toFixed(2)}</td>
            </tr>
            <tr style={{ borderTop: '2px solid #cbd5e1' }}>
              <td style={{ padding: '12px 0 0 0', fontWeight: 'bold', fontSize: '16px', color: '#0f172a' }}>Total Price (inc. VAT)</td>
              <td style={{ padding: '12px 0 0 0', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#0f172a' }}>£{totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: 'semibold', marginBottom: '8px' }}>What's Included:</h3>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
          <li>Full on-site physical survey by an accredited NDEA assessor</li>
          <li>Accurate SBEM thermal modeling of building zones</li>
          <li>Official commercial EPC certificate registered with the government</li>
          <li>Detailed Recommendation Report with cost-saving improvement measures</li>
          <li>10 years certificate validity on the national database</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <a href={stripePaymentUrl} style={{
          backgroundColor: '#9BFF59',
          color: '#000000',
          padding: '14px 28px',
          textDecoration: 'none',
          fontWeight: 'bold',
          borderRadius: '6px',
          display: 'inline-block',
          fontSize: '16px',
          border: '1px solid #7ae03b',
        }}>
          Accept Quote & Pay
        </a>
      </div>

      <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginTop: '32px', fontStyle: 'italic' }}>
        * Quote valid for 14 days from date of issue.
      </p>

      <p style={{ fontSize: '14px', color: '#64748b', marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        If you have any questions or need to make adjustments to this quote, please contact our commercial team.
        <br /><br />
        Best regards,<br />
        <strong>The Avorria Team</strong>
      </p>
    </div>
  );
}
