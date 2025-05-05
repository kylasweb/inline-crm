import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SidebarContext,
} from "@/lib/sidebar"
import type { 
  KeyboardEvent, 
  CSSProperties, 
  ClassAttributes, 
  HTMLAttributes, 
  ForwardedRef, 
  LegacyRef, 
  ComponentProps, 
  ReactNode, 
  ElementType, 
  MouseEvent, 
  ReactElement, 
  ButtonHTMLAttributes,
  MouseEventHandler
} from 'react'
import { LiHTMLAttributes } from 'react'

type SidebarContextType = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    React.useEffect(() => {
      const handleKeyDown = (event: React.KeyboardEvent<Element>) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }
      window.addEventListener("keydown", handleKeyDown as any);
      return () => window.removeEventListener("keydown", handleKeyDown as any);
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContextType>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties}
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

type SidebarMenuItemProps = Omit<React.ComponentProps<"li">, 'title'> & {
  asChild?: boolean
  showIcon?: boolean
  title?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, asChild = false, showIcon = false, title, onClick, ...props }, ref) => {
    const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
      type: "button",
      onClick,
      className: cn(
        "relative flex h-9 w-full cursor-pointer select-none items-center rounded-md px-2.5 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )
    }

    const button = asChild ? (
      <Slot {...buttonProps} />
    ) : (
      <button {...buttonProps} />
    )

    return (
      <li {...props} ref={ref}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right">
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    )
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuItemLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref: ForwardedRef<HTMLSpanElement>) => (
  <span
    ref={ref}
    data-sidebar="menu-item-label"
    className={cn(
      "flex-1 truncate text-sidebar-foreground",
      className
    )}
    {...props}
  />
))
SidebarMenuItemLabel.displayName = "SidebarMenuItemLabel"

const SidebarMenuItemIcon = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<"svg">
>(({ className, ...props }, ref: ForwardedRef<SVGSVGElement>) => {
  return (
    <svg
      ref={ref}
      data-sidebar="menu-item-icon"
      className={cn(
        "h-4 w-4 shrink-0 text-sidebar-foreground/70",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuItemIcon.displayName = "SidebarMenuItemIcon"

export {
  useSidebar,
  SidebarProvider,
  SidebarMenuItem,
  SidebarMenuItemLabel,
  SidebarMenuItemIcon,
}
