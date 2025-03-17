"use client"
import { useEffect, useRef, useState } from "react"
import cx from "../utils/cx"
import { useCharacter } from "../contexts/CharacterContext"
import { CharacterModal } from "./character-modal"
import "./style.css"
import { ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen, MessageSquare, Star, Info, RefreshCw } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onToggleSidebar: () => void
  isDisabled?: boolean
}

export default function Sidebar({ isOpen, onToggleSidebar, isDisabled = false }: SidebarProps) {
  const {
    selectedCharacter,
    setSelectedCharacter,
    characters,
    loading,
    error,
    refreshCharacters
  } = useCharacter()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownFocus, setDropdownFocus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"info" | "starters">("info")

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setDropdownFocus(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDropdownClick = () => {
    if (isDisabled || loading) return

    setIsDropdownOpen((prev) => !prev)
    setDropdownFocus(true)

    setTimeout(() => {
      setDropdownFocus(false)
    }, 500)
  }

  const handleRefresh = async () => {
    await refreshCharacters()
  }

  const sidebarClasses = cx(
    "fixed left-0 top-0 h-full bg-card border-r border-border z-[1000]",
    "transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar",
    isOpen ? "w-80" : "w-14",
    isOpen ? "block" : "hidden md:block",
    isDisabled ? "pointer-events-none opacity-0 md:opacity-100" : "",
  )

  return (
    <aside className={sidebarClasses}>
      {/* Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="m-2 p-2 bg-muted hover:bg-primary/10 text-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <PanelLeftClose className="text-foreground" size={20} />
        ) : (
          <PanelLeftOpen className="text-foreground" size={20} />
        )}
      </button>

      {/* If open, show content */}
      {isOpen && (
        <div className="px-4 pb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl text-foreground gradient-text">Choose Your Character</h2>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
              disabled={loading}
              title="Refresh characters"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Button */}
            <div
              className={cx(
                "w-full p-3 border rounded-xl text-md bg-muted text-foreground cursor-pointer flex justify-between items-center transition-all duration-300",
                dropdownFocus ? "border-primary shadow-md" : "border-border",
                loading ? "opacity-70 cursor-wait" : ""
              )}
              onClick={handleDropdownClick}
            >
              <span className="truncate">
                {loading ? "Loading..." : selectedCharacter?.fullName || "Select a character"}
              </span>
              <span className="ml-2 flex-shrink-0">
                {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </div>

            {/* Dropdown List */}
            {isDropdownOpen && characters.length > 0 && (
              <ul className="absolute w-full bg-card border border-border rounded-xl mt-2 shadow-lg z-10 animate-slide-up">
                {characters.map((char) => (
                  <li
                    key={char.id}
                    onClick={() => {
                      setSelectedCharacter(char)
                      setIsDropdownOpen(false)
                    }}
                    className="p-3 hover:bg-primary/10 text-md cursor-pointer text-foreground transition-colors flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-background overflow-hidden flex-shrink-0">
                      <img
                        src={char.avatar || `/api/placeholder/32/32?text=${encodeURIComponent(char.fullName.charAt(0))}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate">{char.fullName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedCharacter && !loading && (
            <div className="rounded-xl mt-4 bg-card shadow-md border border-border overflow-hidden character-card">
              {/* Character header with avatar and name */}
              <div className="relative">
                <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center">
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="w-16 h-16 rounded-full bg-white p-1 mr-4 overflow-hidden flex-shrink-0 cursor-pointer border-2 border-white shadow-md hover:scale-105 transition-transform"
                  >
                    <img
                      src={selectedCharacter.avatar || `/api/placeholder/64/64?text=${encodeURIComponent(selectedCharacter.fullName.charAt(0))}`}
                      alt={`${selectedCharacter.fullName} Avatar`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white">{selectedCharacter.fullName}</h3>
                    <div className="badge-primary mt-1">{selectedCharacter.character_universe}</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  className={cx(
                    "flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center gap-1",
                    activeTab === "info"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setActiveTab("info")}
                >
                  <Info size={16} />
                  <span>Info</span>
                </button>
                <button
                  className={cx(
                    "flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center gap-1",
                    activeTab === "starters"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setActiveTab("starters")}
                >
                  <MessageSquare size={16} />
                  <span>Chat Starters</span>
                </button>
              </div>

              {/* Tab content */}
              <div className="p-4">
                {activeTab === "info" ? (
                  <div className="space-y-4 animate-fade-in">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Basic Info
                      </h4>
                      <p className="text-sm text-foreground">
                        {selectedCharacter.age} years old • {selectedCharacter.residence} •
                        {selectedCharacter.roleModel && ` Admires ${selectedCharacter.roleModel}`}
                      </p>
                    </div>

                    {/* Personality */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Personality
                      </h4>
                      <p className="text-sm text-foreground">{selectedCharacter.personality}</p>
                    </div>

                    {/* Scenario */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Current Scenario
                      </h4>
                      <p className="text-sm text-foreground">{selectedCharacter.scenario}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Background
                      </h4>
                      <p className="text-sm text-foreground">{selectedCharacter.description}</p>
                    </div>

                    {/* Expertise */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Expertise
                      </h4>
                      <p className="text-sm text-foreground">
                        {selectedCharacter.expertise} • {selectedCharacter.experienceLevel} level
                      </p>
                    </div>

                    {/* Future Vision */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Future Vision
                      </h4>
                      <p className="text-sm text-foreground">{selectedCharacter.tenYearVision}</p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    {/* Conversation starters */}
                    {selectedCharacter.conversation_starters?.starters?.length > 0 && (
                      <div className="space-y-2">
                        <ul className="space-y-2">
                          {selectedCharacter.conversation_starters.starters.map((starter, index) => (
                            <li
                              key={index}
                              className="p-3 border border-border bg-background hover:border-primary hover:bg-primary/5 rounded-lg text-sm text-foreground cursor-pointer transition-colors flex items-center gap-2"
                            >
                              <Star size={16} className="text-primary flex-shrink-0" />
                              <span>{starter.content}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && characters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No character profiles found.</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      )}

      {selectedCharacter && (
        <CharacterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          character={{
            name: selectedCharacter.fullName,
            avatar: selectedCharacter.avatar || `/api/placeholder/200/200?text=${encodeURIComponent(selectedCharacter.fullName.charAt(0))}`,
            description: selectedCharacter.description,
            price: `Age: ${selectedCharacter.age} • ${selectedCharacter.expertise} • ${selectedCharacter.experienceLevel}`,
          }}
        />
      )}
    </aside>
  )
}