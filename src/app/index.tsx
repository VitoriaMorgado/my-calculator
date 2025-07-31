import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
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

const fileUri = FileSystem.documentDirectory + "livros.json";

export default function Index() {
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        const conteudo = await FileSystem.readAsStringAsync(fileUri);
        const dados: Livro[] = JSON.parse(conteudo);
        setLivros(dados);
      } catch {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
        setLivros([]);
      }
    };
    carregarLivros();
  }, []);

  const marcarComoDevolvido = async (id: string) => {
    const atualizados = livros.map((livro) =>
      livro.id === id ? { ...livro, devolvido: true } : livro
    );
    setLivros(atualizados);
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(atualizados));
  };

  const livrosNaoDevolvidos = livros.filter((livro) => !livro.devolvido);

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
