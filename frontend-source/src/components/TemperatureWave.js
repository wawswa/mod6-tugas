import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useFrameCallback,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { tokens } from "../theme/tokens.js";

const { color, radius } = tokens;

function wavePath(width, height, cycles, amplitude, centerY, phase) {
  const step = Math.max(2, width / 120);
  const parts = [];
  for (let x = 0; x <= width; x += step) {
    const y =
      centerY +
      Math.sin((x / width) * cycles * Math.PI * 2 + phase) * amplitude;
    parts.push(`${x === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
}

function areaPath(width, height, cycles, amplitude, centerY, phase) {
  return `${wavePath(width, height, cycles, amplitude, centerY, phase)} L${width} ${height} L0 ${height} Z`;
}

export function TemperatureWave({
  tint = color.primary,
  beatKey = 0,
  height = 188,
  dimmed = false,
}) {
  const reduceMotion = useReducedMotion();
  const focused = useIsFocused();
  const [width, setWidth] = useState(0);
  const widthSV = useSharedValue(0);

  const mainOffset = useSharedValue(0);
  const secondaryOffset = useSharedValue(34);
  const tertiaryOffset = useSharedValue(68);
  const dimSV = useSharedValue(dimmed ? 1 : 0);
  const flash = useSharedValue(0);
  const scan = useSharedValue(-1);
  const firstBeat = useRef(true);

  const geometry = useMemo(() => {
    if (width <= 0) return null;
    const span = width * 2;
    const mainAmp = height * 0.16;
    const mainY = height * 0.54;
    return {
      span,
      fill: areaPath(span, height, 4, mainAmp, mainY, 0),
      main: wavePath(span, height, 4, mainAmp, mainY, 0),
      secondary: wavePath(span, height, 6, height * 0.09, height * 0.44, 1.1),
      tertiary: wavePath(span, height, 4, height * 0.22, height * 0.6, 2.2),
    };
  }, [width, height]);

  const onLayout = (event) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) {
      setWidth(next);
      widthSV.value = next;
    }
  };

  useEffect(() => {
    dimSV.set(withTiming(dimmed ? 1 : 0, { duration: 400 }));
  }, [dimmed, dimSV]);

  useEffect(() => {
    if (firstBeat.current) {
      firstBeat.current = false;
      return;
    }
    if (!beatKey || dimmed || reduceMotion) return;
    flash.set(0);
    flash.set(
      withTiming(1, { duration: 720, easing: Easing.out(Easing.quad) })
    );
    scan.set(-1);
    scan.set(0);
    scan.set(
      withTiming(1, { duration: 950, easing: Easing.out(Easing.cubic) })
    );
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // haptics unsupported — visual beat still plays
    }
  }, [beatKey, dimmed, reduceMotion, flash, scan]);

  const frame = useFrameCallback((info) => {
    "worklet";
    const dt = Math.min(0.05, (info.timeSincePreviousFrame ?? 16) / 1000);
    const w = widthSV.value || 1;
    mainOffset.value = (mainOffset.value + dt * 22) % w;
    secondaryOffset.value = (secondaryOffset.value + dt * 40) % w;
    tertiaryOffset.value = (tertiaryOffset.value + dt * 13) % w;
  });

  useEffect(() => {
    frame.setActive(focused && !reduceMotion && !dimmed);
  }, [focused, reduceMotion, dimmed, frame]);

  const layerOpacity = useAnimatedStyle(() => ({
    opacity: 1 - 0.62 * dimSV.value,
  }));

  const mainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -mainOffset.value }],
  }));
  const secondaryStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -secondaryOffset.value }],
  }));
  const tertiaryStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -tertiaryOffset.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: 0.16 * (1 - flash.value),
  }));

  const scanStyle = useAnimatedStyle(() => {
    const p = scan.value;
    if (p < 0) return { opacity: 0, transform: [{ translateX: 0 }] };
    return {
      opacity: 0.55 * (1 - p),
      transform: [{ translateX: p * (widthSV.value || 1) }],
    };
  });

  return (
    <View
      style={[styles.stage, { height }]}
      onLayout={onLayout}
      accessible={false}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, layerOpacity]}
        pointerEvents="none"
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <View
            key={ratio}
            style={[styles.gridLine, { top: height * ratio }]}
          />
        ))}

        {geometry ? (
          <>
            <Animated.View
              style={[
                styles.layer,
                { width: geometry.span, height },
                tertiaryStyle,
              ]}
            >
              <Svg width={geometry.span} height={height}>
                <Path
                  d={geometry.tertiary}
                  stroke={tint}
                  strokeOpacity={0.22}
                  strokeWidth={1}
                  strokeDasharray="5 7"
                  fill="none"
                />
              </Svg>
            </Animated.View>

            <Animated.View
              style={[
                styles.layer,
                { width: geometry.span, height },
                mainStyle,
              ]}
            >
              <Svg width={geometry.span} height={height}>
                <Defs>
                  <LinearGradient id="thermalFill" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={tint} stopOpacity={0.26} />
                    <Stop offset="1" stopColor={tint} stopOpacity={0.02} />
                  </LinearGradient>
                </Defs>
                <Path d={geometry.fill} fill="url(#thermalFill)" />
                <Path
                  d={geometry.main}
                  stroke={tint}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            </Animated.View>

            <Animated.View
              style={[
                styles.layer,
                { width: geometry.span, height },
                secondaryStyle,
              ]}
            >
              <Svg width={geometry.span} height={height}>
                <Path
                  d={geometry.secondary}
                  stroke={tint}
                  strokeOpacity={0.45}
                  strokeWidth={1.4}
                  fill="none"
                />
              </Svg>
            </Animated.View>
          </>
        ) : null}
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: tint },
          flashStyle,
        ]}
        pointerEvents="none"
      />

      <Animated.View
        style={[
          styles.scan,
          { backgroundColor: tint, height },
          scanStyle,
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: color.bg,
    borderRadius: radius.card,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: color.border,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: color.border,
    opacity: 0.7,
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  scan: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1.5,
  },
});
