import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
	Easing,
	FadeIn,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withRepeat,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { tokens } from "../theme/tokens.js";

const { color, space } = tokens;

const HOLD_MS = 1500;
const FADE_MS = 360;
const MARK = 104;
const BAR_WIDTH = 148;

// Custom launch splash: drawn with plain views so it paints immediately,
// before the Skia canvas or remote data has loaded.
export function SplashOverlay({ onFinish }) {
	const reduceMotion = useReducedMotion();

	const fade = useSharedValue(1);
	const markScale = useSharedValue(reduceMotion ? 1 : 0.72);
	const copyShift = useSharedValue(reduceMotion ? 0 : 16);
	const markOpacity = useSharedValue(reduceMotion ? 1 : 0);
	const orbit = useSharedValue(0);
	const progress = useSharedValue(0);

	useEffect(() => {
		markOpacity.set(withTiming(1, { duration: reduceMotion ? 0 : 260 }));
		markScale.set(
			reduceMotion
				? 1
				: withSpring(1, { damping: 14, stiffness: 140, mass: 0.7 }),
		);
		copyShift.set(
			withDelay(
				reduceMotion ? 0 : 140,
				withTiming(0, { duration: reduceMotion ? 0 : 360, easing: Easing.out(Easing.cubic) }),
			),
		);
		progress.set(
			withDelay(
				reduceMotion ? 0 : 180,
				withTiming(1, {
					duration: reduceMotion ? 420 : HOLD_MS,
					easing: Easing.out(Easing.cubic),
				}),
			),
		);
		if (!reduceMotion) {
			orbit.set(
				withRepeat(
					withTiming(1, { duration: 2600, easing: Easing.linear }),
					-1,
					false,
				),
			);
		}
		fade.set(
			withDelay(
				reduceMotion ? 450 : HOLD_MS + 120,
				withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.quad) }),
			),
		);

		const total = reduceMotion ? 450 + FADE_MS : HOLD_MS + 120 + FADE_MS;
		const timer = setTimeout(onFinish, total);
		return () => clearTimeout(timer);
	}, [
		copyShift,
		fade,
		markOpacity,
		markScale,
		orbit,
		progress,
		reduceMotion,
		onFinish,
	]);

	const overlayStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
	const markStyle = useAnimatedStyle(() => ({
		opacity: markOpacity.value,
		transform: [{ scale: markScale.value }],
	}));
	const copyStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: copyShift.value }],
	}));
	const orbitStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${orbit.value * 360}deg` }],
	}));
	const orbitStyleReverse = useAnimatedStyle(() => ({
		transform: [{ rotate: `${-orbit.value * 360}deg` }],
	}));
	const progressStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: progress.value }],
	}));

	return (
		<Animated.View
			entering={FadeIn.duration(reduceMotion ? 0 : 140)}
			style={[styles.overlay, overlayStyle]}
			accessible
			accessibilityViewIsModal
			accessibilityLabel="LiveTemp is starting"
		>
			<View style={styles.decorTop} pointerEvents="none" />
			<View style={styles.decorBottom} pointerEvents="none" />

			<View style={styles.center}>
				<Animated.View style={[styles.mark, markStyle]}>
					<View style={styles.ringOuter} />
					<View style={styles.ringInner} />
					<View style={styles.core}>
						<Text style={styles.coreText}>LT</Text>
					</View>
					<Animated.View
						style={[styles.orbit, orbitStyle]}
						pointerEvents="none"
					>
						<View style={styles.satellite} />
					</Animated.View>
					<Animated.View
						style={[styles.orbit, orbitStyleReverse]}
						pointerEvents="none"
					>
						<View style={[styles.satellite, styles.satelliteTrailing]} />
					</Animated.View>
				</Animated.View>

				<Animated.View style={[styles.copy, copyStyle]}>
					<Text style={styles.title}>LiveTemp</Text>
					<Text style={styles.subtitle}>Suhu real-time, langsung dari sensor</Text>
				</Animated.View>

				<View
					style={styles.progressTrack}
					accessibilityRole="progressbar"
					accessibilityLabel="Loading application"
				>
					<Animated.View style={[styles.progressFill, progressStyle]} />
				</View>

				<Text style={styles.footer}>IoT Temperature Monitor</Text>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		zIndex: 10,
		backgroundColor: color.bg,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	center: {
		alignItems: "center",
		gap: space.lg,
		paddingHorizontal: space.xxl,
	},
	decorTop: {
		position: "absolute",
		top: -120,
		right: -120,
		width: 320,
		height: 320,
		borderRadius: 160,
		backgroundColor: color.primary,
		opacity: 0.06,
	},
	decorBottom: {
		position: "absolute",
		bottom: -160,
		left: -110,
		width: 300,
		height: 300,
		borderRadius: 150,
		borderWidth: 1,
		borderColor: color.primary,
		opacity: 0.12,
	},
	mark: {
		width: MARK,
		height: MARK,
		alignItems: "center",
		justifyContent: "center",
	},
	ringOuter: {
		...StyleSheet.absoluteFillObject,
		borderRadius: MARK / 2,
		borderWidth: 1,
		borderColor: "rgba(37, 99, 235, 0.28)",
	},
	ringInner: {
		position: "absolute",
		top: 16,
		left: 16,
		right: 16,
		bottom: 16,
		borderRadius: (MARK - 32) / 2,
		borderWidth: 1,
		borderColor: "rgba(37, 99, 235, 0.16)",
	},
	core: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: color.primary,
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 6px 20px rgba(37, 99, 235, 0.35)",
	},
	coreText: {
		color: color.onPrimary,
		fontSize: 19,
		fontWeight: "700",
		letterSpacing: -0.5,
		fontFamily: "monospace",
	},
	orbit: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
	},
	satellite: {
		width: 9,
		height: 9,
		borderRadius: 5,
		backgroundColor: color.primary,
		marginTop: -4,
		boxShadow: "0 0 10px rgba(37, 99, 235, 0.55)",
	},
	satelliteTrailing: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: color.warnText,
		opacity: 0.8,
		marginTop: 12,
	},
	copy: {
		alignItems: "center",
		gap: 6,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: color.text,
		letterSpacing: -1,
		fontFamily: "monospace",
	},
	subtitle: {
		fontSize: 13,
		color: color.text2,
		textAlign: "center",
	},
	progressTrack: {
		width: BAR_WIDTH,
		height: 3,
		borderRadius: 2,
		backgroundColor: color.border,
		overflow: "hidden",
		marginTop: space.sm,
	},
	progressFill: {
		width: BAR_WIDTH,
		height: 3,
		borderRadius: 2,
		backgroundColor: color.primary,
		transformOrigin: "left",
	},
	footer: {
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 1.4,
		textTransform: "uppercase",
		color: color.text3,
	},
});
