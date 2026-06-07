import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import styles from './blog.module.css'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://avorria.co.uk/blog',
  },
  openGraph: {
    url: 'https://avorria.co.uk/blog',
  },
  title: 'EPC Blog & Guides',
  description: 'Expert guides on EPCs, energy efficiency, the 2028 landlord regulations, and how to improve your property rating.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>EPC Knowledge Hub</span>
        <h1 className={styles.title}>Guides & Insights</h1>
        <p className={styles.subtitle}>
          Expert advice on energy performance certificates, landlord regulations, retrofit planning, and what RdSAP 10 means for your property.
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className={styles.grid}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
              <div className={styles.cardMeta}>
                <span className={styles.date}>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
              </div>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>
              <span className={styles.readMore}>Read article →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Blog posts coming soon. Check back shortly.</p>
        </div>
      )}
    </div>
  )
}
