import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { validateEmail } from "../utils/validations";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Error", "Correo inválido");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Éxito", "Has iniciado sesión");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
