import { ScrollView, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { tokens } from "../theme/tokens.js";

const { color, space, radius, shadow } = tokens;

// Group 29 — Shift 05, Praktikum PPB.
const GROUP = {
  number: "Kelompok 29",
  shift: "Shift 05",
  course: "Praktikum Pemrograman Perangkat Bergerak",
  module: "Modul 6",
  year: "2026",
};

const MEMBERS = [
  { id: "rexa", name: "Rexsa Ghani Kurnianto", nim: "21120124140142" },
  { id: "andri", name: "Andri Pratama", nim: "21120124140134" },
  { id: "zaydan", name: "Ahmad Zaydan Iswandi", nim: "21120124130079" },
  { id: "alfitra", name: "Alfitra Ulinuha Yusuf", nim: "21120124130087" },
];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function InfoRow({ icon, label, value, isFirst }) {
  return (
    <View style={[styles.infoRow, !isFirst && styles.infoRowDivider]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={17} color={color.primary} />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const reduceMotion = useReducedMotion();
  const entering = reduceMotion
    ? FadeInDown.duration(120)
    : FadeInDown.duration(tokens.motion.entering);

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Animated.View style={styles.hero} entering={entering}>
          <View style={styles.heroBubbleLarge} pointerEvents="none" />
          <View style={styles.heroBubbleSmall} pointerEvents="none" />
          <Text style={styles.heroEyebrow}>
            {GROUP.course} · {GROUP.module}
          </Text>
          <Text style={styles.heroTitle}>{GROUP.number}</Text>
          <Text style={styles.heroSubtitle}>
            {GROUP.shift} · {GROUP.year}
          </Text>
          <View style={styles.heroPill}>
            <Ionicons name="people-outline" size={14} color={color.onPrimary} />
            <Text style={styles.heroPillText}>
              {MEMBERS.length} anggota
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={styles.card} entering={entering}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="people" size={18} color={color.text2} />
              <Text style={styles.cardTitle}>Anggota Kelompok</Text>
            </View>
            <Text style={styles.cardHint}>{GROUP.number}</Text>
          </View>
          {MEMBERS.map((member, index) => (
            <View
              key={member.id}
              style={[styles.memberRow, index > 0 && styles.memberDivider]}
              accessible
              accessibilityLabel={`${member.name}, NIM ${member.nim}`}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(member.name)}</Text>
              </View>
              <View style={styles.memberCopy}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberNim}>NIM {member.nim}</Text>
              </View>
              <Ionicons name="person-outline" size={16} color={color.text3} />
            </View>
          ))}
        </Animated.View>

        <Animated.View style={styles.card} entering={entering}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="information-circle" size={18} color={color.text2} />
              <Text style={styles.cardTitle}>Tentang Aplikasi</Text>
            </View>
          </View>
          <Text style={styles.aboutText}>
            LiveTemp memantau suhu sensor IoT secara real-time melalui MQTT,
            mencatat pembacaan yang melewati batas, dan menyimpan riwayat
            perubahan threshold ke backend.
          </Text>
          <View style={styles.infoList}>
            <InfoRow
              icon="thermometer-outline"
              label="Fitur"
              value="Monitoring real-time, alarm, dan threshold"
              isFirst
            />
            <InfoRow
              icon="git-branch-outline"
              label="Arsitektur"
              value="Expo · React Native · MQTT · PostgreSQL"
            />
            <InfoRow
              icon="school-outline"
              label="Mata kuliah"
              value={GROUP.course}
            />
          </View>
        </Animated.View>

        <Text style={styles.footer}>
          {GROUP.number} · {GROUP.shift} · {GROUP.year}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
  },
  container: {
    padding: space.lg,
    paddingBottom: space.xxl,
    gap: space.lg,
    backgroundColor: color.bg,
  },
  hero: {
    backgroundColor: color.primary,
    borderRadius: radius.card,
    borderCurve: "continuous",
    padding: space.xl,
    gap: 6,
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.22)",
  },
  heroBubbleLarge: {
    position: "absolute",
    top: -70,
    right: -50,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  heroBubbleSmall: {
    position: "absolute",
    bottom: -46,
    right: 54,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.78)",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: color.onPrimary,
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    fontVariant: ["tabular-nums"],
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: space.sm,
    paddingVertical: 6,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderCurve: "continuous",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: color.onPrimary,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: color.border,
    boxShadow: shadow.card,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: tokens.type.section,
    fontWeight: "700",
    color: color.text,
  },
  cardHint: {
    fontSize: 12,
    fontWeight: "600",
    color: color.text3,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: 13,
    paddingHorizontal: space.lg,
  },
  memberDivider: {
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: color.primary,
  },
  memberCopy: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: color.text,
  },
  memberNim: {
    fontSize: 12.5,
    color: color.text3,
    fontVariant: ["tabular-nums"],
  },
  aboutText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: color.text2,
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
  },
  infoList: {
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: 12,
    paddingHorizontal: space.lg,
  },
  infoRowDivider: {
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.input,
    borderCurve: "continuous",
    backgroundColor: color.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCopy: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: color.text3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 13.5,
    color: color.text,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: color.text3,
    fontVariant: ["tabular-nums"],
  },
});
