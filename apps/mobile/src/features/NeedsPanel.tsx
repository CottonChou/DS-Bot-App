import { tr } from "../i18n";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Card, EmptyState, Label, Notice, Pill, Section, SettingRow, Tag } from "../components/UI";
import { AnimatedPressable as Pressable } from "../components/Motion";
import { useTheme, spacing, radius, typography } from "../theme";
import { errorText } from "../types";
import type { MobileClient } from "@ds-bot/mobile-sdk";

type NeedItem = {
  id: string;
  kind: "memory" | "skill" | "approval";
  action: string;
  title: string;
  detail?: string;
  createdAt?: number;
};

type NeedsPayload = {
  approvalLevel: string;
  counts: { total: number; memory: number; skills: number; approvals: number };
  items: NeedItem[];
};

const LEVELS = [
  { id: "ask", label: "ask", hint: "每个写操作都确认" },
  { id: "auto-edit", label: "auto-edit", hint: "记忆编辑自动通过" },
  { id: "auto-approve", label: "auto-approve", hint: "常规操作自动通过，危险操作仍需确认" },
  { id: "full", label: "full", hint: "全部自动通过" },
] as const;

const KIND_LABEL: Record<NeedItem["kind"], string> = {
  memory: "记忆候选",
  skill: "技能候选",
  approval: "工具审批",
};

export function NeedsPanel({ client, online }: { client: MobileClient; online: boolean }) {
  const t = useTheme();
  const [data, setData] = useState<NeedsPayload | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const value = await client.action<NeedsPayload>("needs-list");
      setData(value);
    } catch (err) {
      setError(errorText(err));
    }
  }, [client]);

  useEffect(() => {
    if (online) void load();
  }, [online, load]);

  async function resolve(item: NeedItem, decision: "approve" | "reject") {
    if (busy) return;
    setBusy(item.id);
    setError("");
    setNotice("");
    try {
      await client.action("needs-resolve", { id: item.id, decision });
      setNotice(decision === "approve" ? tr("Approved") : tr("Rejected"));
      await load();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy("");
    }
  }

  async function setLevel(level: string) {
    if (busy) return;
    setBusy(`level:${level}`);
    setError("");
    try {
      await client.action("approval-level-set", { level });
      setNotice(tr("Approval level updated"));
      await load();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy("");
    }
  }

  const level = data?.approvalLevel || "auto-edit";

  return (
    <>
      <Notice error text={error} />
      <Notice text={notice} />
      <Section title={tr("Approval level")} footer={tr("Ask: confirm every write. Auto-edit: memory writes pass. Auto-approve: routine tools pass but forget still asks. Full: everything passes.")}>
        {LEVELS.map((item, index) => (
          <SettingRow
            key={item.id}
            title={item.label}
            hint={tr(item.hint)}
            onPress={() => void setLevel(item.id)}
            disabled={!online || !!busy}
            last={index === LEVELS.length - 1}
          >
            {level === item.id ? <Tag>{tr("Selected")}</Tag> : null}
          </SettingRow>
        ))}
      </Section>

      <Section title={tr("Waiting for you")}>
        {!data?.items.length ? (
          <EmptyState
            glyph="check"
            title={tr("Nothing needs your attention right now.")}
            hint={tr("Memory candidates, skills and tool approvals will show up here.")}
          />
        ) : (
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            {data.items.map((item) => (
              <Card key={item.id}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm }}>
                  <Pill tone={item.kind === "approval" ? "warning" : "accent"}>
                    {tr(KIND_LABEL[item.kind])}
                  </Pill>
                  {item.kind === "memory" ? <Tag>{tr(item.action)}</Tag> : null}
                </View>
                <Text selectable style={{ ...typography.bodyStrong, color: t.ink }}>
                  {item.title}
                </Text>
                {!!item.detail && <Text style={{ ...typography.caption, color: t.textSecondary }}>{item.detail}</Text>}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm + 2, marginTop: spacing.xs }}>
                  <Button
                    secondary
                    danger
                    compact
                    title={busy === item.id ? tr("Working…") : tr("Reject")}
                    disabled={!online || !!busy}
                    onPress={() => void resolve(item, "reject")}
                  />
                  <Button
                    compact
                    title={busy === item.id ? tr("Working…") : tr("Approve")}
                    disabled={!online || !!busy}
                    onPress={() => void resolve(item, "approve")}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </Section>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={tr("Refresh")}
        onPress={() => void load()}
        style={({ pressed }) => ({ alignSelf: "center", minHeight: 44, paddingHorizontal: 18, justifyContent: "center", opacity: pressed ? 0.6 : 1 })}
      >
        <Text style={{ color: t.accent, fontSize: 14 }}>{tr("Refresh")}</Text>
      </Pressable>
    </>
  );
}
