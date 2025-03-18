import { FunctionComponent, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Platform } from "react-native";

import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/pushNotificationHelper";

import { useRouter } from "expo-router";
import { supabase } from "@/supabase/supabase";
import pushTokenService from "@/service/pushTokenService/push-token-service";

type LoginProps = {};

const Login: FunctionComponent<LoginProps> = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Response Receiver", response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const handleNav = () => {
    router.navigate("/register");
  };

  const handleChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) return { valid: false, message: "Email is required" };
    if (!/^\S+@\S+\.\S+$/.test(email))
      return { valid: false, message: "Please enter a valid email" };
    if (!password.trim())
      return { valid: false, message: "Password is required" };

    return { valid: true, message: "" };
  };

  const handleForgotPassword = () => {
    // You can implement password reset logic here
    if (formData.email) {
      alert(`Password reset instructions will be sent to ${formData.email}`);
      // Add actual password reset implementation here
    } else {
      setErrorMessage("Please enter your email first");
    }
  };

  const submit = async () => {
    // Validate form
    const validation = validateForm();
    if (!validation.valid) {
      setErrorMessage(validation.message);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }
      console.log('HERE____HERE', data);
      await pushTokenService(expoPushToken, data.user.id);
      router.replace("/(tabs)"); // Adjust this based on your app's routing
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          placeholderTextColor="#666"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          autoCapitalize="none"
          secureTextEntry={true}
          placeholderTextColor="#666"
          placeholder="Password"
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <Pressable onPress={submit} style={styles.button} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.registerPrompt}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <Pressable onPress={handleNav}>
            <Text style={styles.registerLink}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    height: 55,
    color: "black",
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    marginVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  registerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#333",
  },
  registerLink: {
    color: "#2196F3",
    fontWeight: "500",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginVertical: 5,
  },
  forgotPasswordText: {
    color: "#2196F3",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
});

export default Login;
