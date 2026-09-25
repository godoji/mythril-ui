import { useRef, useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Plus, Settings2 } from "lucide-react";
import {
  Accordion,
  Button,
  Checkbox,
  CodeBlock,
  Dialog,
  Disclosure,
  IconButton,
  Menu,
  Notice,
  Popover,
  ScrollArea,
  Select,
  StatusBadge,
  Tabs,
  TextareaComposer,
  TextInput,
  UsageMeter,
} from "../index.js";
import styles from "./history.module.css";

const sampleLog = Array.from(
  { length: 400 },
  (_, index) =>
    `[check ${String(index + 1).padStart(3, "0")}] Compiled module successfully`,
).join("\n");
const activityDetails = [
  "Scanned source files to map the current structure.",
  "Verified focus order, keyboard navigation, and native form semantics.",
  "Compiled the package and checked its public exports.",
];

const HistoryExample = (): ReactElement => {
  const [entries, setEntries] = useState([
    "Read the source files",
    "Checked component behavior",
    "Built the package",
  ]);
  const [draft, setDraft] = useState("");
  const [showTime, setShowTime] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <div className={styles.example}>
      <header className={styles.header}>
        <div>
          <h1>Activity history</h1>
          <p>Compact controls and readable output</p>
        </div>
        <div className={styles.actions}>
          <StatusBadge tone="success">Complete</StatusBadge>
          <Popover
            label="Display options"
            trigger={
              <IconButton
                icon={Settings2}
                label="Display options"
                size="small"
              />
            }
          >
            <Checkbox
              label="Show timestamps"
              checked={showTime}
              onChange={(event) => {
                setShowTime(event.currentTarget.checked);
              }}
            />
          </Popover>
          <Menu
            label="History actions"
            trigger={
              <IconButton
                icon={MoreHorizontal}
                label="History actions"
                size="small"
              />
            }
            items={[
              {
                id: "append",
                label: "Append sample event",
                onSelect: () => {
                  setEntries([...entries, "Another event arrived"]);
                },
              },
              {
                id: "clear",
                label: "Clear history",
                danger: true,
                onSelect: () => {
                  setConfirmOpen(true);
                },
              },
            ]}
          />
        </div>
      </header>
      <div className={styles.layout}>
        <main className={styles.main}>
          <Tabs
            label="History views"
            items={[
              {
                value: "history",
                label: "History",
                content: (
                  <>
                    <ScrollArea
                      followLatest
                      label="Activity history"
                      className={styles.history}
                    >
                      {entries.map((entry, index) => (
                        <article
                          key={`${String(index)}-${entry}`}
                          className={styles.entry}
                        >
                          <Disclosure
                            defaultOpen
                            title={
                              <span className={styles.entryHeading}>
                                <span>{entry}</span>
                                {showTime && (
                                  <time dateTime="2026-09-25T09:01:00Z">
                                    09:01
                                  </time>
                                )}
                              </span>
                            }
                          >
                            <p>
                              {activityDetails[index] ??
                                "A new sample event was appended to the history."}
                            </p>
                          </Disclosure>
                        </article>
                      ))}
                      <article className={styles.result}>
                        <div className={styles.resultHeader}>
                          <h2>Result</h2>
                          <StatusBadge tone="success">Verified</StatusBadge>
                        </div>
                        <p>
                          The controls support{" "}
                          <strong>keyboard navigation</strong> and native form
                          behavior.
                        </p>
                        <ul>
                          <li>Focus remains visible.</li>
                          <li>
                            Long output stays available through{" "}
                            <code>Show full output</code> and copy.
                          </li>
                        </ul>
                        <Notice tone="info">
                          This is a composition example with local fixture data.
                          Applications supply their own history and Markdown
                          renderer.
                        </Notice>
                      </article>
                    </ScrollArea>
                    <form
                      className={styles.composer}
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!draft.trim()) return;
                        setEntries([...entries, draft.trim()]);
                        setDraft("");
                      }}
                    >
                      <TextareaComposer
                        label="Add a note"
                        placeholder="Write a short note…"
                        value={draft}
                        onChange={(event) => {
                          setDraft(event.currentTarget.value);
                        }}
                        rows={2}
                        actions={
                          <>
                            <Button
                              size="small"
                              icon={Plus}
                              onClick={() => {
                                setEntries([
                                  ...entries,
                                  "A new sample event arrived",
                                ]);
                              }}
                            >
                              Append event
                            </Button>
                            <Button
                              size="small"
                              type="submit"
                              variant="primary"
                              disabled={!draft.trim()}
                            >
                              Add note
                            </Button>
                          </>
                        }
                      />
                    </form>
                  </>
                ),
              },
              {
                value: "output",
                label: "Full output",
                content: (
                  <CodeBlock
                    code={sampleLog}
                    previewLimit={2000}
                    maxHeight="30rem"
                  />
                ),
              },
            ]}
          />
        </main>
        <aside className={styles.sidebar} aria-label="Example settings">
          <h2>Details</h2>
          <TextInput
            label="Name"
            defaultValue="Component review"
            description="A recognizable name for this output."
          />
          <Select label="Output format" defaultValue="text">
            <option value="text">Plain text</option>
            <option value="json">JSON</option>
          </Select>
          <UsageMeter
            label="Context usage"
            value={32000}
            max={128000}
            unit="tokens"
          />
          <UsageMeter
            label="Output usage"
            value={null}
            max={20000}
            unit="tokens"
          />
          <Accordion
            label="Verification details"
            items={[
              {
                value: "checks",
                title: "Checks",
                content: "Types, interaction tests, and package build passed.",
              },
              {
                value: "notes",
                title: "Notes",
                content:
                  "Visual and screen reader review is performed by the application team.",
              },
            ]}
          />
        </aside>
      </div>
      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        role="alertdialog"
        title="Clear this example history?"
        description="This only clears the sample events in this Storybook session."
        initialFocus={cancelRef}
        footer={
          <>
            <Button
              ref={cancelRef}
              onClick={() => {
                setConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setEntries([]);
                setConfirmOpen(false);
              }}
            >
              Clear history
            </Button>
          </>
        }
      />
    </div>
  );
};

const meta = {
  title: "Examples/Readable history",
  component: HistoryExample,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof HistoryExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
