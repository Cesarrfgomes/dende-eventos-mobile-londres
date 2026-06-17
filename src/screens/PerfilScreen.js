import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Badge from '../components/Badge';
import Button from '../components/Button';
import DateField from '../components/DateField';
import Input from '../components/Input';
import SexoPicker, { labelSexo } from '../components/SexoPicker';
import { atualizarUsuario, desativarUsuario } from '../api/usuarios';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { formatData, humanizeEnum } from '../utils/format';
import {
  runValidators,
  validateDataNascimento,
  validateNome,
  validateSexo,
} from '../utils/validation';

export default function PerfilScreen() {
  const { usuario, logout, atualizarSessao } = useAuth();

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: usuario.nome,
    dataNascimento: usuario.dataNascimento,
    sexo: usuario.sexo,
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function cancelarEdicao() {
    setForm({
      nome: usuario.nome,
      dataNascimento: usuario.dataNascimento,
      sexo: usuario.sexo,
    });
    setErros({});
    setEditando(false);
  }

  async function salvar() {
    const { erros: e, valido } = runValidators({
      nome: () => validateNome(form.nome),
      dataNascimento: () => validateDataNascimento(form.dataNascimento),
      sexo: () => validateSexo(form.sexo),
    });
    setErros(e);
    if (!valido) return;

    try {
      setSalvando(true);
      const atualizado = await atualizarUsuario(usuario.id, {
        nome: form.nome.trim(),
        dataNascimento: form.dataNascimento.trim(),
        sexo: form.sexo,
      });
      await atualizarSessao(atualizado);
      setEditando(false);
      Alert.alert('Pronto!', 'Seus dados foram atualizados.');
    } catch (err) {
      Alert.alert('Erro ao salvar', err.message);
    } finally {
      setSalvando(false);
    }
  }

  function confirmarDesativar() {
    Alert.alert(
      'Desativar conta',
      'Sua conta será desativada (você pode reativá-la depois pelo backend). Deseja continuar?',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: async () => {
            try {
              await desativarUsuario(usuario.id);
              await logout();
            } catch (err) {
              Alert.alert('Erro', err.message);
            }
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {usuario.nome?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.nome}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <Badge
          texto={usuario.isAtivo ? 'Conta ativa' : 'Conta inativa'}
          tone={usuario.isAtivo ? 'success' : 'danger'}
        />

        {!editando ? (
          <View style={styles.card}>
            <Linha rotulo="Data de nascimento" valor={formatData(usuario.dataNascimento)} />
            <Linha rotulo="Idade" valor={`${usuario.idade} anos`} />
            <Linha rotulo="Sexo" valor={labelSexo(usuario.sexo)} />
            <Linha rotulo="Tipo" valor={humanizeEnum(usuario.tipoUsuario)} />
          </View>
        ) : (
          <View style={styles.card}>
            <Input
              label="Nome completo"
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
          </View>
        )}

        {!editando ? (
          <>
            <Button title="Editar perfil" onPress={() => setEditando(true)} style={styles.btn} />
            <Button
              title="Desativar conta"
              variant="danger"
              onPress={confirmarDesativar}
              style={styles.btn}
            />
            <Button title="Sair" variant="outline" onPress={logout} style={styles.btn} />
          </>
        ) : (
          <>
            <Button title="Salvar alterações" onPress={salvar} loading={salvando} style={styles.btn} />
            <Button
              title="Cancelar"
              variant="outline"
              onPress={cancelarEdicao}
              style={styles.btn}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Linha({ rotulo, valor }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, alignItems: 'center' },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  avatarTexto: { fontSize: 36, fontWeight: '800', color: colors.white },
  nome: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  email: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.sm },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rotulo: { fontSize: 14, color: colors.textMuted },
  valor: { fontSize: 14, color: colors.text, fontWeight: '600' },
  btn: { width: '100%', marginTop: spacing.md },
});
