import React from "react";
import { View, Text, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function HomeScreen() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenido al Dashboard de Finanzas</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}