import { Sparkles } from "lucide-react"

const PoweredBy = () => {
  return (
    <div className="mt-4 text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs md:text-sm">
        <Sparkles size={14} className="text-primary" />
        <span>Powered by PersonaAI - Bringing anime characters to life</span>
      </div>
    </div>
  )
}

export default PoweredBy

