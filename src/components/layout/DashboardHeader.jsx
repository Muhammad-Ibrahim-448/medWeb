// src/components/layout/DashboardHeader.jsx
'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Dropdown, DropdownItem } from '@/components/common/Dropdown'
import { Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { cn } from '@/lib/helpers'
import { useDashboardHeaderStyles } from '@/lib/theme-helpers'

export const DashboardHeader = () => {
  const { user, logout } = useAuth()
  const { toggleSidebar } = useDashboard()
  const headerStyles = useDashboardHeaderStyles()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "sticky top-0 z-30",
        "backdrop-blur-xl border-b",
        headerStyles.container
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side */}
        <div className="flex items-center flex-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              headerStyles.iconButton
            )}
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User Dropdown */}
          <Dropdown
            trigger={
              <motion.button
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-colors",
                  headerStyles.userButton
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg",
                  "bg-gradient-to-br from-blue-500 to-purple-600",
                  "shadow-blue-500/25"
                )}>
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className={cn(
                    "text-sm font-medium",
                    headerStyles.dropdownText
                  )}>
                    {user?.name || 'Admin'}
                  </p>
                  <p className={cn(
                    "text-xs",
                    headerStyles.dropdownSubtext
                  )}>
                    {user?.role || 'Administrator'}
                  </p>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4",
                  headerStyles.dropdownSubtext
                )} />
              </motion.button>
            }
          >
            <div className={cn(
              "w-52 py-2 rounded-xl shadow-xl",
              headerStyles.dropdownContainer
            )}>
              <div className="px-4 py-2 border-b border-slate-200">
                <p className={cn(
                  "text-sm font-medium",
                  headerStyles.dropdownText
                )}>
                  {user?.name || 'Admin'}
                </p>
                <p className={cn(
                  "text-xs",
                  headerStyles.dropdownSubtext
                )}>
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <DropdownItem icon={User}>
                Profile
              </DropdownItem>
              <DropdownItem icon={Settings}>
                Settings
              </DropdownItem>
              <div className="border-t border-slate-200 my-1 flex w-full" />
              <DropdownItem 
                onClick={logout} 
                icon={LogOut}
                className="text-rose-600 hover:bg-rose-50"
              >
                Logout
              </DropdownItem>
            </div>
          </Dropdown>
        </div>
      </div>
    </motion.header>
  )
}