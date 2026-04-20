import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/.expo/navigation/type";

import * as WebBrowser from "expo-web-browser";
import { useGoogleAuth } from "@/services/googleAuth";
// import * as Google from "expo-auth-session/providers/google";
// import { useGoogleAuth } from "@/services/googleAuth";

// Required for auth flow
WebBrowser.maybeCompleteAuthSession();

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

/* 🎯 Reusable Social Button */
const SocialButton = ({ icon, text, onPress }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.socialButton}
        activeOpacity={0.9}
        onPress={onPress} // ✅ now clickable
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <View style={styles.socialContent}>
          <Image source={icon} style={styles.socialIcon} resizeMode="contain" />
          <Text style={styles.socialText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export function Login({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {promptAsync} = useGoogleAuth();

  // ✅ Google Auth setup (UPDATED)
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "201938807441-i97evbdcsc8v09e2p2lqk907a80shbq4.apps.googleusercontent.com",

  //   // 🔥 Add this later if you already created it
  //   // androidClientId: "YOUR_ANDROID_CLIENT_ID",
  // });

  // ✅ Handle Google response
  // useEffect(() => {
  //   console.log("Response:", response);

  //   if (response?.type === "success") {
  //     const token = response.authentication?.accessToken;

  //     console.log("Google token:", token);

  //     // Navigate after success
  //     navigation.navigate("MainDash");
  //   }
  // }, [response]);

  /* ✨ Animations */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    console.log("Manual Login:", email, password);
    console.log('clickable')
    navigation.navigate('MainDash');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* LOGO */}
      <Image
        source={require("../assets/images/char.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue your journey</Text>

      {/* INPUTS */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* NORMAL LOGIN */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* ✅ GOOGLE LOGIN BUTTON */}
      <SocialButton
        icon={require("../assets/images/google.png")}
        text="Continue with Google"
        onPress={() => promptAsync()} // 🔥 NOW WORKS HERE
      />

      {/* INSTAGRAM (placeholder) */}
      <SocialButton
        icon={require("../assets/images/instagram.png")}
        text="Continue with Instagram"
        onPress={() => console.log("Instagram login soon")}
      />

      {/* FOOTER */}
      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text
          style={styles.signup}
          onPress={() => navigation.navigate("Signup")}
        >
          Sign Up
        </Text>
      </Text>
    </Animated.View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  button: {
    width: "100%",
    backgroundColor: "#C7FF01",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
    marginTop: 5,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "800",
  },

  orText: {
    marginVertical: 15,
    color: "#777",
  },

  socialButton: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#000",
    marginBottom: 10,
  },

  socialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  socialText: {
    fontWeight: "600",
    color: "#333",
  },

  footerText: {
    marginTop: 20,
    color: "#333",
  },

  signup: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});