"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

interface ModelAnswerDisplayProps {
  content: string;
  isStreaming: boolean;
}

export function ModelAnswerDisplay({ content, isStreaming }: ModelAnswerDisplayProps) {
  if (!content && !isStreaming) return null;

  return (
    <div className="space-y-2">
      {isStreaming && !content && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>模範解答を生成中...</span>
        </div>
      )}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mt-6 mb-2 text-foreground border-l-4 border-primary pl-3">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-sm font-semibold mt-4 mb-1 text-foreground">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="text-sm space-y-1 mb-3 pl-4 list-disc marker:text-primary">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="text-sm space-y-1 mb-3 pl-4 list-decimal">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-foreground/80">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  );
}
