import { createContext, useContext } from "react";
import type { ReactElement, ReactNode } from "react";

export interface ComponentMessages {
  loading: string;
  noResults: string;
  search: string;
  previous: string;
  next: string;
  showMore: string;
  pages: string;
  resultsPerPage: string;
  pagePosition: (page: number, total?: number) => string;
  goToPage: (page: number) => string;
  perPage: (size: number) => string;
  remove: (label: string) => string;
  chooseFile: string;
  uploading: string;
  selected: (label: string) => string;
}
const defaults: ComponentMessages = {
  loading: "Loading…",
  noResults: "No results",
  search: "Search…",
  previous: "Previous",
  next: "Next",
  showMore: "Show more",
  pages: "Pages",
  resultsPerPage: "Results per page",
  pagePosition: (page, total) =>
    `Page ${String(page)}${total === undefined ? "" : ` of ${String(total)}`}`,
  goToPage: (page) => `Go to page ${String(page)}`,
  perPage: (size) => `${String(size)} per page`,
  remove: (label) => `Remove ${label}`,
  chooseFile: "Choose file",
  uploading: "Uploading…",
  selected: (label) => `${label} selected`,
};
const MessagesContext = createContext(defaults);
export interface MessagesProviderProps {
  messages: Partial<ComponentMessages>;
  children: ReactNode;
}
/** Override built-in UI copy; nested providers inherit unspecified messages. */
export const MessagesProvider = ({
  messages,
  children,
}: MessagesProviderProps): ReactElement => {
  const inherited = useContext(MessagesContext);
  return (
    <MessagesContext.Provider value={{ ...inherited, ...messages }}>
      {children}
    </MessagesContext.Provider>
  );
};
export const useComponentMessages = (): ComponentMessages =>
  useContext(MessagesContext);
