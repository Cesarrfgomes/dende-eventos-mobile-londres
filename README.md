# Dendê Eventos — App Mobile (React Native + Expo)

Aplicativo mobile que consome a **API REST Dendê Eventos** (módulo *londres*),
implementando o fluxo do **usuário comum**: descobrir eventos, comprar e cancelar
ingressos e gerenciar o perfil.

Desenvolvido a partir do [`HANDOFF_MOBILE.md`](./HANDOFF_MOBILE.md).

## Requisitos

- **Node ≥ 20** (Expo SDK 54). Se usar nvm: `nvm use 20`.
- Expo Go compatível com **SDK 54**.

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Subir a API (no projeto do backend)
#    docker compose up -d  &&  ./gradlew bootRun   -> http://localhost:3333

# 3. Apontar o app para a API: edite app.json -> expo.extra.apiBaseUrl
#    Emulador Android: http://10.0.2.2:3333
#    Simulador iOS:    http://localhost:3333
#    Dispositivo físico: http://<IP-da-sua-maquina>:3333

# 4. Iniciar o Expo
npm start          # depois pressione "a" (Android) ou "i" (iOS), ou leia o QR no Expo Go
```

## Como os requisitos obrigatórios foram atendidos

| Requisito | Onde |
|-----------|------|
| **1. Navegação estruturada** | Stack (auth) + Bottom Tabs + Stack aninhada no Feed — `src/navigation/` |
| **2. Mínimo de 5 telas** | Login, Cadastro, Feed, Detalhe do Evento, Meus Ingressos, Perfil (6) — `src/screens/` |
| **3. Gerenciamento de estado** | `useState`/`useEffect` em todas as telas + Context API (`AuthContext`) |
| **4. Consumo de API REST** | Axios com instância central e interceptors — `src/api/` |
| **5. Persistência local** | `AsyncStorage` guarda a sessão do usuário — `src/context/AuthContext.js` |
| **6. Formulários com validação** | Login, Cadastro e Edição de perfil — `src/utils/validation.js` |

## Estrutura

```
App.js                     # provider de auth + safe area + navegação
src/
  api/                     # client axios + um módulo por recurso
    client.js              # baseURL configurável + tratamento do ExceptioDTO
    eventos.js · ingressos.js · usuarios.js
  components/               # UI reutilizável (Button, Input, Cards, Badge, estados)
  context/AuthContext.js    # "sessão" + persistência em AsyncStorage
  navigation/               # RootNavigator (auth vs app) + AppTabs
  screens/                  # as 6 telas
  theme/                    # cores, espaçamentos, raios
  utils/                    # formatação de datas/moeda e validações
```

## Telas e funcionalidades

- **Login** — "login" por e-mail (a API ainda não tem token; ver seção 7 do handoff).
- **Cadastro** — formulário validado; ao concluir, entra direto no app.
- **Feed** — lista de eventos ativos (`GET /eventos`), pull-to-refresh, estados de
  carregamento/erro/vazio.
- **Detalhe do evento** — todos os dados, aviso de "ingresso casado" e compra
  (`POST /ingressos`), com tratamento de capacidade esgotada / evento inativo (409).
- **Meus Ingressos** — `SectionList` separando ativos de cancelados/finalizados;
  cancelamento com confirmação (`PATCH /ingressos/{id}/cancelar`).
- **Perfil** — ver/editar dados (`PUT`) e desativar conta (`DELETE` soft) + sair.

## Observações de arquitetura

- **Autenticação isolada** no `AuthContext`: quando o backend adicionar login com JWT
  (seção 7 do handoff), só este arquivo e a camada `api/` mudam — as telas não.
- **Datas**: a API usa `LocalDateTime` sem timezone; `parseLocalDateTime` trata como
  horário local para evitar deslocamento de UTC.
- **Erros**: o interceptor converte o `ExceptioDTO` (`{ status, mensagem }`) em
  mensagens amigáveis exibidas nas telas.

## Escopo

Implementado o **perfil usuário comum** (MVP recomendado no handoff). O perfil
*organizador* (criar/editar/ativar eventos) está fora deste escopo e pode ser
adicionado reaproveitando a mesma estrutura de `api/`, `navigation/` e `screens/`.
