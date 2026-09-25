import type { ReactElement } from "react";
import { Button } from "../button/button.js";
import { Select } from "../select/select.js";
import styles from "./pagination.module.css";

interface CommonProps {
  label: string;
  loading?: boolean;
  className?: string;
}
interface PagedProps extends CommonProps {
  mode?: "pages";
  /** One-based page number. */
  page: number;
  totalPages?: number;
  hasNextPage?: boolean;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (size: number) => void;
}
interface LoadMoreProps extends CommonProps {
  mode: "load-more";
  hasNextPage: boolean;
  onLoadMore: () => void;
}
export type PaginationProps = PagedProps | LoadMoreProps;

const visiblePages = (page: number, totalPages: number): number[] => {
  if (totalPages <= 7)
    return Array.from(
      { length: Math.max(totalPages, 0) },
      (_, index) => index + 1,
    );

  const window =
    page <= 3
      ? [1, 2, 3, 4, totalPages]
      : page >= totalPages - 2
        ? [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, page - 1, page, page + 1, totalPages];
  return window.flatMap((number, index) =>
    index > 0 && number - (window[index - 1] ?? 0) === 2
      ? [number - 1, number]
      : [number],
  );
};

/** Controlled navigation for known or unknown page counts. */
export const Pagination = (props: PaginationProps): ReactElement => {
  if (props.mode === "load-more") {
    return (
      <nav aria-label={props.label} className={props.className}>
        <Button
          disabled={!props.hasNextPage || props.loading}
          onClick={props.onLoadMore}
        >
          {props.loading ? "Loading…" : "Show more"}
        </Button>
      </nav>
    );
  }
  const {
    page,
    totalPages,
    hasNextPage,
    onPageChange,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    loading,
  } = props;
  const canNext =
    totalPages === undefined ? hasNextPage === true : page < totalPages;
  const pages = totalPages === undefined ? [] : visiblePages(page, totalPages);
  return (
    <nav
      aria-label={props.label}
      className={[styles.pagination, props.className].filter(Boolean).join(" ")}
    >
      <Button
        size="small"
        disabled={page <= 1 || loading}
        onClick={() => {
          onPageChange(page - 1);
        }}
      >
        Previous
      </Button>
      <span
        className={
          totalPages === undefined ? styles.position : styles.visuallyHidden
        }
      >
        Page {page}
        {totalPages !== undefined ? ` of ${String(totalPages)}` : ""}
      </span>
      {totalPages !== undefined && (
        <span className={styles.pageNumbers} role="group" aria-label="Pages">
          {pages.map((number, index) => (
            <span key={number} className={styles.pageSlot}>
              {index > 0 && number - (pages[index - 1] ?? 0) > 1 && (
                <span className={styles.ellipsis} aria-hidden="true">
                  …
                </span>
              )}
              {number === page ? (
                <span className={styles.currentPage} aria-current="page">
                  {number}
                </span>
              ) : (
                <Button
                  size="small"
                  variant="ghost"
                  className={styles.pageButton}
                  aria-label={`Go to page ${String(number)}`}
                  disabled={loading}
                  onClick={() => {
                    onPageChange(number);
                  }}
                >
                  {number}
                </Button>
              )}
            </span>
          ))}
        </span>
      )}
      <Button
        size="small"
        disabled={!canNext || loading}
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        Next
      </Button>
      {pageSize !== undefined && onPageSizeChange && pageSizeOptions && (
        <Select
          label="Results per page"
          labelHidden
          className={styles.pageSize}
          value={pageSize}
          disabled={loading}
          onChange={(event) => {
            onPageSizeChange(Number(event.currentTarget.value));
          }}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
        </Select>
      )}
    </nav>
  );
};
