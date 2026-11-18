import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MonitoringScreen } from "./src/screens/MonitoringScreen.js";
import { ControlScreen } from "./src/screens/ControlScreen.js";
import { ProfileScreen } from "./src/screens/ProfileScreen.js";
import { SplashOverlay } from "./src/components/SplashOverlay.js";
import { assertConfig } from "./src/services/config.js";
import { tokens } from "./src/theme/tokens.js";

const Tab = createBottomTabNavigator();
const { color } = tokens;

enableScreens(true);

const TAB_ICONS = {
  Monitoring: "pulse",
  Control: "options",
  Profile: "people",
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    assertConfig();
  }, []);

  const onSplashFinish = useCallback(() => setShowSplash(false), []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: color.bg,
      card: color.surface,
      text: color.text,
      border: color.border,
      primary: color.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <NavigationContainer theme={theme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: true,
              headerTitle: "LiveTemp",
              headerTitleAlign: "left",
              headerTintColor: color.text,
              headerStyle: {
                backgroundColor: color.surface,
                borderBottomWidth: 1,
                borderBottomColor: color.border,
              },
              headerTitleStyle: {
                fontWeight: "600",
                fontSize: 17,
                // ponytail: system monospace, no custom font dep
                fontFamily: "monospace",
                letterSpacing: -0.5,
              },
              tabBarActiveTintColor: color.primary,
              tabBarInactiveTintColor: color.text2,
              tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
              tabBarStyle: {
                backgroundColor: color.surface,
                borderTopWidth: 1,
                borderTopColor: color.border,
              },
              tabBarHideOnKeyboard: true,
              tabBarIcon: ({ color: iconColor }) => (
                <Ionicons
                  name={TAB_ICONS[route.name] ?? "ellipse"}
                  size={24}
                  color={iconColor}
                />
              ),
            })}
          >
            <Tab.Screen name="Monitoring" component={MonitoringScreen} />
            <Tab.Screen name="Control" component={ControlScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        {showSplash ? <SplashOverlay onFinish={onSplashFinish} /> : null}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
