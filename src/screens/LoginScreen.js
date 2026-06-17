import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';
import { runValidators, validateEmail, validateSenha } from '../utils/validation';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function onEntrar() {
    setErroApi(null);
    const { erros: e, valido } = runValidators({
      email: () => validateEmail(email),
      senha: () => validateSenha(senha),
    });
    setErros(e);
    if (!valido) return;

    try {
      setEnviando(true);
      await login(email);
    } catch (err) {
      setErroApi(
        err.status === 404
          ? 'Não encontramos uma conta com esse e-mail.'
          : err.message
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Text style={styles.logo}>🎟️</Text>
          <Text style={styles.title}>Dendê Eventos</Text>
          <Text style={styles.subtitle}>Entre para descobrir e comprar ingressos</Text>
        </View>

        <Input
          label="E-mail"
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={erros.email}
        />
        <Input
          label="Senha"
          placeholder="••••••"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          error={erros.senha}
        />

        {erroApi ? <Text style={styles.erroApi}>{erroApi}</Text> : null}

        <Button title="Entrar" onPress={onEntrar} loading={enviando} style={styles.btn} />
        <Button
          title="Criar uma conta"
          variant="outline"
          onPress={() => navigation.navigate('Cadastro')}
          style={styles.btnSecundario}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl * 2, flexGrow: 1 },
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 56, marginBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '800', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  erroApi: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
  btn: { marginTop: spacing.sm },
  btnSecundario: { marginTop: spacing.md },
});
