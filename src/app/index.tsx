import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "./components/card";
import { router } from "expo-router";
import NavBar from "./components/navbar";

type Livro = {
  id: string;
  titulo: string;
  retirada: string;
  devolucao: string;
  devolvido?: boolean;
};

export default function Index() {
  const [livrosNaoDevolvidos, setLivrosNaoDevolvidos] = useState<Livro[]>([]);

  useEffect(() => {
    carregarLivros();
  }, []);

  async function carregarLivros() {
    try {
      const jsonValue = await AsyncStorage.getItem("livros");
      if (jsonValue != null) {
        const livros: Livro[] = JSON.parse(jsonValue);
        // Filtra só os não devolvidos
        const naoDevolvidos = livros.filter((livro) => !livro.devolvido);
        setLivrosNaoDevolvidos(naoDevolvidos);
      } else {
        setLivrosNaoDevolvidos([]); // Nenhum livro salvo
      }
    } catch (e) {
      console.error("Erro ao carregar livros", e);
    }
  }

  async function marcarComoDevolvido(id: string) {
    try {
      const jsonValue = await AsyncStorage.getItem("livros");
      if (jsonValue != null) {
        const livros: Livro[] = JSON.parse(jsonValue);
        const novosLivros = livros.map((livro) =>
          livro.id === id ? { ...livro, devolvido: true } : livro
        );
        // Salva os livros atualizados
        await AsyncStorage.setItem("livros", JSON.stringify(novosLivros));

        // Atualiza o estado local só com os não devolvidos
        setLivrosNaoDevolvidos(novosLivros.filter((livro) => !livro.devolvido));
      }
    } catch (e) {
      console.error("Erro ao marcar como devolvido", e);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <NavBar />
      <Text style={styles.header}>Livros Retirados</Text>

      <Button
        title="Ver Devolvidos"
        onPress={() => router.push("/devolvidos")}
      />

      <FlatList
        data={livrosNaoDevolvidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Card
              titulo={item.titulo}
              retirada={item.retirada}
              devolucao={item.devolucao}
              onDevolver={() => marcarComoDevolvido(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum livro retirado no momento.
          </Text>
        }
      />
    </ScrollView>
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
  card: {
    marginBottom: 16,
  },
});
