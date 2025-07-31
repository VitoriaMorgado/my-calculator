import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";

const fileUri = FileSystem.documentDirectory + "livros.json";

type Livro = {
  id: string;
  titulo: string;
  retirada: string;
  dataDevolucao: string;
};

export default function AdicionarLivro() {
  const [titulo, setTitulo] = useState("");
  const [retirada, setRetirada] = useState("");
  const [devolucao, setDevolucao] = useState("");
  const [livros, setLivros] = useState<Livro[]>([]);

  // Carrega os livros do arquivo ao iniciar
  useEffect(() => {
    const carregar = async () => {
      try {
        const file = await FileSystem.readAsStringAsync(fileUri);
        setLivros(JSON.parse(file));
      } catch {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
      }
    };
    carregar();
  }, []);

  const salvar = async (dados: Livro[]) => {
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(dados));
  };

  const adicionarLivro = async () => {
    if (!titulo || !retirada || !devolucao) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    const novo = {
      id: Date.now().toString(),
      titulo,
      retirada,
      dataDevolucao: devolucao,
    };

    const novaLista = [...livros, novo];
    setLivros(novaLista);
    await salvar(novaLista);

    // Limpa os campos
    setTitulo("");
    setRetirada("");
    setDevolucao("");
  };

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
