# Dendê Eventos — App Mobile

Aplicativo mobile desenvolvido em **React Native + Expo** que consome a
**API REST Dendê Eventos**, permitindo descobrir eventos, comprar e cancelar
ingressos e gerenciar o perfil do usuário.

---

## Integrantes

| Nome | RA / Matrícula |
|------|----------------|
| Cesar Filipe Gomes | _preencher_ |
| _preencher_ | _preencher_ |
| _preencher_ | _preencher_ |

> Substitua os campos `_preencher_` com os nomes e matrículas do grupo.

---

## Problema resolvido

A compra e o acompanhamento de ingressos para eventos costumam ser processos
fragmentados: o usuário precisa procurar informações em vários canais, não tem
uma visão clara dos eventos disponíveis e tem dificuldade para gerenciar os
ingressos que já adquiriu.

O **Dendê Eventos** centraliza toda essa jornada em um único aplicativo mobile:

- Lista os eventos ativos de forma organizada e atualizada;
- Permite **comprar ingressos** em poucos toques, com tratamento de eventos
  esgotados ou inativos;
- Reúne em um só lugar os ingressos **ativos e cancelados**, com cancelamento
  simplificado;
- Dá ao usuário controle total sobre seu **cadastro e perfil**.

---

## Público-alvo

**Participantes de eventos** — pessoas que querem descobrir, comprar e gerenciar
ingressos de forma rápida pelo celular, sem depender de bilheterias físicas ou
de múltiplos sites.

O escopo atual implementa o **perfil de usuário comum**. A arquitetura foi
pensada para, futuramente, atender também o **perfil organizador** (criação e
gestão de eventos), reaproveitando a mesma base de código.

---

## Tecnologias utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Linguagem | JavaScript (React 19) |
| Navegação | React Navigation (Native Stack + Bottom Tabs) |
| Gerenciamento de estado | Context API + Hooks (`useState` / `useEffect`) |
| Consumo de API | Axios (instância central + interceptors) |
| Persistência local | AsyncStorage |
| Formulários | Validação própria (`src/utils/validation.js`) |

---

## Estrutura do projeto

```
App.js                       # provider de auth + safe area + navegação
app.json                     # configuração do Expo (inclui apiBaseUrl)
index.js                     # ponto de entrada
src/
  api/                       # client axios + um módulo por recurso
    client.js                # baseURL configurável + tratamento do ExceptioDTO
    eventos.js
    ingressos.js
    usuarios.js
  components/                # UI reutilizável (Button, Input, Cards, Badge, etc.)
  context/
    AuthContext.js           # sessão do usuário + persistência em AsyncStorage
  navigation/
    RootNavigator.js         # decide entre fluxo de auth e app logado
    AppTabs.js               # abas inferiores do app
  screens/                   # as 6 telas
    LoginScreen.js
    CadastroScreen.js
    FeedScreen.js
    EventoDetalheScreen.js
    MeusIngressosScreen.js
    PerfilScreen.js
  theme/                     # cores, espaçamentos e raios
  utils/                     # formatação de datas/moeda e validações
```

---

## Como executar

### Pré-requisitos

- **Node.js ≥ 20** (Expo SDK 54). Com nvm: `nvm use 20`.
- App **Expo Go** (compatível com SDK 54) no celular, ou um emulador
  Android / simulador iOS.

### Passos

```bash
# 1. Instalar as dependências
npm install

# 2. Subir a API (no projeto do backend)
#    docker compose up -d  &&  ./gradlew bootRun   ->  http://localhost:3333

# 3. Apontar o app para a API: edite app.json -> expo.extra.apiBaseUrl
#    Emulador Android:   http://10.0.2.2:3333
#    Simulador iOS:      http://localhost:3333
#    Dispositivo físico: http://<IP-da-sua-maquina>:3333

# 4. Iniciar o Expo
npm start
```

Depois de iniciar, pressione:

- **`a`** para abrir no Android;
- **`i`** para abrir no iOS;
- ou leia o **QR Code** com o app **Expo Go** no celular.

---

## Telas e funcionalidades

- **Login** — entrada por e-mail (a API ainda não tem token; ver handoff).
- **Cadastro** — formulário validado; ao concluir, entra direto no app.
- **Feed** — lista de eventos ativos (`GET /eventos`), com *pull-to-refresh* e
  estados de carregamento/erro/vazio.
- **Detalhe do evento** — todos os dados, aviso de "ingresso casado" e compra
  (`POST /ingressos`), tratando capacidade esgotada / evento inativo (409).
- **Meus Ingressos** — `SectionList` separando ativos de cancelados/finalizados;
  cancelamento com confirmação (`PATCH /ingressos/{id}/cancelar`).
- **Perfil** — ver/editar dados (`PUT`) e desativar conta (`DELETE` soft) + sair.
