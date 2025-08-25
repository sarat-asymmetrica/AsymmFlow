// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
// ⛳ code-map: ui-toast::renderer (docs/code-map/ui-components.md#ui-toast)
// ---
// file: src/components/ui/toaster.tsx
// line-range: 1-52
// lifecycle: active
// energy-cost: Low
// memory-density: Medium
// interference-mode: High
// refraction-type: UI-feedback, renderer
// agent-role: Mira (UX)
// evolution-stage: adult
// test-coverage: TBD
// last-sweep: Sweep-META-005
// connected-modules: "@/components/ui/toast", "@/components/ui/use-toast"
// author: shadcn/ui
// ---
"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
