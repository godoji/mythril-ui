import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import { ChevronRight } from "lucide-react";
import { useControllable } from "../../lib/use-controllable.js";
import { cx } from "../../lib/classes.js";
import styles from "./tree-view.module.css";

export interface TreeNode {
  id: string;
  label: string;
  children?: readonly TreeNode[];
  disabled?: boolean;
}
interface VisibleNode {
  node: TreeNode;
  parentId: string | null;
}
export interface TreeViewProps {
  label: string;
  nodes: readonly TreeNode[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedIdChange?: (id: string) => void;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedIdsChange?: (ids: readonly string[]) => void;
  className?: string;
}

const flattenVisible = (
  nodes: readonly TreeNode[],
  expanded: ReadonlySet<string>,
  parentId: string | null = null,
): VisibleNode[] =>
  nodes.flatMap((node) => [
    { node, parentId },
    ...(node.children && expanded.has(node.id)
      ? flattenVisible(node.children, expanded, node.id)
      : []),
  ]);

/** A single-select hierarchy with roving focus and independent selection. */
export const TreeView = ({
  label,
  nodes,
  selectedId: controlledSelected,
  defaultSelectedId = "",
  onSelectedIdChange,
  expandedIds: controlledExpanded,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  className,
}: TreeViewProps): ReactElement => {
  const [selectedId, setSelectedId] = useControllable(
    controlledSelected,
    defaultSelectedId,
    onSelectedIdChange,
  );
  const [expandedIds, setExpandedIds] = useControllable<readonly string[]>(
    controlledExpanded,
    defaultExpandedIds,
    onExpandedIdsChange,
  );
  const expanded = new Set(expandedIds);
  const visible = flattenVisible(nodes, expanded);
  const enabled = visible.filter(({ node }) => !node.disabled);
  const [focusedId, setFocusedId] = useState(defaultSelectedId);
  const activeId = enabled.some(({ node }) => node.id === focusedId)
    ? focusedId
    : (enabled.find(({ node }) => node.id === selectedId)?.node.id ??
      enabled[0]?.node.id ??
      "");
  const refs = useRef(new Map<string, HTMLDivElement>());
  const searchRef = useRef({ text: "", at: 0 });
  const treeId = useId();

  const focusNode = (id: string): void => {
    setFocusedId(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (id: string): void => {
    setExpandedIds(
      expanded.has(id)
        ? expandedIds.filter((entry) => entry !== id)
        : [...expandedIds, id],
    );
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const index = enabled.findIndex(({ node }) => node.id === activeId);
    const current = enabled[index];
    if (!current) return;
    const { node, parentId } = current;
    const hasChildren = Boolean(node.children?.length);
    let nextId: string | undefined;
    if (event.key === "ArrowDown") nextId = enabled[index + 1]?.node.id;
    else if (event.key === "ArrowUp") nextId = enabled[index - 1]?.node.id;
    else if (event.key === "Home") nextId = enabled[0]?.node.id;
    else if (event.key === "End") nextId = enabled.at(-1)?.node.id;
    else if (event.key === "ArrowRight") {
      if (hasChildren && !expanded.has(node.id)) toggle(node.id);
      else if (hasChildren)
        nextId = node.children?.find((child) => !child.disabled)?.id;
    } else if (event.key === "ArrowLeft") {
      if (hasChildren && expanded.has(node.id)) toggle(node.id);
      else {
        let ancestorId = parentId;
        while (ancestorId) {
          const ancestor = visible.find(
            ({ node: entry }) => entry.id === ancestorId,
          );
          if (!ancestor) break;
          if (!ancestor.node.disabled) {
            nextId = ancestorId;
            break;
          }
          ancestorId = ancestor.parentId;
        }
      }
    } else if (event.key === "Enter" || event.key === " ") {
      setSelectedId(node.id);
    } else if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      const now = event.timeStamp;
      const text =
        (now - searchRef.current.at < 700 ? searchRef.current.text : "") +
        event.key.toLocaleLowerCase();
      searchRef.current = { text, at: now };
      const ordered = [
        ...enabled.slice(index + 1),
        ...enabled.slice(0, index + 1),
      ];
      nextId = ordered.find(({ node: candidate }) =>
        candidate.label.toLocaleLowerCase().startsWith(text),
      )?.node.id;
      if (!nextId && text.length > 1) {
        nextId = ordered.find(({ node: candidate }) =>
          candidate.label
            .toLocaleLowerCase()
            .startsWith(event.key.toLocaleLowerCase()),
        )?.node.id;
      }
    } else return;
    event.preventDefault();
    if (nextId) focusNode(nextId);
  };

  const renderNodes = (entries: readonly TreeNode[]): ReactElement[] =>
    entries.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const open = hasChildren && expanded.has(node.id);
      return (
        <div
          key={node.id}
          ref={(element) => {
            if (element) refs.current.set(node.id, element);
            else refs.current.delete(node.id);
          }}
          role="treeitem"
          aria-label={node.label}
          tabIndex={!node.disabled && node.id === activeId ? 0 : -1}
          aria-selected={!node.disabled && node.id === selectedId}
          aria-expanded={hasChildren ? open : undefined}
          aria-disabled={node.disabled || undefined}
          className={styles.item}
          onKeyDown={(event) => {
            event.stopPropagation();
            onKeyDown(event);
          }}
          onFocus={(event) => {
            event.stopPropagation();
            if (!node.disabled) setFocusedId(node.id);
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (node.disabled) return;
            focusNode(node.id);
            setSelectedId(node.id);
            if (hasChildren) toggle(node.id);
          }}
        >
          <div className={styles.row}>
            <span className={styles.chevron} aria-hidden="true">
              {hasChildren && <ChevronRight size={14} />}
            </span>
            <span>{node.label}</span>
          </div>
          {open && (
            <div role="group" className={styles.group}>
              {renderNodes(node.children ?? [])}
            </div>
          )}
        </div>
      );
    });

  return (
    <div
      id={treeId}
      role="tree"
      aria-label={label}
      tabIndex={enabled.length ? -1 : 0}
      className={cx(styles.tree, className)}
    >
      {renderNodes(nodes)}
    </div>
  );
};
