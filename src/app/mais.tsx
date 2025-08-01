import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

type Livro = {
  id: string;
  titulo: string;
  retirada: string;
  devolucao: string;
  devolvido?: boolean;
};

export default function AdicionarLivro() {
  const [titulo, setTitulo] = useState("");

  // Datas como objetos Date para o DatePicker
  const [retirada, setRetirada] = useState<Date | null>(null);
  const [devolucao, setDevolucao] = useState<Date | null>(null);

  // Controlar a exibição dos DatePickers
  const [showRetiradaPicker, setShowRetiradaPicker] = useState(false);
  const [showDevolucaoPicker, setShowDevolucaoPicker] = useState(false);

  // Formatar Date para string AAAA-MM-DD
  function formatarData(date: Date | null) {
    if (!date) return "";
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const dia = date.getDate().toString().padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  async function adicionarLivro() {
    if (!titulo || !retirada || !devolucao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (devolucao < retirada) {
      Alert.alert(
        "Erro",
        "A data de devolução não pode ser anterior à data de retirada."
      );
      return;
    }

    try {
      const jsonValue = await AsyncStorage.getItem("livros");
      const livros: Livro[] = jsonValue ? JSON.parse(jsonValue) : [];

      const novoLivro: Livro = {
        id: Date.now().toString(),
        titulo,
        retirada: formatarData(retirada),
        devolucao: formatarData(devolucao),
        devolvido: false,
      };

      const livrosAtualizados = [...livros, novoLivro];
      await AsyncStorage.setItem("livros", JSON.stringify(livrosAtualizados));

      Alert.alert("Sucesso", "Livro adicionado com sucesso!");
      setTitulo("");
      setRetirada(null);
      setDevolucao(null);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o livro.");
      console.error("Erro ao salvar livro", e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adicionar Livro</Text>

      <TextInput
        style={styles.input}
        placeholder="Título do Livro"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={{ marginBottom: 4 }}>Data de Retirada</Text>
      <TextInput
        style={styles.input}
        placeholder="Escolha a data de retirada"
        value={formatarData(retirada)}
        onFocus={() => setShowRetiradaPicker(true)}
      />

      {showRetiradaPicker && (
        <DateTimePicker
          value={retirada || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={(_, selectedDate) => {
            setShowRetiradaPicker(Platform.OS === "ios");
            if (selectedDate) setRetirada(selectedDate);
          }}
        />
      )}

      <Text style={{ marginBottom: 4, marginTop: 10 }}>Data de Devolução</Text>
      <TextInput
        style={styles.input}
        placeholder="Escolha a data de devolução"
        value={formatarData(devolucao)}
        onFocus={() => setShowDevolucaoPicker(true)}
      />

      {showDevolucaoPicker && (
        <DateTimePicker
          value={devolucao || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={(_, selectedDate) => {
            setShowDevolucaoPicker(Platform.OS === "ios");
            if (selectedDate) setDevolucao(selectedDate);
          }}
        />
      )}

      <Button title="Salvar Livro" onPress={adicionarLivro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});
