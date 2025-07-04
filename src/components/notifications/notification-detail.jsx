"use client";

import { Calendar, ExternalLink, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import "./global.css";

export default function NotificationDetail({ notification }) {
  // Safety check for notification object
  if (!notification) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Notification not found
        </h1>
      </div>
    );
  }

  const {
    title,
    date,
    category,
    description,
    content,
    pdfUrl,
    applyUrl,
    websiteUrl,
    loginUrl,
    resultUrl,
    admitCardUrl,
    lastDate,
    department,
    location,
    isVisible,
  } = notification;

  // Format dates with error handling
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return null;
    }
  };

  const formattedDate = formatDate(date);
  const formattedLastDate = formatDate(lastDate);

  // Get badge color based on category
  const getBadgeVariant = (categoryObj) => {
    if (!categoryObj) return "secondary";
    
    const categoryName = typeof categoryObj === 'string' 
      ? categoryObj.toLowerCase() 
      : (categoryObj.name || categoryObj.slug || "").toLowerCase();
    
    switch (categoryName) {
      case "jobs":
        return "default";
      case "results":
        return "destructive";
      case "admit-cards":
      case "admit cards":
        return "secondary";
      case "admissions":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    
    const shareData = {
      title: title || "Notification",
      text: description || "Check out this notification!",
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard failed:", clipboardError);
        alert("Failed to copy link. Please copy the URL manually.");
      }
    }
  };

  // Check visibility
  if (!isVisible) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          This content may have been removed by admin
        </h1>
      </div>
    );
  }

  return (
    <div className="md:flex gap-2 justify-center">
      <div className="bg-card rounded-lg border border-border p-6 mb-8 max-w-[800px] w-full">
        {/* Header section */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {category && (
            <Badge variant={getBadgeVariant(category)}>
              {typeof category === 'string' ? category : category.name}
            </Badge>
          )}
          {formattedDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">
          {title || "Untitled Notification"}
        </h1>

        {/* Information table */}
        {(department || location || formattedLastDate) && (
          <table className="w-full text-sm mb-6 border border-border rounded-lg overflow-hidden">
            <tbody>
              {department && (
                <tr className="border-b border-border">
                  <td className="bg-muted text-lg font-bold px-4 py-2 w-1/3">
                    Department
                  </td>
                  <td className="px-4 py-2 text-lg break-words">{department}</td>
                </tr>
              )}
              {location && (
                <tr className="border-b border-border">
                  <td className="bg-muted text-lg font-bold px-4 py-2">
                    Location
                  </td>
                  <td className="px-4 py-2 text-lg break-words">{location}</td>
                </tr>
              )}
              {formattedLastDate && (
                <tr className="border-b border-border">
                  <td className="bg-muted text-lg font-bold px-4 py-2">
                    Last Date
                  </td>
                  <td className="px-4 py-2 text-lg">{formattedLastDate}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Content section */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          {description && (
            <p className="text-lg mb-4 break-words">{description}</p>
          )}
          {content && (
            <div
              className="mycontent break-words"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {applyUrl && (
            <Button asChild>
              <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          )}

          {pdfUrl && (
            <Button variant="outline" className="bg-blue-500 hover:bg-blue-600" asChild>
              <a
                href={pdfUrl}
                target="_blank"
                className="text-white hover:text-white"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Official PDF
              </a>
            </Button>
          )}

          {websiteUrl && (
            <Button variant="outline" className="bg-red-500 hover:bg-red-600" asChild>
              <a
                href={websiteUrl}
                target="_blank"
                className="text-white hover:text-white"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Official Website
              </a>
            </Button>
          )}

          {loginUrl && (
            <Button variant="outline" className="bg-orange-500 hover:bg-orange-600" asChild>
              <a
                href={loginUrl}
                target="_blank"
                className="text-white hover:text-white"
                rel="noopener noreferrer"
              >
                🔐 Login
              </a>
            </Button>
          )}

          {resultUrl && (
            <Button variant="outline" className="bg-green-600 hover:bg-green-700" asChild>
              <a
                href={resultUrl}
                target="_blank"
                className="text-white hover:text-white"
                rel="noopener noreferrer"
              >
                📝 Check Result
              </a>
            </Button>
          )}

          {admitCardUrl && (
            <Button variant="outline" className="bg-purple-600 hover:bg-purple-700" asChild>
              <a
                href={admitCardUrl}
                target="_blank"
                className="text-white hover:text-white"
                rel="noopener noreferrer"
              >
                🎫 Admit Card
              </a>
            </Button>
          )}

          {/* Share button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 p-4 rounded-lg text-sm">
          <p className="font-semibold">Disclaimer:</p>
          <p>
            The information provided here is based on the official notification.
            Please verify all details from the official website before applying.
          </p>
        </div>
      </div>
      {/* Advertisement section can be added here */}
      {/* <div>advertisement here</div> */}
    </div>
  );
}