import type { ComponentPropsWithRef, ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cx } from "../../lib/classes.js";
import styles from "./markdown-content.module.css";

export interface MarkdownContentProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  /** Markdown source. Raw HTML is omitted. */
  content: string;
}

/** Compact, safe Markdown for messages, notes, and documentation. */
export const MarkdownContent = ({
  content,
  className,
  ...props
}: MarkdownContentProps): ReactElement => (
  <div {...props} className={cx(styles.content, className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        a: ({ node, href, children, ...anchorProps }) => {
          const inPage = node?.tagName === "a" && href?.startsWith("#");
          return (
            <a
              {...anchorProps}
              href={href}
              target={inPage ? undefined : "_blank"}
              rel={inPage ? undefined : "noopener noreferrer"}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
