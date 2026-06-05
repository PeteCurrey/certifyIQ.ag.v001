import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import styles from './result.module.css'

async function getCertificate(lmk: string) {
  const email = process.env.EPC_API_EMAIL
  const key = process.env.EPC_API_KEY
  if (!email || !key) return null

  const auth = 'Basic ' + Buffer.from(`${email}:${key}`).toString('base64')
  
  // Try domestic first
  let res = await fetch(`https://epc.opendatacommunities.org/api/v1/domestic/certificate/${encodeURIComponent(lmk)}`, {
    headers: { Accept: 'application/json', Authorization: auth },
    next: { revalidate: 3600 }
  })
  
  let isDomestic = true
  if (!res.ok) {
    // Try non-domestic
    res = await fetch(`https://epc.opendatacommunities.org/api/v1/non-domestic/certificate/${encodeURIComponent(lmk)}`, {
      headers: { Accept: 'application/json', Authorization: auth },
      next: { revalidate: 3600 }
    })
    isDomestic = false
  }

  if (!res.ok) return null

  const data = await res.json()
  const row = data.rows?.[0] || data
  
  let recommendations = []
  if (isDomestic) {
    const recRes = await fetch(`https://epc.opendatacommunities.org/api/v1/domestic/recommendations/${encodeURIComponent(lmk)}`, {
      headers: { Accept: 'application/json', Authorization: auth },
      next: { revalidate: 3600 }
    })
    if (recRes.ok) {
      const recData = await recRes.json()
      recommendations = recData.rows || []
    }
  }

  return { row, isDomestic, recommendations }
}

function expiryInfo(lodgement: string) {
  if (!lodgement) return { label: 'Unknown', isExpired: false, daysLeft: 999 }
  const lodged = new Date(lodgement)
  const expires = new Date(lodged)
  expires.setFullYear(expires.getFullYear() + 10)
  const now = new Date()
  const msLeft = expires.getTime() - now.getTime()
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const expStr = expires.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  
  if (daysLeft < 0) return { label: `Expired ${expStr}`, isExpired: true, daysLeft }
  if (daysLeft < 180) return { label: `Expires ${expStr}`, isExpired: false, daysLeft }
  return { label: `Valid until ${expStr}`, isExpired: false, daysLeft }
}

function generateExplanation(rating: string, propType: string, year: number | string) {
  const r = rating.toUpperCase()
  if (['A', 'B'].includes(r)) {
    return `Your property holds an excellent EPC rating of ${r}. This indicates very high energy efficiency, meaning lower running costs and a smaller carbon footprint. This is highly attractive to both buyers and tenants.`
  }
  if (['C', 'D'].includes(r)) {
    return `Your property currently holds an EPC rating of ${r}. This is very common for ${propType.toLowerCase()}s in the UK. Implementing some of the recommended improvements could easily boost the efficiency to a higher band, reducing your energy bills.`
  }
  return `Your property currently holds an EPC rating of ${r}, which is below average. This is often the case for older ${propType.toLowerCase()}s. Immediate attention to the recommended improvements below is highly advised to reduce excessive heating costs and comply with future letting regulations.`
}

export default async function ResultPage({ params }: { params: Promise<{ lmk: string }> }) {
  const resolvedParams = await params;
  const lmk = resolvedParams.lmk;
  const data = await getCertificate(lmk)
  if (!data || !data.row) {
    notFound()
  }

  const { row, recommendations } = data
  const rating = row['current-energy-rating'] || row['asset-rating-band'] || 'G'
  const potential = row['potential-energy-rating'] || rating
  const lodged = row['lodgement-datetime']
  const lodgedYear = lodged ? new Date(lodged).getFullYear() : '—'
  const expiry = expiryInfo(lodged)

  const annualCost = (Number(row['lighting-cost-current']) || 0) +
    (Number(row['heating-cost-current']) || 0) +
    (Number(row['hot-water-cost-current']) || 0)
    
  const potentialCost = (Number(row['lighting-cost-potential']) || 0) +
    (Number(row['heating-cost-potential']) || 0) +
    (Number(row['hot-water-cost-potential']) || 0)

  const savings = annualCost - potentialCost

  const fullAddress = [row['address1'], row['address2'], row['address3'], row['postcode']]
    .filter(Boolean).join(', ')
    
  const propType = row['property-type'] || 'property'
  const isBadRating = ['D', 'E', 'F', 'G'].includes(rating)

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <Link href="/epc-register" className={styles.backLink}>← Back to search</Link>
        <h1 className={styles.title}>{fullAddress}</h1>
        <p className={styles.subtitle}>{row['built-form'] || ''} {propType} · Certificate {lmk}</p>
      </div>

      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.mainCol}>
          {/* SECTION 1: Summary Card */}
          <section className={styles.card}>
            <div className={styles.summaryTop}>
              <div className={styles.ratingBox}>
                <span className={styles.ratingLabel}>Current Rating</span>
                <RatingBadge rating={rating} size="lg" />
              </div>
              <div className={styles.ratingBox}>
                <span className={styles.ratingLabel}>Potential Rating</span>
                <RatingBadge rating={potential} size="md" />
              </div>
            </div>
            
            <div className={styles.statusBanner} data-expired={expiry.isExpired}>
              <div className={styles.statusDot} />
              <span className={styles.statusText}>{expiry.label}</span>
            </div>
          </section>

          {/* SECTION 2: AI Explanation */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Efficiency Insight</h2>
            <p className={styles.explanationText}>
              {generateExplanation(rating, propType, lodgedYear)}
            </p>
          </section>

          {/* SECTION 3: Improvements */}
          {recommendations && recommendations.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Improvement Opportunities</h2>
              <div className={styles.recList}>
                {recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className={styles.recItem}>
                    <div className={styles.recHeader}>
                      <span className={styles.recName}>{rec['improvement-summary-text']}</span>
                    </div>
                    <div className={styles.recDetails}>
                      <div className={styles.recMetric}>
                        <span className={styles.recMetricLabel}>Est. Cost</span>
                        <span className={styles.recMetricVal}>£{rec['indicative-cost'] || '?'}</span>
                      </div>
                      <div className={styles.recMetric}>
                        <span className={styles.recMetricLabel}>Priority</span>
                        <span className={styles.recMetricVal} style={{textTransform: 'capitalize'}}>{rec['improvement-id-text']}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 5: Landlord Compliance Checker */}
          {isBadRating && (
            <section className={`${styles.card} ${styles.complianceCard}`}>
              <h2 className={styles.cardTitle}>Landlord Compliance Alert</h2>
              <p className={styles.explanationText}>
                Your property is currently rated <strong>{rating}</strong>. Minimum Energy Efficiency Standards (MEES) currently require rental properties to be at least Band E. Future legislation may raise this threshold to Band C. If you are a landlord, you may need to take action.
              </p>
              <Link href="/book" className={styles.actionBtn}>Consult an Assessor</Link>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.sideCol}>
          {/* SECTION 6: CTA Block */}
          <section className={`${styles.card} ${styles.ctaCard}`}>
            <h3 className={styles.ctaTitle}>Need a new EPC?</h3>
            <p className={styles.ctaText}>
              {expiry.isExpired 
                ? "This certificate has expired. Book a new assessment to stay compliant."
                : "Has your property changed since this was lodged? Book a new assessment to update your rating."}
            </p>
            <Link href="/book" className={styles.primaryBtn}>Book EPC from £65</Link>
          </section>

          {/* SECTION 4: Cost Insights */}
          {annualCost > 0 && (
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Energy Cost Insights</h3>
              <div className={styles.costGrid}>
                <div className={styles.costBox}>
                  <span className={styles.costLabel}>Est. Annual Cost</span>
                  <span className={styles.costVal}>£{Math.round(annualCost).toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className={styles.costBox} style={{ background: '#F0FFF0', borderColor: '#9BFF59' }}>
                    <span className={styles.costLabel}>Potential Savings</span>
                    <span className={styles.costVal} style={{ color: '#091A12' }}>£{Math.round(savings).toLocaleString()}/yr</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 7: Download Centre */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Download Centre</h3>
            <div className={styles.downloadLinks}>
              <a 
                href={`https://epc.opendatacommunities.org/domestic/${lmk}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.secondaryBtn}
              >
                View Official Gov Register
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
