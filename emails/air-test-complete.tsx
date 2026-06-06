import React from 'react';

interface AirTestCompleteEmailProps {
  propertyAddress: string;
  plotRef: string;
  resultM3HM2: number;
  isPass: boolean;
  remedialNotes?: string;
  retestBookingUrl: string;
}

export function AirTestCompleteEmail({
  propertyAddress,
  plotRef,
  resultM3HM2,
  isPass,
  remedialNotes,
  retestBookingUrl,
}: AirTestCompleteEmailProps) {
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
        fontSize: '22px',
        color: '#0f172a',
        fontWeight: 'bold',
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px',
      }}>
        Air Tightness Test Complete
      </h1>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
        The air permeability testing has been completed for your property. Please find the details and results below.
      </p>

      <div style={{
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        margin: '24px 0',
        border: '1px solid #e2e8f0',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b', fontSize: '14px' }}>Property Address</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{propertyAddress}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b', fontSize: '14px' }}>Plot Reference</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{plotRef}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b', fontSize: '14px' }}>Measured Air Permeability</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{resultM3HM2.toFixed(2)} m³/h/m² @ 50Pa</td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          {isPass ? (
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '8px 16px',
              fontWeight: 'bold',
              borderRadius: '20px',
              display: 'inline-block',
              fontSize: '14px',
              border: '1px solid #bbf7d0',
            }}>
              RESULT: PASS
            </span>
          ) : (
            <span style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '8px 16px',
              fontWeight: 'bold',
              borderRadius: '20px',
              display: 'inline-block',
              fontSize: '14px',
              border: '1px solid #fecaca',
            }}>
              RESULT: FAIL
            </span>
          )}
        </div>
      </div>

      {isPass ? (
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '24px',
        }}>
          <strong>Next Step:</strong> Your ATTMA certificate is being processed and will be issued via email within 24 hours. We will also update your final as-built SAP calculation with this result.
        </div>
      ) : (
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#fff7ed',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #fed7aa',
            color: '#c2410c',
            fontSize: '14px',
            lineHeight: '1.5',
            marginBottom: '16px',
          }}>
            <strong>Remedial Actions Needed:</strong> The property did not meet the design target air permeability. To pass, you will need to identify and seal paths of air leakage.
            {remedialNotes && (
              <div style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: '3px solid #f97316', color: '#7c2d12', fontStyle: 'italic' }}>
                Assessor Notes: {remedialNotes}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <a href={retestBookingUrl} style={{
              backgroundColor: '#b91c1c',
              color: '#ffffff',
              padding: '12px 24px',
              textDecoration: 'none',
              fontWeight: 'bold',
              borderRadius: '6px',
              display: 'inline-block',
              fontSize: '15px',
            }}>
              Book a Re-Test
            </a>
          </div>
        </div>
      )}

      <p style={{ fontSize: '14px', color: '#64748b', marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        If you have any questions about these test results, please contact your testing engineer.
        <br /><br />
        Best regards,<br />
        <strong>The Avorria Team</strong>
      </p>
    </div>
  );
}
