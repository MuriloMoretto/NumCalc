import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

export default function CurvasScreen() {
  const [metodo, setMetodo] = useState('linear');
  const [pontosX, setPontosX] = useState('1, 2, 3, 4, 5');
  const [pontosY, setPontosY] = useState('2.1, 3.9, 6.2, 7.8, 10.1');
  const [grau, setGrau] = useState('2');
  const [resultado, setResultado] = useState('');

  const parsePontos = (str: string) =>
    str.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));

  const regressaoLinear = () => {
    const x = parsePontos(pontosX);
    const y = parsePontos(pontosY);
    if (x.length !== y.length || x.length < 2)
      return Alert.alert('Erro', 'Insira pares de pontos válidos.');
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, v, i) => a + v * y[i], 0);
    const sumX2 = x.reduce((a, v) => a + v * v, 0);
    const b1 = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b0 = (sumY - b1 * sumX) / n;
    const yMed = sumY / n;
    const ssTot = y.reduce((a, v) => a + (v - yMed) ** 2, 0);
    const ssRes = x.reduce((a, v, i) => a + (y[i] - (b0 + b1 * v)) ** 2, 0);
    const r2 = 1 - ssRes / ssTot;
    setResultado(
      `Regressão Linear:\ny = ${b0.toFixed(6)} + ${b1.toFixed(6)}x\n\n` +
      `Coeficientes:\n  a₀ (intercepto) = ${b0.toFixed(6)}\n  a₁ (inclinação) = ${b1.toFixed(6)}\n\n` +
      `R² = ${r2.toFixed(6)}\n\nPontos usados: ${n}`
    );
  };

  const minimosQuadrados = () => {
    const x = parsePontos(pontosX);
    const y = parsePontos(pontosY);
    const m = parseInt(grau);
    if (x.length !== y.length || x.length < m + 1)
      return Alert.alert('Erro', `Precisam de pelo menos ${m + 1} pontos para grau ${m}.`);
    const n = x.length;
    const ordem = m + 1;
    const A: number[][] = [];
    const b: number[] = [];
    for (let i = 0; i < ordem; i++) {
      A.push([]);
      for (let j = 0; j < ordem; j++)
        A[i].push(x.reduce((s, v) => s + v ** (i + j), 0));
      b.push(x.reduce((s, v, k) => s + v ** i * y[k], 0));
    }
    const Aug = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < ordem; col++) {
      let maxRow = col;
      for (let row = col + 1; row < ordem; row++)
        if (Math.abs(Aug[row][col]) > Math.abs(Aug[maxRow][col])) maxRow = row;
      [Aug[col], Aug[maxRow]] = [Aug[maxRow], Aug[col]];
      for (let row = col + 1; row < ordem; row++) {
        const fator = Aug[row][col] / Aug[col][col];
        for (let k = col; k <= ordem; k++) Aug[row][k] -= fator * Aug[col][k];
      }
    }
    const coef = Array(ordem).fill(0);
    for (let i = ordem - 1; i >= 0; i--) {
      coef[i] = Aug[i][ordem];
      for (let j = i + 1; j < ordem; j++) coef[i] -= Aug[i][j] * coef[j];
      coef[i] /= Aug[i][i];
    }
    const polinomio = coef.map((c, i) =>
      i === 0 ? c.toFixed(4) : `${c.toFixed(4)}x${i > 1 ? `^${i}` : ''}`
    ).join(' + ');
    const yMed = y.reduce((a, b) => a + b, 0) / n;
    const ssTot = y.reduce((a, v) => a + (v - yMed) ** 2, 0);
    const ssRes = x.reduce((a, v, i) => {
      const yhat = coef.reduce((s, c, p) => s + c * v ** p, 0);
      return a + (y[i] - yhat) ** 2;
    }, 0);
    const r2 = 1 - ssRes / ssTot;
    setResultado(
      `Mínimos Quadrados (grau ${m}):\ny = ${polinomio}\n\nCoeficientes:\n` +
      coef.map((c, i) => `  a${i} = ${c.toFixed(6)}`).join('\n') +
      `\n\nR² = ${r2.toFixed(6)}\nPontos usados: ${n}`
    );
  };

  const calcular = () => {
    setResultado('');
    if (!pontosX || !pontosY) return Alert.alert('Erro', 'Insira os pontos X e Y.');
    if (metodo === 'linear') regressaoLinear();
    else minimosQuadrados();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Ajuste de Curvas</Text>

      <Text style={styles.label}>Método</Text>
      <View style={styles.metodos}>
        {[{ id: 'linear', label: 'Regressão Linear' }, { id: 'minimos', label: 'Mínimos Quadrados' }].map(m => (
          <TouchableOpacity key={m.id} style={[styles.metodoBtn, metodo === m.id && styles.metodoBtnAtivo]}
            onPress={() => { setMetodo(m.id); setResultado(''); m.id === 'linear' ? (setPontosX('1, 2, 3, 4, 5'), setPontosY('2.1, 3.9, 6.2, 7.8, 10.1')) : (setPontosX('1, 2, 3, 4, 5'), setPontosY('1, 4, 9, 16, 25')); }}>
            <Text style={[styles.metodoBtnTexto, metodo === m.id && styles.metodoBtnTextoAtivo]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Valores de X (separados por vírgula)</Text>
      <TextInput style={styles.input} value={pontosX} onChangeText={setPontosX} keyboardType="default" />

      <Text style={styles.label}>Valores de Y (separados por vírgula)</Text>
      <TextInput style={styles.input} value={pontosY} onChangeText={setPontosY} keyboardType="default" />

      {metodo === 'minimos' && (<>
        <Text style={styles.label}>Grau do polinômio</Text>
        <View style={styles.row}>
          {['2', '3', '4'].map(g => (
            <TouchableOpacity key={g} style={[styles.metodoBtn, grau === g && styles.metodoBtnAtivo, { marginRight: 8 }]}
              onPress={() => setGrau(g)}>
              <Text style={[styles.metodoBtnTexto, grau === g && styles.metodoBtnTextoAtivo]}>Grau {g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>)}

      <TouchableOpacity style={styles.botao} onPress={calcular}>
        <Text style={styles.botaoTexto}>Calcular</Text>
      </TouchableOpacity>

      {resultado !== '' && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTexto}>{resultado}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 15, color: '#1a1a1a', borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row', marginBottom: 2 },
  metodos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  metodoBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  metodoBtnAtivo: { backgroundColor: '#BA7517', borderColor: '#BA7517' },
  metodoBtnTexto: { fontSize: 13, color: '#555' },
  metodoBtnTextoAtivo: { color: '#fff', fontWeight: '600' },
  botao: { backgroundColor: '#BA7517', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultado: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#ddd' },
  resultadoTexto: { fontFamily: 'monospace', fontSize: 13, color: '#1a1a1a', lineHeight: 20 },
});