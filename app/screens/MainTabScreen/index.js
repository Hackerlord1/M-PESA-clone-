import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar, View, Text, StyleSheet, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../HomeScreen";
import WelcomeScreen from "../WelcomeScreen";

const Tab = createBottomTabNavigator();

function MainTabScreen() {
  if (__DEV__) {
    console.log("Rendering MainTabScreen");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" translucent={false} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,


          tabBarStyle: {
            backgroundColor: "#292929",
            borderTopWidth: 1,
            borderTopColor: "#333",
            height: Platform.OS === 'ios' ? 80 : 60,
            paddingBottom: Platform.OS === 'ios' ? 20 : 5,
            position: 'relative',
            zIndex: 1000,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 5,
          },
          tabBarVisible: true,
          lazy: true,
        }}
      >
        <Tab.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            tabBarAccessibilityLabel: "Home Tab",
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Image
                  source={require("../../assets/home1.png")}
                  style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}
                  onError={(e) => console.log("Home icon load error:", e.nativeEvent.error)}
                  onLoad={() => console.log("Home icon loaded successfully")}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={focused ? styles.activeLabel : styles.inactiveLabel}
                accessibilityRole="tab"
              >
                HOME
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="TRANSACT"
          component={WelcomeScreen}
          options={{
            tabBarAccessibilityLabel: "Transaction Tab",
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Image
                  source={require("../../assets/transact.png")}
                  style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}
                  onError={(e) => console.log("Transaction icon load error:", e.nativeEvent.error)}
                  onLoad={() => console.log("Transaction icon loaded successfully")}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={focused ? styles.activeLabel : styles.inactiveLabel}
                accessibilityRole="tab"
              >
                TRANSACT
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="SERVICES"
          component={WelcomeScreen}
          options={{
            tabBarAccessibilityLabel: "Services Tab",
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Image
                  source={require("../../assets/services.png")}
                  style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}
                  onError={(e) => console.log("Services icon load error:", e.nativeEvent.error)}
                  onLoad={() => console.log("Services icon loaded successfully")}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={focused ? styles.activeLabel : styles.inactiveLabel}
                accessibilityRole="tab"
              >
                SERVICES
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="GROW"
          component={WelcomeScreen}
          options={{
            tabBarAccessibilityLabel: "Grow Tab",
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Image
                  source={require("../../assets/grow.png")}
                  style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}
                  onError={(e) => console.log("Grow icon load error:", e.nativeEvent.error)}
                  onLoad={() => console.log("Grow icon loaded successfully")}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={focused ? styles.activeLabel : styles.inactiveLabel}
                accessibilityRole="tab"
              >
                GROW
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: "##292929",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveTab: {
    backgroundColor: "##292929",
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",

  },
  tabIcon: {
    width: 23,
    height: 23,
    resizeMode: "contain",



  },
  activeLabel: {
    color: "#4caf50",
    fontSize: 11,

    marginBottom: 5,
  },
  inactiveLabel: {
    color: "#b0b0b0",
    fontSize: 10.4,

    marginBottom: 5,
  },
});

export default MainTabScreen;