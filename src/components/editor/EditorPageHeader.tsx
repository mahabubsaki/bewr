import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";

interface Props {
  /** Page title, e.g. "Anschreiben" */
  title: string;
  /** Icon element shown in the gradient square */
  icon: React.ReactNode;
  /** Tailwind gradient classes for the icon square, e.g. "bg-linear-to-br from-emerald-500 to-teal-600" */
  gradient: string;
  /** Glow color for the icon shadow, e.g. "shadow-emerald-500/30" */
  glow: string;
  /** Breadcrumb child label, e.g. "Anschreiben Editor" */
  breadcrumbLabel: string;
  onBack: () => void;
  /** Action buttons rendered on the right side */
  children: React.ReactNode;
}

export default function EditorPageHeader({
  title,
  icon,
  gradient,
  glow,
  breadcrumbLabel,
  onBack,
  children,
}: Props) {
  return (
    <motion.div
      className="sticky top-16 z-30 border-b bg-background/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Left: icon + title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-lg sm:hidden"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
          </Button>

          <motion.div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ${gradient} ${glow}`}
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {icon}
          </motion.div>

          <div>
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={onBack} className="cursor-pointer text-xs">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs">{breadcrumbLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-lg font-extrabold tracking-tight sm:text-xl">{title}</h1>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </motion.div>
  );
}
