import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
  Easing,
} from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  profileContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginTop: -6,
  },
  pressableImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    color: "#fff",
    fontFamily: "Barlow-Medium",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 8,
  },
  phone: {
    color: "#9CA3AF",
    fontSize: 12,
    fontFamily: "Barlow-Medium",
    marginTop: 4,
  },
  pinLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontFamily: "Barlow-Medium",
    marginBottom: -30,
    marginTop: 55,
  },
  validatingLabel: {
    color: "#4CAF50",
    fontSize: 12,
    fontFamily: "Barlow-Medium",
    marginBottom: -30,
    marginTop: 55,
  },
  pinContainer: {
    flexDirection: "row",
    marginTop: 48,
  },
  pinDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 9.5,
    marginTop: -7,
    marginBottom: 70,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  greenDot: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: 16,
    height: 16,
    position: "absolute",
  },
  whiteDot: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 16,
    height: 16,
    position: "absolute",
  },
  animatedBackground: {
    position: "absolute",
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  keypadContainer: {
    marginTop: 75,
    width: "75%",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  keyButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -8,
  },
  keyText: {
    fontFamily: "Barlow-Medium",
    color: "#fff",
    fontSize: 25,
    fontWeight: "600",
  },
  keyIcon: {
    width: 33,
    height: 33,
    resizeMode: "contain",
  },
  emptyKey: {
    width: 64,
    height: 64,
  },
});

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("WelcomeScreen Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <Text style={{ color: "#fff" }}>Error in WelcomeScreen</Text>;
    }
    return this.props.children;
  }
}

export default function WelcomeScreen({ navigation }) {
  const [pin, setPin] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [profileImage, setProfileImage] = useState(require("../../assets/masoko.png"));
  const correctPin = "1234";
  const anims = useRef(
    Array(4)
      .fill()
      .map(() => ({
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
      }))
  ).current;
  const validateAnims = useRef(
    Array(4)
      .fill()
      .map(() => ({
        greenScale: new Animated.Value(1),
        whiteScale: new Animated.Value(0),
        newGreenOpacity: new Animated.Value(0),
      }))
  ).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;

  const handleImageSelection = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.error("ImagePicker Error:", response.errorMessage);
        Alert.alert("Error", "Failed to select image: " + response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        console.log("Image selected:", response.assets[0].uri);
        setProfileImage({ uri: response.assets[0].uri });
      }
    });
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        console.log("Correct PIN entered, starting validation animation");
        setIsValidating(true);
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(labelOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
        const animations = validateAnims.map((anim, index) => {
          if (!anim || !anim.greenScale || !anim.whiteScale || !anim.newGreenOpacity) {
            console.warn(`Validation animation at index ${index} is undefined`);
            return Animated.sequence([]);
          }
          return Animated.sequence([
            Animated.parallel([
              Animated.timing(anim.greenScale, {
                toValue: 2.5,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(anim.whiteScale, {
                toValue: 2.5,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(anim.newGreenOpacity, {
              toValue: 1,
              duration: 100,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]);
        });
        // Reset animation values before each loop iteration
        const resetAnimations = () => {
          validateAnims.forEach((anim) => {
            anim.greenScale.setValue(1);
            anim.whiteScale.setValue(0);
            anim.newGreenOpacity.setValue(0);
          });
        };
        const loopedAnimation = Animated.loop(
          Animated.sequence([
            Animated.stagger(100, animations),
            Animated.timing(new Animated.Value(0), {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
        loopedAnimation.start();
        // Stop the loop and navigate after a delay (e.g., after 2 loops)
        setTimeout(() => {
          loopedAnimation.stop();
          resetAnimations();
          console.log("Validation animation complete, navigating to Main");
          setIsValidating(false);
          navigation.navigate("Main");
        }, 600); // 2 loops: (300ms + 100ms) * 4 dots = 1600ms
      } else {
        console.log("Incorrect PIN:", pin);
        Alert.alert("Incorrect PIN", "Please try again.", [
          { text: "OK", onPress: () => setPin("") },
        ]);
      }
    }
  }, [pin, navigation]);

  useEffect(() => {
    if (pin.length > 0 && !isValidating) {
      const index = pin.length - 1;
      if (anims[index]?.scale && anims[index]?.opacity) {
        Animated.parallel([
          Animated.timing(anims[index].scale, {
            toValue: 1,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(anims[index].opacity, {
            toValue: 1,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        console.warn(`Animation at index ${index} is undefined`);
      }
    }
  }, [pin, isValidating]);

  useEffect(() => {
    if (pin.length === 0 && !isValidating) {
      anims.forEach((anim, index) => {
        if (anim?.scale && anim?.opacity) {
          Animated.parallel([
            Animated.timing(anim.scale, {
              toValue: 0,
              duration: 75,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 75,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          console.warn(`Animation at index ${index} is undefined`);
        }
      });
      validateAnims.forEach((anim, index) => {
        if (anim?.greenScale && anim?.whiteScale && anim?.newGreenOpacity) {
          anim.greenScale.setValue(1);
          anim.whiteScale.setValue(0);
          anim.newGreenOpacity.setValue(0);
        } else {
          console.warn(`Validation animation at index ${index} is undefined during reset`);
        }
      });
    }
  }, [pin, isValidating]);

  const handleKeyPress = (key) => {
    if (pin.length < 4) {
      setPin((prev) => {
        const newPin = prev + key;
        console.log("Key pressed:", key, "New PIN:", newPin);
        return newPin;
      });
    }
  };

  const handleDeletePress = () => {
    setPin((prev) => {
      const newPin = prev.slice(0, -1);
      console.log("Delete pressed, New PIN:", newPin);
      return newPin;
    });
  };

  const handleFingerprintPress = () => {
    Alert.alert("Fingerprint Unlock", "Switch to fingerprint authentication?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => console.log("Switching to fingerprint unlock") },
    ]);
  };

  return (
    <ErrorBoundary>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent={false} />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Pressable onPress={handleImageSelection}>
            <Image
              source={profileImage}
              style={styles.profileImage}
              onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
            />
          </Pressable>
          <Text style={styles.name}>HEMAN CHIRCHIR</Text>
          <Text style={styles.phone}>254791220355</Text>
        </View>

        <View style={styles.profileContainer}>
          <Animated.Text
            style={[isValidating ? styles.validatingLabel : styles.pinLabel, { opacity: labelOpacity }]}
          >
            {isValidating ? "VALIDATING PIN..." : "ENTER M-PESA PIN:"}
          </Animated.Text>
          <View style={styles.pinContainer}>
            {[1, 2, 3, 4].map((i, index) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  { borderColor: isValidating ? "#4CAF50" : "#fff" },
                ]}
              >
                {pin.length >= i && !isValidating && anims[index]?.scale && anims[index]?.opacity && (
                  <Animated.View
                    style={[
                      styles.greenDot,
                      {
                        transform: [{ scale: anims[index].scale }],
                        opacity: anims[index].opacity,
                      },
                    ]}
                  />
                )}
                {isValidating &&
                  validateAnims[index]?.greenScale &&
                  validateAnims[index]?.whiteScale &&
                  validateAnims[index]?.newGreenOpacity && (
                    <>
                      <Animated.View
                        style={[
                          styles.animatedBackground,
                          {
                            backgroundColor: "#4CAF50",
                            transform: [{ scale: validateAnims[index].greenScale }],
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.animatedBackground,
                          {
                            backgroundColor: "#FFFFFF",
                            transform: [{ scale: validateAnims[index].whiteScale }],
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.greenDot,
                          {
                            opacity: validateAnims[index].newGreenOpacity,
                          },
                        ]}
                      />
                    </>
                  )}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("1")}>
              <Text style={styles.keyText}>1</Text>
            </Pressable>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("2")}>
              <Text style={styles.keyText}>2</Text>
            </Pressable>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("3")}>
              <Text style={styles.keyText}>3</Text>
            </Pressable>
          </View>
          <View style={styles.keypadRow}>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("4")}>
              <Text style={styles.keyText}>4</Text>
            </Pressable>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("5")}>
              <Text style={styles.keyText}>5</Text>
            </Pressable>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("6")}>
              <Text style={styles.keyText}>6</Text>
            </Pressable>
          </View>
          <View style={styles.keypadRow}>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("7")}>
              <Text style={styles.keyText}>7</Text>
            </Pressable>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("8")}>
              <Text style={styles.keyText}>8</Text>
            </Pressable>
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("9")}>
              <Text style={styles.keyText}>9</Text>
            </Pressable>
          </View>
          <View style={styles.keypadRow}>
            <View style={styles.emptyKey} />
            <Pressable style={styles.keyButton} onPress={() => handleKeyPress("0")}>
              <Text style={styles.keyText}>0</Text>
            </Pressable>
            {pin.length === 0 ? (
              <Pressable style={styles.keyButton} onPress={handleFingerprintPress}>
                <Image
                  source={require("../../assets/ic_fp_40px.png")}
                  style={styles.keyIcon}
                  onError={(e) => console.log("Fingerprint icon load error:", e.nativeEvent.error)}
                />
              </Pressable>
            ) : (
              <Pressable style={styles.keyButton} onPress={handleDeletePress}>
                <Image
                  source={require("../../assets/erad.png")}
                  style={styles.keyIcon}
                  onError={(e) => console.log("Erad icon load error:", e.nativeEvent.error)}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
}