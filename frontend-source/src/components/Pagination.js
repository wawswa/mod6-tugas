import { Pressable, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { tokens } from "../theme/tokens.js";

const { color, space, radius } = tokens;

export function Pagination({
	page,
	pageCount,
	start,
	end,
	total,
	onPrev,
	onNext,
}) {
	const canPrev = page > 1;
	const canNext = page < pageCount;
	const rangeLabel =
		total > 0 ? `Menampilkan ${start}\u2013${end} dari ${total}` : "Tidak ada data";

	return (
		<View style={styles.container}>
			<View style={styles.summaryRow}>
				<Text style={styles.summary}>{rangeLabel}</Text>
				<Text
					style={styles.pageLabel}
					accessibilityLiveRegion="polite"
					accessibilityLabel={`Halaman ${page} dari ${pageCount}`}
				>
					Hal. {page}/{pageCount}
				</Text>
			</View>

			<View style={styles.controls}>
				<Pressable
					onPress={onPrev}
					disabled={!canPrev}
					accessibilityRole="button"
					accessibilityLabel="Halaman sebelumnya"
					accessibilityHint="Menampilkan data halaman sebelumnya"
					accessibilityState={{ disabled: !canPrev }}
					hitSlop={4}
					style={({ pressed }) => [
						styles.button,
						styles.secondaryButton,
						!canPrev && styles.disabled,
						pressed && canPrev && styles.pressed,
					]}
				>
					<Ionicons
						name="chevron-back"
						size={16}
						color={canPrev ? color.text : color.text3}
					/>
					<Text style={[styles.buttonText, styles.secondaryText]}>
						Sebelumnya
					</Text>
				</Pressable>

				<Pressable
					onPress={onNext}
					disabled={!canNext}
					accessibilityRole="button"
					accessibilityLabel="Halaman berikutnya"
					accessibilityHint="Menampilkan data halaman berikutnya"
					accessibilityState={{ disabled: !canNext }}
					hitSlop={4}
					style={({ pressed }) => [
						styles.button,
						styles.primaryButton,
						!canNext && styles.disabled,
						pressed && canNext && styles.pressed,
					]}
				>
					<Text style={[styles.buttonText, styles.primaryText]}>
						Berikutnya
					</Text>
					<Ionicons name="chevron-forward" size={16} color={color.onPrimary} />
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: space.sm,
		marginTop: -space.sm,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: space.sm,
		paddingHorizontal: 2,
	},
	summary: {
		fontSize: 13,
		color: color.text2,
		fontVariant: ["tabular-nums"],
	},
	pageLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: color.text3,
		fontVariant: ["tabular-nums"],
	},
	controls: {
		flexDirection: "row",
		gap: space.sm,
	},
	button: {
		flex: 1,
		minHeight: tokens.hit,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		borderRadius: radius.cta,
		borderCurve: "continuous",
		paddingHorizontal: space.md,
	},
	secondaryButton: {
		backgroundColor: color.surface,
		borderWidth: 1,
		borderColor: color.border,
		boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
	},
	primaryButton: {
		backgroundColor: color.primary,
	},
	buttonText: {
		fontSize: 14,
		fontWeight: "600",
	},
	secondaryText: {
		color: color.text,
	},
	primaryText: {
		color: color.onPrimary,
	},
	disabled: {
		opacity: 0.4,
	},
	pressed: {
		opacity: 0.9,
		transform: [{ scale: 0.98 }],
	},
});
