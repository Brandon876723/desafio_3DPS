import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList, Alert, StyleSheet, ScrollView } from "react-native";
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker"; // para que seleccione el tipo y cuenta
import { signOut } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker"; // para la fecha
import { db, auth } from "../utils/firebase";

export default function HomeScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("gasto");
  const [account, setAccount] = useState("Efectivo");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showFormDatePicker, setShowFormDatePicker] = useState(false);
  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);

  //creamos la transaccion 
 const handleAddTransaction = async () => {
  if (!amount || !category || !description) {
    Alert.alert("Error", "Completa todos los campos antes de agregar");
    return;
  }

  try {
    const uid = auth.currentUser.uid;
    await addDoc(collection(db, "transactions"), {
      uid,
      amount: parseFloat(amount),
      category,
      type,
      account,
      date: new Date(date),
      description,
    });

    Alert.alert("Éxito", "Transacción agregada correctamente ✅");
    resetForm();
    fetchTransactions();
  } catch (error) {
    Alert.alert("Error", "No se pudo guardar la transacción: " + error.message);
  }
};

  //Leemos las transacciones
  const fetchTransactions = async () => {
    const uid = auth.currentUser.uid;
    const q = query(collection(db, "transactions"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTransactions(data);
  };

  //Actualizamos la transaccion 
  const handleUpdateTransaction = async () => {
    if (!selectedId) {
      Alert.alert("Error", "Selecciona una transacción para actualizar");
      return;
    }
    const ref = doc(db, "transactions", selectedId);
    await updateDoc(ref, {
      amount: parseFloat(amount),
      category,
      type,
      account,
      date,
      description,
    });
    resetForm();
    fetchTransactions();
  };

  //Eliminamos la transaccion con confirmaciones
  const handleDeleteTransaction = (id) => {
  Alert.alert(
    "Confirmar eliminación",
    "¿Seguro que quieres eliminar esta transacción?",
    [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "transactions", id));
            Alert.alert("Éxito", "Transacción eliminada correctamente ✅");
            fetchTransactions();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar: " + error.message);
          }
        } 
      }
    ]
  );
};

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setType("gasto");
    setAccount("Efectivo");
    setDate(new Date());
    setDescription("");
    setSelectedId(null);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  //filtros por categoria
  const fetchByCategory = async (category) => {
  const uid = auth.currentUser.uid;
  const q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("category", "==", category)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setTransactions(data);
}; 
 
 //filtros por cuenta
 const fetchByAccount = async (account) => {
  const uid = auth.currentUser.uid;
  const q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("account", "==", account)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setTransactions(data);
};

//filtros por periodo de tiempo
const fetchByDateRange = async (startDate, endDate) => {
  const uid = auth.currentUser.uid;
  const q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setTransactions(data);
};

  //retornamos la vista
return (
  <View style={styles.container}>
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Transacciones</Text>

          {/* Botón de cerrar sesión */}
          <Button
            title="Cerrar sesión"
            color="red"
            onPress={async () => {
              await signOut(auth);
            }}
          />

          {/* Formulario */}
          <TextInput
            style={styles.input}
            placeholder="Monto"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Categoría"
            value={category}
            onChangeText={setCategory}
          />

          <Picker selectedValue={type} onValueChange={(val) => setType(val)} style={styles.input}>
            <Picker.Item label="Gasto" value="gasto" />
            <Picker.Item label="Ingreso" value="ingreso" />
          </Picker>

          <Picker selectedValue={account} onValueChange={(val) => setAccount(val)} style={styles.input}>
            <Picker.Item label="Efectivo" value="Efectivo" />
            <Picker.Item label="Banco" value="Banco" />
          </Picker>

          {/* Fecha de transacción */}
          <Button title="Seleccionar fecha" onPress={() => setShowFormDatePicker(true)} />
          {showFormDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowFormDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.buttonRow}>
            <Button title="Agregar" onPress={handleAddTransaction} />
            <Button title="Actualizar" onPress={handleUpdateTransaction} />
          </View>

          {/* Filtros */}
          <Text style={styles.subtitle}>Filtros</Text>

          <Picker
            selectedValue={category}
            onValueChange={(val) => fetchByCategory(val)}
            style={styles.input}
          >
            <Picker.Item label="Todas las categorías" value="" />
            <Picker.Item label="Comida" value="Comida" />
            <Picker.Item label="Transporte" value="Transporte" />
            <Picker.Item label="Salario" value="Salario" />
          </Picker>

          <Picker
            selectedValue={account}
            onValueChange={(val) => fetchByAccount(val)}
            style={styles.input}
          >
            <Picker.Item label="Todas las cuentas" value="" />
            <Picker.Item label="Efectivo" value="Efectivo" />
            <Picker.Item label="Banco" value="Banco" />
          </Picker>

          {/* Fecha de filtro */}
          <Button title="Filtrar por fecha" onPress={() => setShowFilterDatePicker(true)} />
          {showFilterDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowFilterDatePicker(false);
                if (selectedDate) {
                  const start = selectedDate;
                  const end = new Date();
                  fetchByDateRange(start, end);
                }
              }}
            />
          )}
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>
            {`${item.type.toUpperCase()} - ${item.category}: $${item.amount} (${item.account})`}
          </Text>
          <Text>{item.description}</Text>
          <Text>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
          <View style={styles.itemButtons}>
            <Button
              title="Editar"
              onPress={() => {
                setAmount(item.amount.toString());
                setCategory(item.category);
                setType(item.type);
                setAccount(item.account);
                setDate(new Date(item.date.seconds * 1000));
                setDescription(item.description);
                setSelectedId(item.id);
              }}
            />
            <Button title="Eliminar" color="red" onPress={() => handleDeleteTransaction(item.id)} />
          </View>
        </View>
      )}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginVertical: 10,
  },
});