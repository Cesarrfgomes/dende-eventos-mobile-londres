import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { buscarUsuarioPorEmail, buscarUsuarioPorId } from '../api/usuarios';

const STORAGE_KEY = '@dende:usuario';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const salvo = JSON.parse(json);
          try {
            const atual = await buscarUsuarioPorId(salvo.id);
            await persistir(atual);
          } catch {
            setUsuario(salvo);
          }
        }
      } catch {
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function persistir(u) {
    setUsuario(u);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }

  async function login(email) {
    const u = await buscarUsuarioPorEmail(email.trim());
    if (!u.isAtivo) {
      throw new Error('Conta desativada. Reative-a pelo backend para entrar.');
    }
    await persistir(u);
    return u;
  }

  async function logout() {
    setUsuario(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async function atualizarSessao(u) {
    await persistir(u);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, login, logout, atualizarSessao }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
