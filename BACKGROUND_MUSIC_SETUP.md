# Background Music - Setup Guide

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── audios/
│       └── music.mp3                # ✅ Trilha sonora principal
└── components/
    └── molecules/
        └── BackgroundMusic/
            ├── BackgroundMusic.tsx  # Componente simplificado (sem controles)
            └── index.ts             # Export

App.tsx                              # ✅ Música configurada globalmente
```

## ✅ Configuração Atual

**Arquivo de música:** `src/assets/audios/music.mp3`

**Comportamento:**
- 🎵 Toca **automaticamente** ao iniciar o projeto
- 🔄 **Loop infinito** - recomeça quando termina
- 🔇 **Sem controles visuais** - reprodução contínua
- 📊 Volume padrão: **30%** (ajustável no código)
- 🎯 **5 tentativas** de autoplay (0-1000ms)
- 👆 **Auto-recovery** - Inicia na primeira interação se bloqueado

## 🎵 Arquivo de Música Atual

**Localização:** `src/assets/audios/music.mp3`

A música está configurada no `App.tsx` e toca globalmente em todas as rotas:
- HomePage (/)
- SatellitePage (/satellite)
- FireGlobePage (/fire-globe)
- FloodGlobePage (/flood-globe)

### Como Trocar a Música

Para usar um arquivo diferente, edite o `App.tsx`:

```tsx
// Trocar o import
import musicFile from './assets/audios/SUA-MUSICA.mp3';

// Ou usar URL direta
<BackgroundMusic audioSrc="/caminho/para/musica.mp3" />
```

**Recomendações para o arquivo de música:**
- ✅ Formato: MP3 ou OGG
- ✅ Duração: 2-5 minutos (irá repetir automaticamente)
- ✅ Bitrate: 128-192 kbps (equilíbrio qualidade/tamanho)
- ✅ Volume: Pré-normalizado para evitar clipping

## ⚙️ Funcionalidades

O componente `BackgroundMusic` é **robusto e invisível**:

✅ **Reprodução Ultra-Agressiva** - 5 tentativas automáticas (0-1000ms)
✅ **Auto-Recovery** - Detecta interação do usuário e inicia automaticamente
✅ **Loop Infinito** - Música repete sem parar
✅ **Sem Interface Visual** - Nenhum controle na tela
✅ **Volume Configurável** - 30% por padrão
✅ **Carregamento Imediato** - Sem lazy loading (inicia mais rápido)
✅ **Listeners Inteligentes** - Detecta clique, tecla e toque
✅ **Cleanup Automático** - Remove listeners após sucesso

## 🎛️ Personalização

### Configuração no App.tsx

**Atual:**
```tsx
import musicFile from './assets/audios/music.mp3';

<BackgroundMusic audioSrc={musicFile} />
```

**Ajustar volume (0 a 1):**
```tsx
// Volume 50%
<BackgroundMusic audioSrc={musicFile} initialVolume={0.5} />

// Volume 100%
<BackgroundMusic audioSrc={musicFile} initialVolume={1.0} />

// Volume 10%
<BackgroundMusic audioSrc={musicFile} initialVolume={0.1} />
```

**Usar outra música:**
```tsx
import outraMusica from './assets/audios/outra-musica.mp3';
<BackgroundMusic audioSrc={outraMusica} />
```

**Desabilitar música:**
```tsx
// Comente ou remova estas linhas no App.tsx:
// <Suspense fallback={null}>
//   <BackgroundMusic audioSrc={musicFile} />
// </Suspense>
```

## 🔧 Troubleshooting

### Música não toca automaticamente
**Causa:** Navegadores modernos (Chrome, Firefox, Safari) bloqueiam autoplay de áudio até que o usuário **interaja** com a página.

**Solução Implementada:** 
- ✅ **5 tentativas automáticas** (0ms, 50ms, 200ms, 500ms, 1000ms)
- ✅ **Listeners de interação** - Detecta clique, tecla ou toque
- ✅ **Carregamento imediato** - Removido lazy loading
- ✅ **Auto-recovery** - Se bloqueado, toca assim que o usuário interagir

**O que acontece:**
1. Página carrega → Tenta tocar automaticamente (5 tentativas)
2. Se bloqueado → Fica aguardando interação do usuário
3. Usuário clica/toca/pressiona tecla → Música inicia automaticamente
4. Listeners são removidos após sucesso

### Música não está fazendo loop
**Verificar:** O atributo `loop` está configurado no componente automaticamente.

### Erro ao carregar música
**Verificar:**
- O arquivo `src/assets/audios/music.mp3` existe
- O import no `App.tsx` está correto
- Abra o console do navegador para ver mensagens de erro

### Ajustar volume
**Edite no App.tsx:**
```tsx
<BackgroundMusic audioSrc={musicFile} initialVolume={0.5} />
```
Valores: 0.0 (silêncio) a 1.0 (máximo)

## 📝 Licenciamento

**IMPORTANTE:** Certifique-se de ter os direitos/licença para usar qualquer música que adicionar ao projeto.

Para projetos open-source, prefira:
- Música sob licença Creative Commons
- Música de domínio público
- Música com permissão explícita de uso

## 💡 Implementação Técnica

O componente usa:
- **React hooks:** `useRef` para elemento de áudio, `useState` para status
- **useEffect:** Inicialização e setup de listeners
- **Estratégia ultra-agressiva:** 5 tentativas (0ms, 50ms, 200ms, 500ms, 1000ms)
- **Event Listeners:** `click`, `keydown`, `touchstart` no document
- **Auto-cleanup:** Remove listeners após sucesso
- **Loop nativo:** HTML5 audio com `loop={true}`
- **playAttemptedRef:** Previne múltiplas tentativas simultâneas
- **Elemento HTML:** `<audio>` invisível sem controles

**Fluxo de execução:**
1. Componente monta → Configura áudio (volume, loop)
2. Tenta tocar imediatamente
3. Se falhar → Tenta 4x com delays crescentes
4. Adiciona listeners de interação no document
5. Primeira interação → Toca automaticamente
6. Sucesso → Remove todos os listeners
7. Cleanup → Pausa e reseta áudio
