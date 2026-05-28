import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SobreScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>NumCalc</Text>
      <Text style={styles.versao}>Versão 1.0.0</Text>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Sobre o Aplicativo</Text>
        <Text style={styles.secaoTexto}>
          O NumCalc é um aplicativo desenvolvido para a disciplina de Computação Numérica do curso de 
          Ciência da Computação na Universidade Sagrado Coração (Unisagrado).
          Seu objetivo é reunir, em uma interface simples e
          intuitiva, os principais métodos numéricos estudados na disciplina, permitindo que
          o usuário realize cálculos matemáticos diretamente do seu dispositivo móvel.
        </Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Funcionalidades</Text>
        <Text style={styles.secaoTexto}>• Raízes de Funções: Bisseção, Ponto Fixo, Newton-Raphson e Secantes</Text>
        <Text style={styles.secaoTexto}>• Sistemas Lineares: Gauss, Fatoração LU, Jacobi e Gauss-Seidel</Text>
        <Text style={styles.secaoTexto}>• Ajuste de Curvas: Regressão Linear e Mínimos Quadrados</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Equipe</Text>
        <Text style={styles.secaoTexto}>Carlos Eduardo Rodrigues Silva</Text>
        <Text style={styles.secaoTexto}>Daniel Lucarelli Cerri</Text>
        <Text style={styles.secaoTexto}>Melck Silva de Oliveira Nascimento</Text>
        <Text style={styles.secaoTexto}>Murilo Moretto Marques</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Disciplina</Text>
        <Text style={styles.secaoTexto}>Computação Numérica</Text>
        <Text style={styles.secaoTexto}>Prof. Guilherme Biazzi Gonçalves</Text>
        <Text style={styles.secaoTexto}>Ciência da Computação - Unisagrado</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 30 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  versao: { fontSize: 13, color: '#aaa', marginBottom: 32 },
  secao: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20,
    marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 6, elevation: 3,
  },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
  secaoTexto: { fontSize: 14, color: '#555', marginBottom: 4, lineHeight: 22 },
});