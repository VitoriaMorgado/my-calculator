import React from "react";
import { View, Text, Button } from "react-native";
import { styles } from "./style";

export default function Card(props: {
  titulo: string;
  retirada: string;
  devolucao: string;
  onDevolver?: () => void;
  onDesmarcar?: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.image}></View>
      <Text style={styles.titulo}>{props.titulo}</Text>
      <Text style={styles.data}>Retirada: {props.retirada}</Text>
      <Text style={styles.data}>Devolução: {props.devolucao}</Text>

      <View style={{ marginTop: 10 }}>
        {props.onDevolver && (
          <Button title="Marcar como Devolvido" onPress={props.onDevolver} />
        )}

        {props.onDesmarcar && (
          <View style={{ marginTop: props.onDevolver ? 10 : 0 }}>
            <Button
              title="Desmarcar como Devolvido"
              onPress={props.onDesmarcar}
            />
          </View>
        )}
      </View>
    </View>
  );
}
