"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipIconProps {
  tag: string;
  loading?: "eager" | "lazy"; // ✅ Added dynamic loading prop
}

export function TooltipIcon({ tag, loading }: TooltipIconProps) {
  const lowercaseTag = tag.toLowerCase();
  const getIconPath = (tag: string) => `/images/Dev-Icons/${lowercaseTag}.svg`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <img
            src={getIconPath(tag)}
            alt={tag}
            loading={loading}
            width="32"
            height="32"
            className="h-8 w-auto object-contain transition-transform hover:scale-110"
          />
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p className="text-xs font-medium text-foreground">{tag}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
