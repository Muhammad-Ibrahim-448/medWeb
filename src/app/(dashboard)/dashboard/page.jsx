// src/app/(dashboard)/dashboard/page.jsx
'use client'

import { motion } from 'framer-motion'
import { Gem, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/25 mb-6">
          <Gem className="h-7 w-7 text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl    text-stone-900 mb-3">
          Welcome back!
        </h1>

        <p className="text-stone-500 text-base leading-relaxed mb-6">
          Your boutique dashboard is ready. Manage products, orders, and
          customers — all in one place.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Have a great day ahead
        </div>
      </motion.div>
    </div>
  )
}