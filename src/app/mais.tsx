import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Livro = {
  id: string;
  titulo: string;
  retirada: string;
  devolucao: string;
  devolvido?: boolean;
};

export default function AdicionarLivro() {
  const [titulo, setTitulo] = useState("");
  const [retirada, setRetirada] = useState("");
  const [devolucao, setDevolucao] = useState("");

  async function adicionarLivro() {
    if (!titulo || !retirada || !devolucao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // Simples validação de data (YYYY-MM-DD)
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(retirada) || !regexData.test(devolucao)) {
      Alert.alert(
        "Erro",
        "Por favor, use o formato correto para as datas: AAAA-MM-DD"
      );
      return;
    }

    try {
      const jsonValue = await AsyncStorage.getItem("livros");
      const livros: Livro[] = jsonValue ? JSON.parse(jsonValue) : [];

      const novoLivro: Livro = {
        id: Date.now().toString(),
        titulo,
        retirada,
        devolucao,
        devolvido: false,
      };

      const livrosAtualizados = [...livros, novoLivro];
      await AsyncStorage.setItem("livros", JSON.stringify(livrosAtualizados));

      Alert.alert("Sucesso", "Livro adicionado com sucesso!");
      setTitulo("");
      setRetirada("");
      setDevolucao("");
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

      <TextInput
        style={styles.input}
        placeholder="Data de Retirada (AAAA-MM-DD)"
        value={retirada}
        onChangeText={setRetirada}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Devolução (AAAA-MM-DD)"
        value={devolucao}
        onChangeText={setDevolucao}
      />

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
  subtitulo: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
