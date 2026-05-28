import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

export default function SistemasScreen() {
  const [metodo, setMetodo] = useState('gauss');
  const [tamanho, setTamanho] = useState('3');
  const exemplo3x3 = [
  ['10', '-1', '2', '6'],
  ['-1', '11', '-1', '25'],
  ['2', '-1', '10', '-11']
];
  const [matriz, setMatriz] = useState<string[][]>(exemplo3x3);
  const [tol, setTol] = useState('0.0001');
  const [resultado, setResultado] = useState('');

  const n = parseInt(tamanho) || 3;

  const ajustarMatriz = (novoN: string) => {
  const size = parseInt(novoN);

  let novaMatriz: string[][] = [];

  if (size === 2) {
    novaMatriz = [
      ['2', '1', '5'],
      ['1', '3', '6']
    ];
  }

  else if (size === 3) {
    novaMatriz = [
      ['10', '-1', '2', '6'],
      ['-1', '11', '-1', '25'],
      ['2', '-1', '10', '-11']
    ];
  }

  else if (size === 4) {
    novaMatriz = [
      ['10', '-1', '2', '0', '6'],
      ['-1', '11', '-1', '3', '25'],
      ['2', '-1', '10', '-1', '-11'],
      ['0', '3', '-1', '8', '15']
    ];
  }

  setMatriz(novaMatriz);
  setTamanho(novoN);
  setResultado('');
};

  const setCell = (i: number, j: number, val: string) => {
    const nova = matriz.map(row => [...row]);
    nova[i][j] = val;
    setMatriz(nova);
  };

  const getA = () => matriz.map(row => row.slice(0, n).map(Number));
  const getB = () => matriz.map(row => Number(row[n]));

  const gaussPivot = () => {
    const A = getA().map((row, i) => [...row, getB()[i]]);
    const size = n;
    for (let col = 0; col < size; col++) {
      let maxRow = col;
      for (let row = col + 1; row < size; row++)
        if (Math.abs(A[row][col]) > Math.abs(A[maxRow][col])) maxRow = row;
      [A[col], A[maxRow]] = [A[maxRow], A[col]];
      if (Math.abs(A[col][col]) < 1e-12) return Alert.alert('Erro', 'Sistema singular.');
      for (let row = col + 1; row < size; row++) {
        const fator = A[row][col] / A[col][col];
        for (let k = col; k <= size; k++) A[row][k] -= fator * A[col][k];
      }
    }
    const x = Array(size).fill(0);
    for (let i = size - 1; i >= 0; i--) {
      x[i] = A[i][size];
      for (let j = i + 1; j < size; j++) x[i] -= A[i][j] * x[j];
      x[i] /= A[i][i];
    }
    setResultado('Solução:\n' + x.map((v, i) => `x${i + 1} = ${v.toFixed(6)}`).join('\n'));
  };

  const fatoracaoLU = () => {
    const A = getA();
    const b = getB();
    const size = n;
    const L = Array(size).fill(null).map(() => Array(size).fill(0));
    const U = A.map(row => [...row]);
    for (let i = 0; i < size; i++) L[i][i] = 1;
    for (let col = 0; col < size; col++) {
      for (let row = col + 1; row < size; row++) {
        if (Math.abs(U[col][col]) < 1e-12) return Alert.alert('Erro', 'Pivô zero. Use Gauss.');
        L[row][col] = U[row][col] / U[col][col];
        for (let k = col; k < size; k++) U[row][k] -= L[row][col] * U[col][k];
      }
    }
    const y = Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      y[i] = b[i];
      for (let j = 0; j < i; j++) y[i] -= L[i][j] * y[j];
    }
    const x = Array(size).fill(0);
    for (let i = size - 1; i >= 0; i--) {
      x[i] = y[i];
      for (let j = i + 1; j < size; j++) x[i] -= U[i][j] * x[j];
      x[i] /= U[i][i];
    }
    setResultado('Solução (LU):\n' + x.map((v, i) => `x${i + 1} = ${v.toFixed(6)}`).join('\n'));
  };

  const jacobi = () => {
    const A = getA();
    const b = getB();
    const size = n;
    let x = Array(size).fill(0);
    const tol0 = parseFloat(tol);
    let iter = [];
    for (let it = 0; it < 100; it++) {
      const xn = Array(size).fill(0);
      for (let i = 0; i < size; i++) {
        if (Math.abs(A[i][i]) < 1e-12) return Alert.alert('Erro', 'Diagonal nula.');
        xn[i] = b[i];
        for (let j = 0; j < size; j++) if (j !== i) xn[i] -= A[i][j] * x[j];
        xn[i] /= A[i][i];
      }
      const erro = Math.max(...xn.map((v, i) => Math.abs(v - x[i])));
      iter.push(`It.${it + 1}: ${xn.map((v, i) => `x${i + 1}=${v.toFixed(4)}`).join(' | ')}`);
      if (erro < tol0) {
        setResultado('Solução (Jacobi):\n' + xn.map((v, i) => `x${i + 1} = ${v.toFixed(6)}`).join('\n') + '\n\n' + iter.join('\n'));
        return;
      }
      x = xn;
    }
    setResultado('Não convergiu.\n\n' + iter.join('\n'));
  };

  const gaussSeidel = () => {
    const A = getA();
    const b = getB();
    const size = n;
    let x = Array(size).fill(0);
    const tol0 = parseFloat(tol);
    let iter = [];
    for (let it = 0; it < 100; it++) {
      const xant = [...x];
      for (let i = 0; i < size; i++) {
        if (Math.abs(A[i][i]) < 1e-12) return Alert.alert('Erro', 'Diagonal nula.');
        x[i] = b[i];
        for (let j = 0; j < size; j++) if (j !== i) x[i] -= A[i][j] * x[j];
        x[i] /= A[i][i];
      }
      const erro = Math.max(...x.map((v, i) => Math.abs(v - xant[i])));
      iter.push(`It.${it + 1}: ${x.map((v, i) => `x${i + 1}=${v.toFixed(4)}`).join(' | ')}`);
      if (erro < tol0) {
        setResultado('Gauss-Seidel:\n' + x.map((v, i) => `x${i + 1} = ${v.toFixed(6)}`).join('\n') + '\n\n' + iter.join('\n'));
        return;
      }
    }
    setResultado('Não convergiu.\n\n' + iter.join('\n'));
  };

  const calcular = () => {
    setResultado('');
    if (metodo === 'gauss') gaussPivot();
    else if (metodo === 'lu') fatoracaoLU();
    else if (metodo === 'jacobi') jacobi();
    else gaussSeidel();
  };

  const metodos = [
    { id: 'gauss', label: 'Gauss' },
    { id: 'lu', label: 'Fatoração LU' },
    { id: 'jacobi', label: 'Jacobi' },
    { id: 'seidel', label: 'Gauss-Seidel' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Sistemas Lineares</Text>

      <Text style={styles.label}>Método</Text>
      <View style={styles.metodos}>
        {metodos.map(m => (
          <TouchableOpacity key={m.id} style={[styles.metodoBtn, metodo === m.id && styles.metodoBtnAtivo]}
            onPress={() => { setMetodo(m.id); setResultado(''); }}>
            <Text style={[styles.metodoBtnTexto, metodo === m.id && styles.metodoBtnTextoAtivo]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tamanho do sistema (n)</Text>
      <View style={styles.row}>
        {['2', '3', '4'].map(s => (
          <TouchableOpacity key={s} style={[styles.metodoBtn, tamanho === s && styles.metodoBtnAtivo, { marginRight: 8 }]}
            onPress={() => ajustarMatriz(s)}>
            <Text style={[styles.metodoBtnTexto, tamanho === s && styles.metodoBtnTextoAtivo]}>{s}x{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Matriz aumentada [A|b]</Text>
      {Array(n).fill(null).map((_, i) => (
        <View key={i} style={styles.row}>
          {Array(n + 1).fill(null).map((_, j) => (
            <TextInput key={j}
              style={[styles.input, { flex: 1, marginRight: j < n ? 4 : 0, backgroundColor: j === n ? '#fff9ee' : '#fff' }]}
              value={matriz[i]?.[j] ?? ''}
              onChangeText={val => setCell(i, j, val)}
              keyboardType="default"
              placeholderTextColor="#aaa"
            />
          ))}
        </View>
      ))}

      {(metodo === 'jacobi' || metodo === 'seidel') && (<>
        <Text style={styles.label}>Tolerância</Text>
        <TextInput style={styles.input} value={tol} onChangeText={setTol} keyboardType="default" placeholderTextColor="#aaa" />
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
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 14, color: '#1a1a1a', borderWidth: 1, borderColor: '#ddd', marginBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 2 },
  metodos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  metodoBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  metodoBtnAtivo: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
  metodoBtnTexto: { fontSize: 13, color: '#555' },
  metodoBtnTextoAtivo: { color: '#fff', fontWeight: '600' },
  botao: { backgroundColor: '#1D9E75', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultado: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#ddd' },
  resultadoTexto: { fontFamily: 'monospace', fontSize: 13, color: '#1a1a1a', lineHeight: 20 },
});