import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { validateEmail } from "../utils/validations";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Error", "Correo inválido");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Registro</Text>
      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Confirmar contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}