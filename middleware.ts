import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { hasPermission, UserRole } from './lib/aos/permissions'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect customer portal routes
  if (pathname.startsWith('/portal') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect admin/AOS routes
  if (pathname.startsWith('/aos')) {
    const isLogin = pathname === '/aos/login'
    const isInvite = pathname.startsWith('/aos/accept-invite')
    const is403 = pathname === '/aos/403'

    if (!isLogin && !isInvite && !is403) {
      if (!user) {
        return NextResponse.redirect(new URL('/aos/login', request.url))
      }

      // Query role from aos_users
      const { data: aosUser } = await supabase
        .from('aos_users')
        .select('role, status')
        .eq('email', user.email)
        .maybeSingle()

      if (!aosUser || aosUser.status !== 'active') {
        // Logged in user not found in aos_users or inactive
        return NextResponse.redirect(new URL('/aos/login', request.url))
      }

      // Map paths to module names
      const pathParts = pathname.split('/') // ['', 'aos', 'users', ...]
      const moduleName = pathParts[2] || 'dashboard'

      let permissionKey = moduleName
      if (pathname.startsWith('/aos/settings/audit')) {
        permissionKey = 'users' // super_admin only
      } else if (moduleName === 'dispatch') {
        permissionKey = 'bookings'
      } else if (moduleName === 'leads') {
        permissionKey = 'quotes'
      } else if (moduleName === 'revenue') {
        permissionKey = 'analytics'
      } else if (moduleName === 'team') {
        permissionKey = 'users'
      } else if (moduleName === 'website') {
        permissionKey = 'content'
      } else if (moduleName === 'qa-alerts') {
        permissionKey = 'qa'
      } else if (moduleName === 'agents') {
        permissionKey = 'integrations'
      } else if (
        moduleName === 'schedule' || 
        moduleName === 'assessments' || 
        moduleName === 'assess' || 
        moduleName === 'sap' || 
        moduleName === 'airtest' || 
        moduleName === 'commercial'
      ) {
        permissionKey = 'bookings'
      }

      if (!hasPermission(aosUser.role as UserRole, permissionKey)) {
        return NextResponse.redirect(new URL('/aos/403', request.url))
      }
    }
  }

  // Protect master compliance dashboard
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect agency portal
  if (pathname.startsWith('/agency') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect new Agent Portal
  if (pathname.startsWith('/agent') && pathname !== '/agent/login' && !user) {
    return NextResponse.redirect(new URL('/agent/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
