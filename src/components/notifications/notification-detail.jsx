import { Calendar, ExternalLink, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationDetail({ notification }) {
  const {
    title,
    date,
    category,
    description,
    content,
    pdfUrl,
    applyUrl,
    websiteUrl,
    lastDate,
    department,
    location,
    isVisible,
  } = notification;

  // Format dates
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedLastDate = lastDate
    ? new Date(lastDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // Get badge color based on category
  const getBadgeVariant = (category) => {
    switch (category.toLowerCase()) {
      case "jobs":
        return "default";
      case "results":
        return "success";
      case "admit-cards":
        return "warning";
      case "admissions":
        return "info";
      default:
        return "secondary";
    }
  };

  if (!isVisible || isVisible != true) {
    return (
      <>
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center">
          This content may has been removed by admin
        </h1>
      </>
    );
  }

  return (
    <div className="md:flex gap-2">
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={getBadgeVariant(category.slug)}>
            {category.name}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

        <table className="w-full text-sm mb-6 border border-border rounded-lg overflow-hidden">
          <tbody>
            {department && (
              <tr className="border-b border-border">
                <td className="bg-muted text-lg font-bold px-4 py-2 w-1/3">
                  Department
                </td>
                <td className="px-4 py-2 text-lg">{department}</td>
              </tr>
            )}
            {location && (
              <tr className="border-b border-border">
                <td className="bg-muted text-lg font-bold px-4 py-2">Location</td>
                <td className="px-4 py-2 text-lg">{location}</td>
              </tr>
            )}
            {formattedLastDate && (
              <tr className="border-b border-border">
                <td className="bg-muted text-lg font-bold px-4 py-2">Last Date</td>
                <td className="px-4 py-2 text-lg">{formattedLastDate}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-lg mb-4">{description}</p>
          {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {applyUrl && (
            <Button asChild>
              <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          )}

          {pdfUrl && (
            <Button variant="outline" className="bg-blue-500" asChild>
              <a
                href={pdfUrl}
                target="_blank"
                className="text-gray-50"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-2 text-gray-50" /> View Official
                PDF
              </a>
            </Button>
          )}

          {websiteUrl && (
            <Button variant="outline" asChild className="bg-red-400">
              <a
                href={websiteUrl}
                target="_blank"
                className="text-gray-50"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2 text-gray-50" /> Visit
                Official Website
              </a>
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg text-sm">
          <p className="font-semibold">Disclaimer:</p>
          <p>
            The information provided here is based on the official notification.
            Please verify all details from the official website before applying.
          </p>
        </div>
      </div>
      <div>
        advertisement here
      </div>
    </div>
  );
}
