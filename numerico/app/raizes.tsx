import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as math from 'mathjs';

export default function RaizesScreen() {
  const router = useRouter();
  const [metodo, setMetodo] = useState('bissecao');
  const [funcao, setFuncao] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [x0, setX0] = useState('');
  const [x1, setX1] = useState('');
  const [tol, setTol] = useState('0.0001');
  const [resultado, setResultado] = useState('');

  const f = (x: number) => {
    try { return math.evaluate(funcao, { x }); }
    catch { return NaN; }
  };

  const bissecao = () => {
    let a0 = parseFloat(a), b0 = parseFloat(b), tol0 = parseFloat(tol);
    if (f(a0) * f(b0) >= 0) return Alert.alert('Erro', 'f(a) e f(b) devem ter sinais opostos.');
    let iter = [], mid = 0;
    for (let i = 0; i < 100; i++) {
      mid = (a0 + b0) / 2;
      iter.push(`It.${i + 1}: x = ${mid.toFixed(6)}, f(x) = ${f(mid).toFixed(6)}`);
      if (Math.abs(f(mid)) < tol0 || (b0 - a0) / 2 < tol0) break;
      f(a0) * f(mid) < 0 ? b0 = mid : a0 = mid;
    }
    setResultado(`Raiz ≈ ${mid.toFixed(6)}\n\n${iter.join('\n')}`);
  };

  const pontoFixo = () => {
    let x = parseFloat(x0), tol0 = parseFloat(tol);
    let iter = [];
    for (let i = 0; i < 100; i++) {
      let xn = f(x);
      iter.push(`It.${i + 1}: x = ${xn.toFixed(6)}`);
      if (Math.abs(xn - x) < tol0) { setResultado(`Raiz ≈ ${xn.toFixed(6)}\n\n${iter.join('\n')}`); return; }
      x = xn;
    }
    setResultado(`Não convergiu após 100 iterações.\n\n${iter.join('\n')}`);
  };

  const newtonRaphson = () => {
    let x = parseFloat(x0), tol0 = parseFloat(tol);
    const h = 1e-7;
    let iter = [];
    for (let i = 0; i < 100; i++) {
      const fx = f(x);
      const dfx = (f(x + h) - f(x - h)) / (2 * h);
      if (Math.abs(dfx) < 1e-12) { Alert.alert('Erro', 'Derivada zero ou muito pequena.'); return; }
      const xn = x - fx / dfx;
      iter.push(`It.${i + 1}: x = ${xn.toFixed(6)}, f(x) = ${f(xn).toFixed(6)}`);
      if (Math.abs(xn - x) < tol0) { setResultado(`Raiz ≈ ${xn.toFixed(6)}\n\n${iter.join('\n')}`); return; }
      x = xn;
    }
    setResultado(`Não convergiu.\n\n${iter.join('\n')}`);
  };

  const secantes = () => {
    let x0n = parseFloat(x0), x1n = parseFloat(x1), tol0 = parseFloat(tol);
    let iter = [];
    for (let i = 0; i < 100; i++) {
      const fx0 = f(x0n), fx1 = f(x1n);
      if (Math.abs(fx1 - fx0) < 1e-12) { Alert.alert('Erro', 'Divisão por zero.'); return; }
      const xn = x1n - fx1 * (x1n - x0n) / (fx1 - fx0);
      iter.push(`It.${i + 1}: x = ${xn.toFixed(6)}, f(x) = ${f(xn).toFixed(6)}`);
      if (Math.abs(xn - x1n) < tol0) { setResultado(`Raiz ≈ ${xn.toFixed(6)}\n\n${iter.join('\n')}`); return; }
      x0n = x1n; x1n = xn;
    }
    setResultado(`Não convergiu.\n\n${iter.join('\n')}`);
  };

  const calcular = () => {
    if (!funcao) return Alert.alert('Erro', 'Digite a função.');
    setResultado('');
    if (metodo === 'bissecao') bissecao();
    else if (metodo === 'pontofixo') pontoFixo();
    else if (metodo === 'newton') newtonRaphson();
    else secantes();
  };

  const metodos = [
    { id: 'bissecao', label: 'Bisseção' },
    { id: 'pontofixo', label: 'Ponto Fixo' },
    { id: 'newton', label: 'Newton-Raphson' },
    { id: 'secantes', label: 'Secantes' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>Raízes de Funções</Text>

      <Text style={styles.label}>Método</Text>
      <View style={styles.metodos}>
        {metodos.map(m => (
          <TouchableOpacity key={m.id} style={[styles.metodoBtn, metodo === m.id && styles.metodoBtnAtivo]}
            onPress={() => { setMetodo(m.id); setResultado(''); }}>
            <Text style={[styles.metodoBtnTexto, metodo === m.id && styles.metodoBtnTextoAtivo]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Função f(x)</Text>
      <TextInput style={styles.input} value={funcao} onChangeText={setFuncao} placeholder="Ex: x^3 - x - 2" placeholderTextColor="#aaa" />

      {(metodo === 'bissecao') && (<>
        <Text style={styles.label}>Intervalo [a, b]</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} value={a} onChangeText={setA} placeholder="a" placeholderTextColor="#aaa" keyboardType="numeric" />
          <TextInput style={[styles.input, { flex: 1 }]} value={b} onChangeText={setB} placeholder="b" placeholderTextColor="#aaa" keyboardType="numeric" />
        </View>
      </>)}

      {(metodo === 'pontofixo' || metodo === 'newton') && (<>
        <Text style={styles.label}>Chute inicial x₀</Text>
        <TextInput style={styles.input} value={x0} onChangeText={setX0} placeholder="x0" placeholderTextColor="#aaa" keyboardType="numeric" />
      </>)}

      {metodo === 'secantes' && (<>
        <Text style={styles.label}>Dois chutes iniciais</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} value={x0} onChangeText={setX0} placeholder="x0" placeholderTextColor="#aaa" keyboardType="numeric" />
          <TextInput style={[styles.input, { flex: 1 }]} value={x1} onChangeText={setX1} placeholder="x1" placeholderTextColor="#aaa" keyboardType="numeric" />
        </View>
      </>)}

      <Text style={styles.label}>Tolerância</Text>
      <TextInput style={styles.input} value={tol} onChangeText={setTol} keyboardType="numeric" placeholderTextColor="#aaa" />

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
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 12 },
  voltarTexto: { color: '#378ADD', fontSize: 15 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 15, color: '#1a1a1a', borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row' },
  metodos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  metodoBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  metodoBtnAtivo: { backgroundColor: '#378ADD', borderColor: '#378ADD' },
  metodoBtnTexto: { fontSize: 13, color: '#555' },
  metodoBtnTextoAtivo: { color: '#fff', fontWeight: '600' },
  botao: { backgroundColor: '#378ADD', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultado: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#ddd' },
  resultadoTexto: { fontFamily: 'monospace', fontSize: 13, color: '#1a1a1a', lineHeight: 20 },
});