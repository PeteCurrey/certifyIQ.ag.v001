import React from 'react';

interface PeaCompleteEmailProps {
  projectName: string;
  developmentRef: string;
  peaDocumentUrl: string;
  bookAirTightnessUrl: string;
}

export function PeaCompleteEmail({
  projectName,
  developmentRef,
  peaDocumentUrl,
  bookAirTightnessUrl,
}: PeaCompleteEmailProps) {
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
        Design Stage SAP Complete
      </h1>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
        Great news! The design stage SAP calculations for your project have been completed. Your <strong>Predicted Energy Assessment (PEA)</strong> is now ready for Building Control submission.
      </p>

      <div style={{
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        margin: '24px 0',
        border: '1px solid #e2e8f0',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b', fontSize: '14px' }}>Project Name</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{projectName}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b', fontSize: '14px' }}>Development Ref</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{developmentRef}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href={peaDocumentUrl} style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 20px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: '6px',
            display: 'inline-block',
            fontSize: '14px',
          }}>
            Download PEA Document
          </a>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: 'semibold', marginBottom: '12px' }}>What Happens Next?</h3>
        <ol style={{ margin: '0', paddingLeft: '20px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Submit to Building Control:</strong> Provide the PEA document and SAP compliance report to your Building Control Officer to approve the design stage.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Begin/Continue Construction:</strong> Carry out the build adhering strictly to the specifications detailed in the SAP report.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Book As-Built Assessment:</strong> Once the construction is nearing completion and air tests are booked, contact us to carry out the final as-built SAP assessments and issue the final OC-EPC.
          </li>
        </ol>
      </div>

      <div style={{
        backgroundColor: '#eff6ff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #bfdbfe',
        margin: '24px 0',
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1e3a8a', fontSize: '15px', fontWeight: 'bold' }}>
          Need Air Tightness Testing?
        </h4>
        <p style={{ margin: '0 0 14px 0', color: '#1e40af', fontSize: '13px', lineHeight: '1.5' }}>
          Part L regulations mandate air tightness testing for new dwellings. Book your tests with us at the same time to ensure seamless coordination with your final SAP calculations.
        </p>
        <a href={bookAirTightnessUrl} style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '8px 16px',
          textDecoration: 'none',
          fontWeight: 'bold',
          borderRadius: '4px',
          display: 'inline-block',
          fontSize: '13px',
        }}>
          Book Air Tightness Testing
        </a>
      </div>

      <p style={{ fontSize: '14px', color: '#64748b', marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        If you have any questions or require modifications to the design specification in your report, please let us know.
        <br /><br />
        Best regards,<br />
        <strong>The Avorria Team</strong>
      </p>
    </div>
  );
}
