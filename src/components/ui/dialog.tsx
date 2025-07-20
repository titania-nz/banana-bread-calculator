import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Dialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { open, setOpen } as any)
          : child
      )}
    </div>
  )
}

const DialogTrigger = ({ children, className, open, setOpen, ...props }: { 
  children: React.ReactNode
  className?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  [key: string]: any
}) => {
  return (
    <div 
      onClick={() => setOpen?.(true)} 
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogContent = ({ 
  children, 
  className, 
  open, 
  setOpen 
}: { 
  children: React.ReactNode
  className?: string
  open?: boolean
  setOpen?: (open: boolean) => void
}) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => setOpen?.(false)}
      />
      <div className={cn(
        "relative bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-lg",
        className
      )}>
        <button
          onClick={() => setOpen?.(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>
}

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-600 mt-2">{children}</p>
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }