import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import styles from './post.module.css'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('seo_title, seo_description')
    .eq('slug', slug)
    .single()
  return {
    title: data?.seo_title || 'Blog Post | Avorria',
    description: data?.seo_description || '',
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

  return (
    <div className={styles.container}>
      <Link href="/blog" className={styles.backLink}>← Back to Blog</Link>
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
      <div className={styles.cta}>
        <h3>Ready to book your EPC?</h3>
        <p>Fast, accredited, certificate in 24 hours.</p>
        <Link href="/book" className={styles.ctaBtn}>Book Now — from £65</Link>
      </div>
    </div>
  )
}
