import React from "react";
// Import all shadcn/ui components for MDX usage
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  } from "./ui/accordion"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from "./ui/alert-dialog"
  
  import { 
    Alert, 
    AlertTitle, 
    AlertDescription 
  } from "./ui/alert"
  
  import { AspectRatio } from "./ui/aspect-ratio"
  
  import {
    Avatar,
    AvatarFallback,
    AvatarImage
  } from "./ui/avatar"
  
  import { Badge, badgeVariants } from "./ui/badge"
  
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "./ui/breadcrumb"
  
  import { Button, buttonVariants } from "./ui/button"
  
  import { Calendar } from "./ui/calendar"
  
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from "./ui/card"
  
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
  } from "./ui/carousel"
  
  import { Checkbox } from "./ui/checkbox"
  
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
  } from "./ui/collapsible"
  
  import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
  } from "./ui/command"
  
  import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger
  } from "./ui/context-menu"
  
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "./ui/dialog"
  
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
  } from "./ui/drawer"

  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
  } from "./ui/hover-card"
  
  import { Input } from "./ui/input"
  
  import { Label } from "./ui/label"
  
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
  } from "./ui/pagination"
  
  import {
    Popover,
    PopoverContent,
    PopoverTrigger
  } from "./ui/popover"
  
  import { Progress } from "./ui/progress"
  
  import {
    RadioGroup,
    RadioGroupItem
  } from "./ui/radio-group"
  
  import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from "./ui/resizable"
  
  import {
    ScrollArea,
    ScrollBar
  } from "./ui/scroll-area"
  
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
  } from "./ui/select"
  
  import { Separator } from "./ui/separator"
  
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from "./ui/sheet"
  
  import { Skeleton } from "./ui/skeleton"
  
  import { Slider } from "./ui/slider"
  
  import { Switch } from "./ui/switch"
  
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
  } from "./ui/table"
  
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
  } from "./ui/tabs"
  
  import { Textarea } from "./ui/textarea"
  
  import {
    ToggleGroup,
    ToggleGroupItem
  } from "./ui/toggle-group"
  
  import { Toggle } from "./ui/toggle"
  
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from "./ui/tooltip"
  
  import { CodeBlock } from "./ui/CodeBlock"
  
  // Create a non-async version of the CodeBlock for any inline usage
  // This will just be a placeholder since we pre-process code blocks
  const StaticCodeBlock = ({ children, className, title }: { children: string; className?: string; title?: string }) => {
    return (
      <div className="pre-rendered-code-block">
        {/* This should never render directly - our preprocessor replaces these */}
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    );
  };
  
  // Export all components for MDX usage
  export const mdxComponents = {
    // Layout and Containers
    AspectRatio,
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
    Collapsible, CollapsibleContent, CollapsibleTrigger,
    ResizableHandle, ResizablePanel, ResizablePanelGroup,
    ScrollArea, ScrollBar,
    Separator,
    
    // Typography and Text
    Badge,
    
    // Navigation
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
    
    // Form Controls
    Button,
    Checkbox,
    Input,
    Label,
    RadioGroup, RadioGroupItem,
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
    Slider,
    Switch,
    Textarea,
    Toggle,
    ToggleGroup, ToggleGroupItem,
    
    // Data Display
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
    Avatar, AvatarFallback, AvatarImage,
    Calendar,
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
    Progress,
    Skeleton,
    Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,
    Tabs, TabsContent, TabsList, TabsTrigger,
    
    // Feedback
    Alert, AlertTitle, AlertDescription,
    
    // Overlay
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
    Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,
    ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger,
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
    Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
    HoverCard, HoverCardContent, HoverCardTrigger,
    Popover, PopoverContent, PopoverTrigger,
    Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  
    // Code Blocks
    code: StaticCodeBlock,
    CodeBlock: CodeBlock,
    pre: (props: any) => {
      const child = props.children?.props;
      if (!child || child.mdxType !== "code") return <pre {...props} />;
      return (
        <CodeBlock className={child.className} {...child}>
          {child.children}
        </CodeBlock>
      );
    },
    // Make sure links open in a new tab
    a: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  }
