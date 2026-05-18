import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/utils/firebase";

//importamos los screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen"

//creamos el navegador tipo stack que manejara las plantillas
const Stack = createStackNavigator();

export default function App() {
  //guardamos al usuario actual
  const [user, setUser] = useState(null);

  //se ejecutara al correr la app
  useEffect(() => {
    //sabra si el usuario inicia o cierra sesion
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //actualizara el estado con el usuario que este
      setUser(currentUser);
    });
    //limpiara el listener cuando desmontemos el componente
    return unsubscribe;
  }, []);

  //retornamos al usuario
  //si el usuario(user) existe nos mostrara el HomeScreen
  //si no existe nos  mostrara el login y el registro
  //hara que ssiempre sepa si el usuario esta autenticado
  //y lo pueda redirigir automaticamente
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}