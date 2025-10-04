# 🛰️ Terra Health Monitor

**NASA Space Apps Challenge 2024**

Aplicação interativa que utiliza dados do satélite Terra da NASA para monitorar a saúde ambiental do planeta, com foco nas regiões brasileiras.

## 🎯 Conceito

O projeto apresenta o satélite Terra como um "médico espacial" que há 25 anos realiza o check-up mais importante da história: examinar a saúde do nosso planeta. Através de storytelling envolvente e visualizações interativas, mostramos como os 5 instrumentos do Terra diagnosticam problemas ambientais no Brasil.

## ✨ Funcionalidades

### 📖 Storytelling Interativo
- Narrativa envolvente: "Terra como médico do planeta"
- História dos 25 anos de missão
- Explicação didática dos instrumentos científicos

### 🌍 Globo 3D Interativo
- Visualização 3D da Terra usando `react-globe.gl`
- Pontos interativos nas regiões brasileiras monitoradas
- Indicadores visuais de saúde ambiental
- Rotação automática e controles de zoom

### 🔬 Instrumentos do Satélite Terra
- **MODIS**: Vegetação, temperatura e incêndios
- **ASTER**: Mudanças climáticas e aquecimento
- **CERES**: Radiação solar e balanço energético
- **MISR**: Aerossóis e qualidade do ar
- **MOPITT**: Monóxido de carbono e poluição

### 📍 Regiões Monitoradas
- **Amazônia**: Desmatamento e queimadas
- **Cerrado**: Expansão agrícola e perda de vegetação
- **Rio Grande do Sul**: Enchentes catastróficas (2024)
- **São Paulo**: Poluição atmosférica e ilhas de calor

### 🎮 Mini-Jogo de Reflorestamento
- Jogo interativo de plantio de árvores
- Metas específicas por região
- Cálculo de impacto ambiental real (CO₂, área restaurada)
- Sistema de pontuação e conquistas

### 🛰️ Integração NASA GIBS API
- Acesso a imagens de satélite em tempo real
- Comparação temporal de dados
- Múltiplas camadas de visualização

## 🏗️ Arquitetura

### Atomic Design
Seguimos o padrão **Atomic Design** para organização de componentes:

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Card, Badge)
│   ├── molecules/      # Combinações de atoms (InstrumentCard, RegionCard)
│   ├── organisms/      # Componentes complexos (TerraGlobe, TreePlantingGame)
│   └── templates/      # Layouts de página
├── pages/              # Páginas completas
├── hooks/              # Custom React hooks
├── services/           # Serviços de API
├── types/              # TypeScript types
├── config/             # Configurações
└── utils/              # Funções utilitárias
```

### Stack Tecnológica

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **TailwindCSS** - Utility-first CSS framework
- **react-globe.gl** - Visualização 3D da Terra
- **Leaflet** - Mapas 2D (alternativa)
- **Axios** - HTTP client
- **date-fns** - Manipulação de datas
- **clsx** - Utility para classes CSS

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd nasa

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build de produção
npm run lint       # Executa ESLint
npm run type-check # Verifica tipos TypeScript
```

## 📁 Estrutura de Arquivos

```
nasa/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Badge/
│   │   ├── molecules/
│   │   │   ├── InstrumentCard/
│   │   │   └── RegionCard/
│   │   └── organisms/
│   │       ├── TerraGlobe/
│   │       └── TreePlantingGame/
│   ├── pages/
│   │   └── HomePage/
│   ├── hooks/
│   │   ├── useNASAImagery.ts
│   │   └── useGameState.ts
│   ├── services/
│   │   └── nasaGIBS.service.ts
│   ├── types/
│   │   ├── nasa.types.ts
│   │   └── globe.types.ts
│   ├── config/
│   │   └── nasa.config.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

### TailwindCSS
O projeto utiliza **TailwindCSS** para estilização, seguindo utility-first approach:

#### Cores Customizadas
```js
// tailwind.config.js
colors: {
  'terra-blue': '#3b82f6',
  'terra-green': '#10b981',
  'terra-orange': '#f59e0b',
  'terra-red': '#ef4444',
  'terra-purple': '#8b5cf6',
  'terra-indigo': '#6366f1',
}
```

#### Animações Customizadas
- `animate-fade-in` - Fade in suave
- `animate-slide-up` - Slide up com fade
- `animate-pulse-slow` - Pulse lento (3s)
- `animate-spin-slow` - Rotação lenta (3s)

### Componentes Reutilizáveis
Todos os componentes seguem princípios de:
- ✅ Type safety com TypeScript
- ✅ Props bem documentadas
- ✅ Estilos com TailwindCSS (utility classes)
- ✅ Acessibilidade (ARIA labels)
- ✅ Responsividade mobile-first
- ✅ Variants system para flexibilidade

## 🔗 APIs Utilizadas

### NASA GIBS (Global Imagery Browse Services)
- **Base URL**: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best`
- **Documentação**: https://wiki.earthdata.nasa.gov/display/GIBS
- **Camadas utilizadas**:
  - MODIS Terra True Color
  - MODIS Terra Land Surface Temperature
  - MODIS Terra Aerosol Optical Depth
  - MODIS Terra NDVI

## 📊 Dados e Fontes

- **Satélite Terra**: Lançado em 18/12/1999
- **Órbita**: Polar, sincronizada com o Sol
- **Altitude**: ~705 km
- **Período**: 25 anos de operação contínua
- **Dados**: NASA Earth Observing System

## 🎯 Diferenciais do Projeto

1. **Storytelling Único**: Terra como "médico do planeta"
2. **Visualização 3D**: Globo interativo com react-globe.gl
3. **Gamificação**: Mini-jogo educativo de reflorestamento
4. **Impacto Real**: Cálculos de CO₂ e área restaurada
5. **Foco Brasil**: Regiões críticas brasileiras
6. **Atomic Design**: Arquitetura escalável e manutenível
7. **TypeScript**: Type safety completo
8. **TailwindCSS**: Estilização moderna e responsiva
9. **Dados Reais**: Integração com NASA GIBS API

## 🏆 NASA Space Apps Challenge 2024

Este projeto foi desenvolvido para o **NASA Space Apps Challenge 2024**, desafio global de 48 horas.

**Equipe**:
- Gabriel Freitas - Coordenador
- Pietro - Storytelling
- Guilherme Leite - Dados satélite Terra
- Lucas Gabriel - Arquitetura técnica
- Antonio - Revisão técnica
- Gustavo - Desenvolvimento e APIs

**Desafio**: Utilizar dados do satélite Terra para criar uma aplicação educativa sobre saúde ambiental.

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais no contexto do NASA Space Apps Challenge 2024.

## 🙏 Agradecimentos

- NASA por disponibilizar os dados do satélite Terra
- NASA GIBS pela API de imagens
- Comunidade open-source pelas bibliotecas utilizadas

---

**Desenvolvido com 💚 para o planeta Terra**

🛰️ **25 anos do Satélite Terra (1999-2024)**
