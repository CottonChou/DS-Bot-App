import { tr } from "../i18n";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Switch,
} from "react-native";
import { AnimatedPressable as Pressable, PageTransition } from "./Motion";
import { contrastText, useTheme, spacing, radius, typography } from "../theme";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect } from "react-native-svg";

export function AsteriaMark({ size = 34, watermark = false }: { size?: number; watermark?: boolean }) {
  const t = useTheme();
  if (watermark) {
    return (
      <Svg width={size} height={size} viewBox="0 0 128 128">
        <Path
          d="M30 50 C47 34, 62 34, 78 50 C86 58, 93 58, 99 52"
          fill="none"
          stroke={t.accent}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <Path
          d="M29 77 C46 61, 61 61, 77 77 C85 85, 92 85, 99 79"
          fill="none"
          stroke={t.accent}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <Circle cx={94} cy={34} r={6} fill={t.accent} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Rect
        x={2}
        y={2}
        width={124}
        height={124}
        rx={28}
        fill={t.dark ? "#15151d" : "#181822"}
        stroke={t.dark ? "#2c2c38" : "#2e2e3d"}
        strokeWidth={2}
      />
      <Path
        d="M30 50 C47 34, 62 34, 78 50 C86 58, 93 58, 99 52"
        fill="none"
        stroke="#ffffff"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <Path
        d="M29 77 C46 61, 61 61, 77 77 C85 85, 92 85, 99 79"
        fill="none"
        stroke="#8b7cff"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <Circle cx={94} cy={34} r={5.5} fill="#8b7cff" />
    </Svg>
  );
}
export function Label({
  children,
  muted = false,
  large = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
  large?: boolean;
}) {
  const t = useTheme();
  return (
    <Text style={{ ...typography.body, ...(large ? typography.headline : {}), color: muted ? t.muted : t.ink }}>
      {children}
    </Text>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  danger = false,
  compact = false,
  floating = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  danger?: boolean;
  compact?: boolean;
  floating?: boolean;
  testID?: string;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 46,
        paddingVertical: compact ? spacing.sm : spacing.md - 2,
        paddingHorizontal: compact ? spacing.md + 1 : spacing.lg + 2,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
        opacity: disabled ? 0.4 : 1,
        backgroundColor: secondary ? (floating ? t.surface : "transparent") : danger ? t.error : t.accent,
        borderColor: secondary ? t.lineStrong : "transparent",
        borderWidth: secondary || floating ? 1 : 0,
        shadowColor: t.accent,
        shadowOpacity: secondary || floating || disabled ? 0 : pressed ? 0.4 : 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      })}
    >
      <Text style={{ ...typography.bodyStrong, color: secondary ? (danger ? t.error : t.ink) : danger ? contrastText(t.error) : t.accentText }}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  ...props
}: TextInputProps & {
  label: string;
}) {
  const t = useTheme();
  return (
    <View style={{ gap: spacing.xs + 3 }}>
      <Text style={{ ...typography.subheadline, color: t.ink, fontWeight: "600" }}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={t.faint}
        {...props}
        style={[
          {
            ...typography.body,
            backgroundColor: t.surface,
            color: t.ink,
            minHeight: 48,
            paddingHorizontal: spacing.md + 2,
            paddingVertical: spacing.md,
            borderWidth: 1,
            borderColor: t.lineStrong,
            borderRadius: radius.md,
            textAlignVertical: "top",
          },
          props.style,
        ]}
      />
    </View>
  );
}
export function Notice({
  text,
  error = false,
  capsule = false,
}: {
  text?: string | null;
  error?: boolean;
  capsule?: boolean;
}) {
  const t = useTheme();
  if (!text) return null;
  return (
    <View
      accessibilityRole={error ? "alert" : undefined}
      style={{
        borderRadius: capsule ? radius.pill : radius.md,
        backgroundColor: t.surface,
        borderColor: error ? t.error : t.line,
        borderWidth: 1,
        padding: spacing.md,
        paddingHorizontal: capsule ? spacing.xl - 4 : spacing.md,
      }}
    >
      <Text
        selectable
        style={{
          ...typography.caption,
          color: error ? t.error : t.textSecondary,
          lineHeight: 19,
        }}
      >
        {tr(text)}
      </Text>
    </View>
  );
}
export function Card({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View
      style={{
        backgroundColor: t.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md + 2,
        borderWidth: 1,
        borderColor: t.line,
      }}
    >
      {children}
    </View>
  );
}
export function Busy({ text = "Loading…" }: { text?: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        padding: 22,
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={t.accent} />
      <Label muted>{tr(text)}</Label>
    </View>
  );
}
export function Sheet({
  title,
  visible,
  onClose,
  children,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "web" ? undefined : "padding"}
        style={{
          flex: 1,
          backgroundColor: "#0008",
          justifyContent: "flex-end",
        }}
      >
        <Pressable accessibilityRole="button" accessibilityLabel={tr("Close")} onPress={onClose} style={StyleSheet.absoluteFillObject} />
        <PageTransition distance={28}>
        <View pointerEvents="box-none" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: t.bg,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            borderTopWidth: 1,
            borderColor: t.line,
            maxHeight: "90%",
            overflow: "hidden",
            paddingTop: 12,
            paddingHorizontal: 20,
            paddingBottom: Math.max(16, insets.bottom + 8),
          }}
        >
          <View style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: t.lineStrong, marginBottom: 10 }} />
          <View style={styles.between}>
            <Label large>{title}</Label>
            <IconButton name="close" floating label={tr("Close")} onPress={onClose} />
          </View>
          <ScrollView
            style={{ flexShrink: 1, minHeight: 0 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              gap: 16,
              paddingTop: 20,
              paddingBottom: 16,
            }}
          >
            {children}
          </ScrollView>
        </View>
        </View>
        </PageTransition>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  between: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  page: { padding: 16, gap: 20, paddingBottom: 24 },
  caption: { fontSize: 12 },
  grow: { flex: 1 },
});
const iconNames = {
  menu: "menu", back: "chevron-left", close: "x", plus: "plus", search: "search",
  settings: "settings", bots: "users", groups: "message-circle", chat: "message-square", devices: "smartphone",
  schedules: "clock", usage: "bar-chart-2", pin: "bookmark", chevron: "chevron-right",
  up: "chevron-up", more: "more-horizontal", check: "check", connectors: "link", secrets: "key", feedback: "message-square",
  microphone: "mic", folder: "folder", camera: "camera", image: "image", send: "arrow-up",
  stop: "square", skills: "book-open", browser: "monitor", bell: "bell", reply: "corner-up-left", smile: "smile", copy: "copy", share: "share-2", download: "download", speaker: "volume-2",
} as const;
export type IconName = keyof typeof iconNames | "waveform";
export function Icon({ name, size = 22, color }: {name: IconName; size?: number; color?: string}) {
  const t = useTheme();
  return name === "waveform"
    ? <MaterialCommunityIcons name="waveform" size={size} color={color || t.ink} accessible={false} />
    : <Feather name={iconNames[name]} size={size} color={color || t.ink} accessible={false} />;
}
export function IconButton({ name, label, onPress, disabled = false, floating = false, primary = false, brand = false, size = 48, width = size }: {
  name: IconName; label: string; onPress: () => void; disabled?: boolean; floating?: boolean; primary?: boolean; brand?: boolean; size?: number; width?: number;
}) {
  const t = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled}}
    disabled={disabled} onPress={onPress} style={({pressed}) => ({
      width, height:size, borderRadius:size / 2, alignItems:"center", justifyContent:"center",
      flexShrink:0, backgroundColor:brand ? t.accent : primary ? t.ink : floating ? t.surface : pressed ? t.hover : undefined,
      borderWidth:floating && !primary && !brand ? 1 : 0, borderColor:t.lineStrong,
      opacity:disabled ? .35 : pressed ? .75 : 1,
    })}><Icon name={name} size={name === "plus" ? 28 : 23} color={brand ? t.accentText : primary ? t.bg : t.ink}/></Pressable>;
}
export function PageHeader({
  title,
  onBack,
  onOpenNavigation,
  right,
  close = false,
  floating = false,
}: {
  title: string;
  onBack?: () => void;
  onOpenNavigation?: () => void;
  right?: React.ReactNode;
  close?: boolean;
  floating?: boolean;
}) {
  const t = useTheme();
  useEffect(() => {
    if (!onBack) return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [onBack]);
  return (
    <View
      pointerEvents="box-none"
      style={{
        ...(floating ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 } as const : {}),
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        minHeight: 76,
      }}
    >
      {onBack ? (
        <IconButton name={close ? "close" : "back"} floating label={tr(close ? "Close" : "Back")} onPress={onBack} />
      ) : onOpenNavigation ? (
        <IconButton
          name="menu"
          label={tr("Open navigation")}
          onPress={onOpenNavigation}
        />
      ) : null}
      <View pointerEvents="box-none" style={{ flex: 1, alignItems: 'flex-start' }}>
        {!!title && <Text numberOfLines={1} style={{ flexShrink: 1, fontSize: 19, fontWeight: "600", color: t.ink, ...(floating ? { backgroundColor: t.surface, borderWidth: 1, borderColor: t.line, borderRadius: 20, overflow: 'hidden' as const, paddingHorizontal: 15, paddingVertical: 9 } : {}) }}>{title}</Text>}
      </View>
      {right}
    </View>
  );
}
export function Section({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: string;
}) {
  const t = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text
        style={{
          ...typography.section,
          color: t.textSecondary,
          paddingHorizontal: spacing.xl - 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: t.surface,
          borderRadius: radius.lg - 2,
          borderWidth: 1,
          borderColor: t.line,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
      {footer && (
        <Text
          style={{
            ...typography.caption,
            color: t.textTertiary,
            paddingHorizontal: spacing.xs,
          }}
        >
          {footer}
        </Text>
      )}
    </View>
  );
}
export function SettingRow({
  title,
  hint,
  children,
  onPress,
  leading,
  accessibilityLabel,
  danger = false,
  last = false,
  disabled = false,
  compact = false,
}: {
  title: string;
  hint?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  leading?: React.ReactNode;
  accessibilityLabel?: string;
  compact?: boolean;
  danger?: boolean;
  last?: boolean;
  disabled?: boolean;
}) {
  const t = useTheme();
  const body = (
    <>
      {leading}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: danger ? t.error : t.ink,
            ...typography.body,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
        {hint && (
          <Text style={{ ...typography.caption, color: t.textSecondary }}>
            {hint}
          </Text>
        )}
      </View>
      {children}
      {onPress && <Icon name="chevron" size={16} color={t.faint} />}
    </>
  );
  const style = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: compact ? spacing.sm + 2 : spacing.md + 2,
    minHeight: compact ? 50 : 58,
    borderBottomWidth: last ? 0 : 1,
    borderColor: t.line,
    opacity: disabled ? 0.5 : 1,
  };
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        ...style,
        backgroundColor: pressed ? t.hover : undefined,
      })}
    >
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}
export function ToggleRow({
  title,
  hint,
  value,
  onChange,
  disabled,
  last,
}: {
  title: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
}) {
  const t = useTheme();
  return (
    <SettingRow title={title} hint={hint} disabled={disabled} last={last}>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: t.accent }}
      />
    </SettingRow>
  );
}
export function Tag({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <Text
      style={{
        ...typography.caption,
        fontSize: 11,
        lineHeight: 16,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.pill,
        color: t.tagInk,
        backgroundColor: t.tagBg,
        overflow: "hidden",
      }}
    >
      {children}
    </Text>
  );
}

/** Small rounded status chip. tone maps to semantic roles from the theme. */
export function Pill({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  dot?: boolean;
}) {
  const t = useTheme();
  const toneColor =
    tone === "accent"
      ? t.accent
      : tone === "success"
        ? t.success
        : tone === "warning"
          ? t.warning
          : tone === "danger"
            ? t.error
            : t.textSecondary;
  return (
    <View
      accessibilityRole="text"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingVertical: spacing.sm - 2,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        backgroundColor: t.surfaceRaised,
        borderWidth: 1,
        borderColor: t.line,
        alignSelf: "flex-start",
      }}
    >
      {dot && (
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: toneColor,
          }}
        />
      )}
      <Text style={{ ...typography.subheadline, color: t.ink }}>{children}</Text>
    </View>
  );
}

/** Branded empty state: glyph, title, hint and optional action button. */
export function EmptyState({
  glyph = "bell",
  title,
  hint,
  actionTitle,
  onAction,
}: {
  glyph?: IconName;
  title: string;
  hint?: string;
  actionTitle?: string;
  onAction?: () => void;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
      accessibilityRole="text"
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: t.accentSoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={glyph} size={28} color={t.accent} />
      </View>
      <Text style={{ ...typography.bodyStrong, color: t.ink, textAlign: "center" }}>
        {title}
      </Text>
      {hint ? (
        <Text style={{ ...typography.caption, color: t.muted, textAlign: "center", maxWidth: 280 }}>
          {hint}
        </Text>
      ) : null}
      {actionTitle && onAction ? (
        <View style={{ marginTop: spacing.sm }}>
          <Button title={actionTitle} onPress={onAction} secondary compact />
        </View>
      ) : null}
    </View>
  );
}
