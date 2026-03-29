"use client"

import { useAppSelector } from "@/hooks"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": theme === "dark" ? "var(--popover)" : "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "12px",
          "--description-color": theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-md",
          description: "group-[.toast]:text-muted-foreground font-medium",
          title: "font-bold tracking-tight",
          actionButton: "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
