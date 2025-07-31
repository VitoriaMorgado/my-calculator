import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "./components/card";

type Livro = {
  id: string;
  titulo: string;
  retirada: string;
  devolucao: string;
  devolvido?: boolean;
};

export default function Devolvidos() {
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    carregarLivrosDevolvidos();
  }, []);

  async function carregarLivrosDevolvidos() {
    try {
      const jsonValue = await AsyncStorage.getItem("livros");
      if (jsonValue != null) {
        const todosLivros: Livro[] = JSON.parse(jsonValue);
        const livrosDevolvidos = todosLivros.filter((livro) => livro.devolvido);
        setLivros(livrosDevolvidos);
      } else {
        setLivros([]);
      }
    } catch (e) {
      console.error("Erro ao carregar livros devolvidos", e);
    }
  }

  async function desmarcarComoDevolvido(id: string) {
    try {
      const jsonValue = await AsyncStorage.getItem("livros");
      if (jsonValue != null) {
        const todosLivros: Livro[] = JSON.parse(jsonValue);
        const livrosAtualizados = todosLivros.map((livro) =>
          livro.id === id ? { ...livro, devolvido: false } : livro
        );
        await AsyncStorage.setItem("livros", JSON.stringify(livrosAtualizados));

        // Atualiza o estado com os livros devolvidos restantes
        setLivros(livrosAtualizados.filter((livro) => livro.devolvido));
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar o livro.");
      console.error("Erro ao desmarcar como devolvido", e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Livros Devolvidos</Text>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            titulo={item.titulo}
            retirada={item.retirada}
            devolucao={item.devolucao}
            onDesmarcar={() => desmarcarComoDevolvido(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum livro devolvido.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});
