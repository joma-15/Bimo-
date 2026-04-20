import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Bimo3D } from "./Bimo3D"; // ← only new import

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SkinId = "silver" | "gold" | "onyx" | "rose" | "cyan" | "purple" | "emerald" | "crimson";
type EyeId  = "blue" | "green" | "red" | "purple" | "orange" | "white";
type SuitId = "none" | "tuxedo" | "space" | "knight" | "ninja" | "lab";
type AccId  = "none" | "tophat" | "cap" | "halo" | "crown" | "glasses" | "shades";
type AntId  = "ball" | "star" | "heart" | "diamond" | "none";
type ExprId = "happy" | "excited" | "cool" | "shy";

interface Skin     { id: SkinId;  label: string; body: string; plate: string; accent: string; }
interface Eye      { id: EyeId;   label: string; color: string; glow: string; }
interface Suit     { id: SuitId;  label: string; emoji: string; cape: boolean; badge: boolean; collar: boolean; color: string | null; }
interface Acc      { id: AccId;   label: string; emoji: string; head: string | null; face: string | null; }
interface Antenna  { id: AntId;   label: string; color: string; shape: "circle" | "diamond" | "none"; }
interface Expr     { id: ExprId;  label: string; emoji: string; mouthW: number; mouthColor: string; eyeGlow: boolean; }

interface RobotConfig {
  skin: SkinId; eyes: EyeId; suit: SuitId;
  accessory: AccId; antenna: AntId; expression: ExprId;
}

interface Props {
  onSave?: (config: RobotConfig) => void;
  initialConfig?: Partial<RobotConfig>;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SKINS: Skin[] = [
  { id: "silver",  label: "Silver",  body: "#C8CDD6", plate: "#E8ECF2", accent: "#A0A8B5" },
  { id: "gold",    label: "Gold",    body: "#C8A84B", plate: "#E8CF7A", accent: "#A08030" },
  { id: "onyx",    label: "Onyx",    body: "#2A2D35", plate: "#3D4150", accent: "#1A1D24" },
  { id: "rose",    label: "Rose",    body: "#C87B8A", plate: "#E8A0B0", accent: "#A05060" },
  { id: "cyan",    label: "Cyan",    body: "#4A9BAA", plate: "#6ABFCC", accent: "#307A88" },
  { id: "purple",  label: "Purple",  body: "#7B5AAA", plate: "#9B7ACA", accent: "#5A3A88" },
  { id: "emerald", label: "Emerald", body: "#3A9A6A", plate: "#5ABA8A", accent: "#207850" },
  { id: "crimson", label: "Crimson", body: "#AA3A4A", plate: "#CA5A6A", accent: "#881828" },
];

const EYES: Eye[] = [
  { id: "blue",   label: "Blue",   color: "#4A9EE8", glow: "#7ABEFF" },
  { id: "green",  label: "Green",  color: "#4AE87A", glow: "#7AFFAA" },
  { id: "red",    label: "Red",    color: "#E84A4A", glow: "#FF7A7A" },
  { id: "purple", label: "Purple", color: "#9A4AE8", glow: "#BB7AFF" },
  { id: "orange", label: "Orange", color: "#E8994A", glow: "#FFBB7A" },
  { id: "white",  label: "White",  color: "#E8F0FF", glow: "#FFFFFF" },
];

const SUITS: Suit[] = [
  { id: "none",   label: "None",     emoji: "🤖", cape: false, badge: false, collar: false, color: null      },
  { id: "tuxedo", label: "Tuxedo",   emoji: "🎩", cape: false, badge: false, collar: true,  color: "#1A1A2E" },
  { id: "space",  label: "Space",    emoji: "🚀", cape: false, badge: true,  collar: false, color: "#1A3A5C" },
  { id: "knight", label: "Knight",   emoji: "⚔️",  cape: true,  badge: true,  collar: false, color: "#3A3A4A" },
  { id: "ninja",  label: "Ninja",    emoji: "🥷", cape: false, badge: false, collar: true,  color: "#111111" },
  { id: "lab",    label: "Lab Coat", emoji: "🔬", cape: false, badge: true,  collar: true,  color: "#F0F0FF" },
];

const ACCESSORIES: Acc[] = [
  { id: "none",    label: "None",    emoji: "—",  head: null,     face: null      },
  { id: "tophat",  label: "Top Hat", emoji: "🎩", head: "tophat", face: null      },
  { id: "cap",     label: "Cap",     emoji: "🧢", head: "cap",    face: null      },
  { id: "halo",    label: "Halo",    emoji: "😇", head: "halo",   face: null      },
  { id: "crown",   label: "Crown",   emoji: "👑", head: "crown",  face: null      },
  { id: "glasses", label: "Glasses", emoji: "👓", head: null,     face: "glasses" },
  { id: "shades",  label: "Shades",  emoji: "🕶️", head: null,     face: "shades"  },
];

const ANTENNAS: Antenna[] = [
  { id: "ball",    label: "Ball",    color: "#4A9EE8", shape: "circle"  },
  { id: "star",    label: "Star",    color: "#FFD700", shape: "circle"  },
  { id: "heart",   label: "Heart",   color: "#FF6B8A", shape: "circle"  },
  { id: "diamond", label: "Diamond", color: "#A0E8FF", shape: "diamond" },
  { id: "none",    label: "None",    color: "transparent", shape: "none" },
];

const EXPRESSIONS: Expr[] = [
  { id: "happy",   label: "Happy",   emoji: "😊", mouthW: 30, mouthColor: "#555",    eyeGlow: false },
  { id: "excited", label: "Excited", emoji: "🤩", mouthW: 40, mouthColor: "#4A9EE8", eyeGlow: true  },
  { id: "cool",    label: "Cool",    emoji: "😎", mouthW: 22, mouthColor: "#555",    eyeGlow: false },
  { id: "shy",     label: "Shy",     emoji: "🥺", mouthW: 18, mouthColor: "#888",    eyeGlow: false },
];

const TABS = ["Look", "Outfit", "Face", "Extras"] as const;

// ─── OPTION PILL ──────────────────────────────────────────────────────────────

interface PillProps {
  label: string; emoji?: string; swatchColor?: string;
  selected: boolean; onPress: () => void;
}

function OptionPill({ label, emoji, swatchColor, selected, onPress }: PillProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 60 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View style={[pStyles.pill, selected && pStyles.pillSelected, { transform: [{ scale }] }]}>
        {swatchColor && <View style={[pStyles.swatch, { backgroundColor: swatchColor }, selected && pStyles.swatchSelected]} />}
        {emoji && !swatchColor && <Text style={pStyles.emoji}>{emoji}</Text>}
        <Text style={[pStyles.label, selected && pStyles.labelSelected]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sStyles.section}>
      <Text style={sStyles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sStyles.row}>
        {children}
      </ScrollView>
    </View>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function MainDash({ onSave, initialConfig }: Props) {
  const [config, setConfig] = useState<RobotConfig>({
    skin:       initialConfig?.skin       ?? "silver",
    eyes:       initialConfig?.eyes       ?? "blue",
    suit:       initialConfig?.suit       ?? "none",
    accessory:  initialConfig?.accessory  ?? "none",
    antenna:    initialConfig?.antenna    ?? "ball",
    expression: initialConfig?.expression ?? "happy",
  });

  const [tab, setTab] = useState(0);
  const set = <K extends keyof RobotConfig>(key: K, value: RobotConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bimo 🤖</Text>
      <Text style={styles.subtitle}>Customize your own bimo to make it yours</Text>

      {/* ── 3D PREVIEW — drag left/right to rotate ── */}
      <View style={styles.previewBox}>
        <Bimo3D config={config} size={260} />
      </View>

      {/* ── TAB BAR ── */}
      <View style={styles.tabBar}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === i && styles.tabBtnActive]}
            onPress={() => setTab(i)} activeOpacity={0.8}>
            <Text style={[styles.tabLabel, tab === i && styles.tabLabelActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── OPTIONS ── */}
      <ScrollView style={styles.panel} showsVerticalScrollIndicator={false}>
        {tab === 0 && (
          <>
            <Section title="Skin Color">
              {SKINS.map(sk => <OptionPill key={sk.id} label={sk.label} swatchColor={sk.body} selected={config.skin === sk.id} onPress={() => set("skin", sk.id)} />)}
            </Section>
            <Section title="Eye Color">
              {EYES.map(ey => <OptionPill key={ey.id} label={ey.label} swatchColor={ey.color} selected={config.eyes === ey.id} onPress={() => set("eyes", ey.id)} />)}
            </Section>
            <Section title="Antenna">
              {ANTENNAS.map(an => <OptionPill key={an.id} label={an.label} emoji={an.shape === "none" ? "—" : "📡"} selected={config.antenna === an.id} onPress={() => set("antenna", an.id)} />)}
            </Section>
          </>
        )}
        {tab === 1 && (
          <Section title="Suit / Style">
            {SUITS.map(su => <OptionPill key={su.id} label={su.label} emoji={su.emoji} selected={config.suit === su.id} onPress={() => set("suit", su.id)} />)}
          </Section>
        )}
        {tab === 2 && (
          <Section title="Expression">
            {EXPRESSIONS.map(ex => <OptionPill key={ex.id} label={ex.label} emoji={ex.emoji} selected={config.expression === ex.id} onPress={() => set("expression", ex.id)} />)}
          </Section>
        )}
        {tab === 3 && (
          <Section title="Accessories">
            {ACCESSORIES.map(ac => <OptionPill key={ac.id} label={ac.label} emoji={ac.emoji} selected={config.accessory === ac.id} onPress={() => set("accessory", ac.id)} />)}
          </Section>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={() => onSave?.(config)} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save My Bimo</Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#E8E8E2" },
  title:          { fontSize: 26, fontWeight: "800", color: "#111", textAlign: "center", marginTop: 52, marginBottom: 2 },
  subtitle:       { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 12 },
  previewBox:     { height: 280, alignItems: "center", justifyContent: "center", marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 20, borderWidth: 2, borderColor: "#000", marginBottom: 16, overflow: "hidden" },
  tabBar:         { flexDirection: "row", marginHorizontal: 20, marginBottom: 4, gap: 8 },
  tabBtn:         { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: "#000", backgroundColor: "#fff", alignItems: "center" },
  tabBtnActive:   { backgroundColor: "#C7FF01" },
  tabLabel:       { fontSize: 13, fontWeight: "700", color: "#555" },
  tabLabelActive: { color: "#111" },
  panel:          { flex: 1 },
  saveBtn:        { marginHorizontal: 20, marginTop: 24, paddingVertical: 16, backgroundColor: "#C7FF01", borderRadius: 14, alignItems: "center", borderWidth: 2, borderColor: "#000" },
  saveBtnText:    { fontSize: 17, fontWeight: "800", color: "#111" },
});

const pStyles = StyleSheet.create({
  pill:           { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: "#fff", borderRadius: 20, borderWidth: 2, borderColor: "#000" },
  pillSelected:   { backgroundColor: "#C7FF01" },
  swatch:         { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: "transparent" },
  swatchSelected: { borderColor: "#000" },
  emoji:          { fontSize: 14 },
  label:          { fontSize: 12, fontWeight: "700", color: "#333" },
  labelSelected:  { color: "#111" },
});

const sStyles = StyleSheet.create({
  section: { paddingTop: 16, paddingHorizontal: 20 },
  title:   { fontSize: 11, fontWeight: "800", color: "#999", letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 10 },
  row:     { flexDirection: "row", gap: 8, paddingBottom: 4 },
});
