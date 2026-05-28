import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Bem-Vindo ao NumCalc!</Text>
      <Text style={styles.titulo}>Métodos Numéricos</Text>
      <Text style={styles.subtitulo}>Selecione um módulo:</Text>

      <TouchableOpacity style={[styles.card, { borderLeftColor: '#378ADD' }]} onPress={() => router.push('/raizes')}>
        <Text style={styles.cardTitulo}>Raízes de Funções</Text>
        <Text style={styles.cardDesc}>Bisseção · Ponto Fixo · Newton-Raphson · Secantes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { borderLeftColor: '#1D9E75' }]} onPress={() => router.push('/sistemas')}>
        <Text style={styles.cardTitulo}>Sistemas Lineares</Text>
        <Text style={styles.cardDesc}>Gauss · Fatoração LU · Jacobi · Gauss-Seidel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { borderLeftColor: '#BA7517' }]} onPress={() => router.push('/curvas')}>
        <Text style={styles.cardTitulo}>Ajuste de Curvas</Text>
        <Text style={styles.cardDesc}>Regressão Linear · Mínimos Quadrados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { borderLeftColor: '#888' }]} onPress={() => router.push('/sobre')}>
        <Text style={styles.cardTitulo}>Sobre</Text>
        <Text style={styles.cardDesc}>Informações sobre o aplicativo e a equipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 60 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  subtitulo: { fontSize: 15, color: '#666', marginBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20,
    marginBottom: 16, borderLeftWidth: 5,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardTitulo: { fontSize: 17, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#888' },
});