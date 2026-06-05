import React from 'react';

interface OcEpcIssuedEmailProps {
  developmentName: string;
  plotNumber: string;
  epcBand: string;
  sapScore: number;
  downloadUrl: string;
}

export function OcEpcIssuedEmail({
  developmentName,
  plotNumber,
  epcBand,
  sapScore,
  downloadUrl,
}: OcEpcIssuedEmailProps) {
  const getBandColor = (band: string) => {
    switch (band.toUpperCase()) {
      case 'A': return '#15803d';
      case 'B': return '#22c55e';
      case 'C': return '#eab308';
      case 'D': return '#f97316';
      default: return '#ef4444';
    }
  };

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
        On-Construction EPC Issued
      </h1>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#4b5563' }}>
        We are pleased to inform you that your On-Construction Energy Performance Certificate (OC-EPC) has been successfully lodged on the national register.
      </p>

      <div style={{
        backgroundColor: '#f8fafc',
        padding: '24px',
        borderRadius: '8px',
        margin: '24px 0',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-block', width: '100%', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Development / Plot</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{developmentName}, Plot {plotNumber}</div>
        </div>

        <div style={{ display: 'inline-block', margin: '10px 20px' }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>SAP Score</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{sapScore}</div>
        </div>

        <div style={{ display: 'inline-block', margin: '10px 20px' }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>EPC Rating</div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: getBandColor(epcBand),
            padding: '4px 16px',
            borderRadius: '4px',
            display: 'inline-block',
          }}>
            Band {epcBand.toUpperCase()}
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <a href={downloadUrl} style={{
            backgroundColor: '#9BFF59',
            color: '#000000',
            padding: '12px 24px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: '6px',
            display: 'inline-block',
            fontSize: '15px',
            border: '1px solid #7ae03b',
          }}>
            Download OC-EPC Certificate
          </a>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f0fdf4',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #bbf7d0',
        color: '#166534',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '24px',
      }}>
        <strong>Building Control Note:</strong> This certificate and the accompanying XML lodgement data satisfy the energy compliance requirements of Part L of the Building Regulations. You can forward this download link or the PDF directly to your Building Control Officer.
      </div>

      <p style={{ fontSize: '14px', color: '#64748b', marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        Thank you for choosing CertifyIQ for your new build compliance. We look forward to working with you on future projects.
        <br /><br />
        Best regards,<br />
        <strong>The CertifyIQ Team</strong>
      </p>
    </div>
  );
}
