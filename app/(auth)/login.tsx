import { ThemedTextInput } from "@/components/ThemedTextInput";
import { FunctionComponent, useState } from "react";
import { View, Text, TextInput } from "react-native";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
  const [text, setText] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "white",
      }}
    >
      <TextInput
        style={{
          borderColor: "black",
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          margin: 5,
          height: 60
        }}
        placeholder="Enter Email"
      />
      <TextInput
        style={{
          borderColor: "black",
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          margin: 5,
          height: 60
        }}
        placeholder="Enter Passwords"
      />
    </View>
  );
};

export default Login;
