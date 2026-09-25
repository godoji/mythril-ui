import type { ReactElement, ReactNode } from "react";
import { useControllable } from "../../lib/use-controllable.js";
import { Disclosure } from "../disclosure/disclosure.js";

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export interface AccordionProps {
  items: readonly AccordionItem[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  multiple?: boolean;
  label: string;
  className?: string;
}
/** A labeled group of disclosures. Item values must be unique. */
export const Accordion = ({
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple = false,
  label,
  className,
}: AccordionProps): ReactElement => {
  const [expanded, setExpanded] = useControllable(
    value,
    defaultValue,
    onValueChange,
  );
  const visible = multiple ? expanded : expanded.slice(0, 1);
  return (
    <div role="group" aria-label={label} className={className}>
      {items.map((item) => (
        <Disclosure
          key={item.value}
          title={item.title}
          disabled={item.disabled ?? false}
          open={visible.includes(item.value)}
          onOpenChange={(open) => {
            setExpanded(
              open
                ? multiple
                  ? [...visible, item.value]
                  : [item.value]
                : visible.filter((entry) => entry !== item.value),
            );
          }}
        >
          {item.content}
        </Disclosure>
      ))}
    </div>
  );
};
