"use client"

import { useState } from "react"
import { 
  Users, 
  Settings, 
  MessageSquare, 
  User,
  FileText,
  Database,
  LayoutGrid
} from "lucide-react"
import cx from "@/utils/cx"
import PersonaManagement from "./PersonaManagement"
import ModelSettings from "./ModelSettings"
import UserManagement from "./UserManagement"
import SystemPromptSettings from "./SystemPromptSettings"


// Tab definition
interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<string>("personas")

  // Define all admin tabs
  const tabs: Tab[] = [
    {
      id: "personas",
      label: "Personas",
      icon: <User size={18} />,
      content: <PersonaManagement />
    },
    {
      id: "model-settings",
      label: "Model Settings",
      icon: <Settings size={18} />,
      content: <ModelSettings />
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={18} />,
      content: <UserManagement />
    },
    {
      id: "system-prompt",
      label: "System Prompt",
      icon: <MessageSquare size={18} />,
      content: <SystemPromptSettings />
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your application settings, users, and personas from this central dashboard.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                "inline-flex items-center gap-2 px-4 py-3 text-sm font-medium",
                "border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[60vh]">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}