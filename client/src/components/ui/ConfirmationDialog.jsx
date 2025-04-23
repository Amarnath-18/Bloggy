import React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" // or "warning", "info"
}) => {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      case "warning":
        return "bg-yellow-500 text-white hover:bg-yellow-600"
      case "info":
        return "bg-blue-500 text-white hover:bg-blue-600"
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-md",
              "bg-secondary text-secondary-foreground",
              "hover:bg-secondary/90",
              "transition-colors"
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={cn(
              "px-4 py-2 rounded-md",
              "transition-colors",
              getVariantStyles()
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog