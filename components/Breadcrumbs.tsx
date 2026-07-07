import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  themeColor?: string; // e.g. "red" or "blue"
}

export default function Breadcrumbs({ items, themeColor = "blue" }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith("http") ? item.item : `https://physicsfundamentals.cc${item.item}`
    }))
  };

  const getHoverClass = () => {
    switch (themeColor) {
      case "red": return "hover:text-red-500";
      case "blue": return "hover:text-blue-500";
      case "indigo": return "hover:text-indigo-500";
      case "amber": return "hover:text-amber-500";
      case "emerald": return "hover:text-emerald-500";
      case "purple": return "hover:text-purple-500";
      case "pink": return "hover:text-pink-500";
      case "cyan": return "hover:text-cyan-500";
      case "orange": return "hover:text-orange-500";
      default: return "hover:text-blue-500";
    }
  };

  const getBadgeClass = () => {
    switch (themeColor) {
      case "red": return "text-red-600 bg-red-50";
      case "blue": return "text-blue-600 bg-blue-50";
      case "indigo": return "text-indigo-600 bg-indigo-50";
      case "amber": return "text-amber-600 bg-amber-50";
      case "emerald": return "text-emerald-600 bg-emerald-50";
      case "purple": return "text-purple-600 bg-purple-50";
      case "pink": return "text-pink-600 bg-pink-50";
      case "cyan": return "text-cyan-600 bg-cyan-50";
      case "orange": return "text-orange-600 bg-orange-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div 
        className="flex flex-wrap items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" 
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
          Home
        </Link>
        {items.slice(1).map((item, index) => {
          const isLast = index === items.length - 2;
          return (
            <React.Fragment key={item.item}>
              <span className="text-slate-300" aria-hidden="true">/</span>
              {isLast ? (
                <span className={`px-2 py-0.5 rounded-md ${getBadgeClass()}`}>
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={item.item} 
                  className={`text-slate-500 transition-colors ${getHoverClass()}`}
                >
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

