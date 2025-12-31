import { useState } from "react";
import ToggleButton from "./ToggleButton";

export default function ArticleCard({ article }) {
  const [showUpdated, setShowUpdated] = useState(false);

  // Extract image from content if available
  const extractImage = (html) => {
    if (!html) return null;
    const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
    return imgMatch ? imgMatch[1] : null;
  };

  const featuredImage = extractImage(article.original_content) || extractImage(article.updated_content);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Estimate read time
  const estimateReadTime = (html) => {
    if (!html) return "1 min read";
    const text = html.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min${minutes > 1 ? "s" : ""} read`;
  };

  const readTime = estimateReadTime(showUpdated ? article.updated_content : article.original_content);

  return (
    <article className="bg-white border-b border-gray-200 pb-8 mb-8 last:border-b-0 last:mb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Article Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full font-medium">
              Editing
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full font-medium">
              Case study
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {article.title || "Article Title"}
          </h2>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>Education</span>
            <span>•</span>
            <span>{formatDate(article.created_at || article.scraped_at)}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          {/* Toggle Button */}
          <div className="pt-2">
            <ToggleButton
              showUpdated={showUpdated}
              setShowUpdated={setShowUpdated}
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 mt-6">
            {showUpdated ? (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    article.updated_content ||
                    "<p class='text-gray-500 italic'>No updated content available</p>",
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: article.original_content || "<p class='text-gray-500'>No content available</p>",
                }}
              />
            )}
          </div>

          {/* References */}
          {article.references?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">References</h4>
              <ul className="space-y-2">
                {article.references.map((ref, i) => (
                  <li key={i} className="text-sm">
                    <a
                      href={ref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline break-all transition-colors"
                    >
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Featured Image & Author Box */}
        <div className="lg:col-span-1 space-y-6">
          {/* Featured Image */}
          {featuredImage ? (
            <div className="w-full">
              <img
                src={featuredImage}
                alt={article.title}
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-full bg-gray-200 rounded-lg aspect-[4/3] flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Author Box */}
          <div className="bg-gray-50 rounded-lg p-5 sm:p-6">
            <div className="flex items-start space-x-4">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  {article.author?.name?.[0] || "A"}
                </div>
              </div>
              {/* Author Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                  {article.author?.name || "Author Name"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">Author</p>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  {article.author?.bio || "He is one of our best writer about premium content and creators"}
                </p>
                {/* Social Icons */}
                <div className="flex items-center space-x-3 mt-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

