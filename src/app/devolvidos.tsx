import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import Card from "./components/card";

type Livro = {
  id: string;
  titulo: string;
  retirada: string;
  devolucao: string;
  devolvido?: boolean;
};

const fileUri = FileSystem.documentDirectory + "livros.json";

export default function Devolvidos() {
  const [livros, setLivros] = useState<Livro[]>([]);

  const carregar = async () => {
    try {
      const conteudo = await FileSystem.readAsStringAsync(fileUri);
      const dados: Livro[] = JSON.parse(conteudo);
      const filtrados = dados.filter((livro) => livro.devolvido);
      setLivros(filtrados);
    } catch {
      setLivros([]);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const desmarcarComoDevolvido = async (id: string) => {
    const conteudo = await FileSystem.readAsStringAsync(fileUri);
    const todosLivros: Livro[] = JSON.parse(conteudo);

    const atualizados = todosLivros.map((livro) =>
      livro.id === id ? { ...livro, devolvido: false } : livro
    );

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(atualizados));
    const filtrados = atualizados.filter((livro) => livro.devolvido);
    setLivros(filtrados);
  };

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
