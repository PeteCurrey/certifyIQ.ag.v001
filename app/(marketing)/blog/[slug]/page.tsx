import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import styles from './post.module.css'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('title, seo_title, seo_description')
    .eq('slug', slug)
    .single()
  let seoTitle = data?.seo_title || data?.title || 'Blog Post'
  if (seoTitle.endsWith(' | Avorria')) seoTitle = seoTitle.replace(' | Avorria', '')
  if (seoTitle.endsWith(' | CertifyIQ')) seoTitle = seoTitle.replace(' | CertifyIQ', '')

  const url = `https://avorria.co.uk/blog/${slug}`

  return {
    title: seoTitle,
    description: data?.seo_description || '',
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      type: 'article',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Fetch related posts (latest 3 excluding current)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt')
    .eq('published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://avorria.co.uk/blog/${slug}`
    },
    "headline": post.title,
    "description": post.seo_description || post.excerpt,
    "author": {
      "@type": "Organization",
      "name": "Avorria"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Avorria",
      "logo": {
        "@type": "ImageObject",
        "url": "https://avorria.co.uk/logo.png"
      }
    },
    "datePublished": post.published_at || new Date().toISOString()
  }

  return (
    <div className={styles.container}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div style={{ marginBottom: '2rem' }}>
        <Breadcrumbs crumbs={[
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${slug}` }
        ]} />
      </div>
      <article className={styles.article}>
        <div className={styles.meta}>
          <span className={styles.date}>
            {post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          </span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') || '' }}
        />
      </article>

      {relatedPosts && relatedPosts.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Related Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {relatedPosts.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', backgroundColor: 'var(--bg-surface-elevated)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={styles.cta}>
        <h3>Ready to book your EPC?</h3>
        <p>Fast, accredited, certificate in 24 hours.</p>
        <Link href="/book" className={styles.ctaBtn}>Book Now — from £65</Link>
      </div>
    </div>
  )
}
