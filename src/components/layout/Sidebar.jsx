// src/components/layout/Sidebar.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/helpers'
import { Gem } from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
  {
    href: '/dashboard/orders',
    label: 'Orders',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    href: '/dashboard/categories',
    label: 'Categories',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    href: '/dashboard/blog',
    label: 'Blogs',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    href: '/dashboard/customers',
    label: 'Customers',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    href: '/dashboard/messages',
    label: 'Messages',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
]

const ANIMATION_CONFIG = {
  sidebar: {
    open: { width: 256, transition: { duration: 0.3, ease: 'easeInOut' } },
    collapsed: { width: 80, transition: { duration: 0.3, ease: 'easeInOut' } },
  },
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  navItem: {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  },
}

// ─── Sub-components ────────────────────────────────────────────────

function MobileOverlay({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={ANIMATION_CONFIG.overlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  )
}

function NavIcon({ path, isActive }) {
  return (
    <svg
      className={cn(
        'h-5 w-5 flex-shrink-0 transition-transform duration-200',
        isActive ? 'scale-110' : 'group-hover:scale-110'
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  )
}

function NavLink({ item, index, isActive, isCollapsed }) {
  return (
    <motion.div
      custom={index}
      variants={ANIMATION_CONFIG.navItem}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <Link
        href={item.href}
        title={isCollapsed ? item.label : undefined}
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
          isActive
            ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-white shadow-md shadow-amber-600/25'
            : 'text-stone-600 hover:bg-amber-50 hover:text-amber-800'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.span
            layoutId="activeIndicator"
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-amber-500"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        <NavIcon path={item.icon} isActive={isActive} />
        <span
          className={cn(
            'whitespace-nowrap text-sm font-medium transition-all duration-300',
            isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
          )}
        >
          {item.label}
        </span>
      </Link>
    </motion.div>
  )
}

function ToggleButton({ onClick, isMobile = false }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
        isMobile ? 'lg:hidden' : 'hidden lg:block',
        'hover:bg-amber-50 text-stone-500 hover:text-amber-700'
      )}
      aria-label={isMobile ? 'Close sidebar' : 'Toggle sidebar'}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {isMobile ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  )
}

function UserSection({ isCollapsed }) {
  return (
    <div className="border-t border-stone-200 p-4">
      <button
        className={cn(
          'flex items-center w-full transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl p-1',
          'text-stone-600 hover:text-amber-800'
        )}
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-semibold shadow-md shadow-amber-500/25 flex-shrink-0">
          A
        </div>
        <div
          className={cn(
            'ml-3 text-left transition-all duration-300 overflow-hidden',
            isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'
          )}
        >
          <p className="text-sm font-semibold text-stone-900">
            Admin User
          </p>
          <p className="text-xs text-stone-400 group-hover:text-amber-700 transition-colors">
            View Profile
          </p>
        </div>
      </button>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export const Sidebar = () => {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useDashboard()

  return (
    <>
      <MobileOverlay isOpen={!sidebarCollapsed} onClose={toggleSidebar} />

      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 h-screen flex flex-col',
          'transition-colors duration-300',
          'bg-white border-r border-stone-200'
        )}
        initial={false}
        animate={sidebarCollapsed ? 'collapsed' : 'open'}
        variants={ANIMATION_CONFIG.sidebar}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200 flex-shrink-0">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-2 transition-all duration-300 overflow-hidden',
              sidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/25 flex-shrink-0">
              <Gem className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm   bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent whitespace-nowrap">
                Shoaib
              </span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-stone-400 whitespace-nowrap">
                Admin
              </span>
            </div>
          </Link>

          <div className="flex items-center">
            <ToggleButton onClick={toggleSidebar} />
            <ToggleButton onClick={toggleSidebar} isMobile />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {MENU_ITEMS.map((item, index) => (
            <NavLink
              key={item.href}
              item={item}
              index={index}
              isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* User Section */}
        <UserSection isCollapsed={sidebarCollapsed} />
      </motion.aside>
    </>
  )
}