import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/.expo/navigation/type";
import DateTimePicker from "@react-native-community/datetimepicker";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ResponseError } from "expo-auth-session/build/Errors";

//required for auth flow
WebBrowser.maybeCompleteAuthSession();

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

export function Signup({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(600)).current;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "201938807441-i97evbdcsc8v09e2p2lqk907a80shbq4.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;

      navigation.navigate("MainDash");
    }
  }, [response]);

  const openModal = () => {
    setModalVisible(true);
    setDate(null);

    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleSignup = () => {
    console.log("Sign up with:", {
      name,
      email,
      password,
      birthdate: date,
    });

    // closeModal();
    navigation.navigate("MainDash");
  };

  return (
    <View style={styles.container}>
      {/* Main screen */}
      <Image
        source={require("../assets/images/char.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Join Bimo!</Text>
      <Text style={styles.subtitle}>Your next spark is one step away 💘</Text>

      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* GOOGLE */}
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => promptAsync()}
      >
        <View style={styles.socialContent}>
          <Image
            source={require("../assets/images/google.png")}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      {/* INSTAGRAM */}
      <TouchableOpacity style={styles.socialButton}>
        <View style={styles.socialContent}>
          <Image
            source={require("../assets/images/instagram.png")}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialText}>Continue with Instagram</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Log In
        </Text>
      </Text>

      {/* MODAL */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Animated.View
            style={[
              styles.modalSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.handle} />

            <Text style={styles.modalTitle}>Create Your Account</Text>
            <Text style={styles.modalSubtitle}>
              Fill in your details below ✨
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#999"
              />

              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#999"
              />

              <Pressable onPress={() => setOpen(true)}>
                <TextInput
                  value={
                    date
                      ? date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""
                  }
                  placeholder="Select Birthdate"
                  editable={false}
                  style={styles.input}
                />
              </Pressable>

              {open && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setOpen(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#999"
              />

              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSignup}
              >
                <Text style={styles.modalButtonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#101828",
  },

  subtitle: {
    fontSize: 16,
    color: "#667085",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#C7FF01",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
  },

  buttonText: {
    color: "#020101",
    fontSize: 18,
    fontWeight: "600",
  },

  orText: {
    marginVertical: 15,
    fontSize: 14,
    color: "#667085",
  },

  socialButton: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
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
    color: "#344054",
    fontWeight: "500",
  },

  footerText: {
    marginTop: 20,
    color: "black",
  },

  loginLink: {
    fontWeight: "600",
    color: "#4F46E5",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: "88%",
    borderWidth: 2,
    borderColor: "black",
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101828",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 20,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  input: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "black",
  },

  modalButton: {
    backgroundColor: "#C7FF01",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 10,
  },

  modalButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },

  cancelText: {
    color: "#667085",
    fontSize: 15,
  },
});
