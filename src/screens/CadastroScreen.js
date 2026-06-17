import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import Button from '../components/Button';
import DateField from '../components/DateField';
import Input from '../components/Input';
import SexoPicker from '../components/SexoPicker';
import { cadastrarUsuario } from '../api/usuarios';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';
import {
  runValidators,
  validateDataNascimento,
  validateEmail,
  validateNome,
  validateSenha,
  validateSexo,
} from '../utils/validation';

export default function CadastroScreen({ navigation }) {
  const { login } = useAuth();

  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    senha: '',
  });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function onCadastrar() {
    setErroApi(null);
    const { erros: e, valido } = runValidators({
      nome: () => validateNome(form.nome),
      dataNascimento: () => validateDataNascimento(form.dataNascimento),
      sexo: () => validateSexo(form.sexo),
      email: () => validateEmail(form.email),
      senha: () => validateSenha(form.senha),
    });
    setErros(e);
    if (!valido) return;

    try {
      setEnviando(true);
      await cadastrarUsuario({
        nome: form.nome.trim(),
        dataNascimento: form.dataNascimento.trim(),
        sexo: form.sexo,
        email: form.email.trim(),
        senha: form.senha,
      });
      await login(form.email);
    } catch (err) {
      if (err.status === 409) {
        setErroApi('Já existe uma conta com esse e-mail.');
      } else {
        setErroApi(err.message);
      }
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

        <Input
          label="Nome completo"
          placeholder="Seu nome"
          value={form.nome}
          onChangeText={(v) => set('nome', v)}
          error={erros.nome}
        />
        <DateField
          label="Data de nascimento"
          value={form.dataNascimento}
          onChange={(v) => set('dataNascimento', v)}
          error={erros.dataNascimento}
        />
        <SexoPicker
          value={form.sexo}
          onChange={(v) => set('sexo', v)}
          error={erros.sexo}
        />
        <Input
          label="E-mail"
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => set('email', v)}
          error={erros.email}
        />
        <Input
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          value={form.senha}
          onChangeText={(v) => set('senha', v)}
          error={erros.senha}
        />

        {erroApi ? <Text style={styles.erroApi}>{erroApi}</Text> : null}

        <Button title="Cadastrar" onPress={onCadastrar} loading={enviando} style={styles.btn} />
        <Button
          title="Já tenho conta"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.btnSecundario}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg },
  erroApi: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
  btn: { marginTop: spacing.sm },
  btnSecundario: { marginTop: spacing.md },
});
