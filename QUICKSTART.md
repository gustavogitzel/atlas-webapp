# 🚀 Guia de Início Rápido

## Instalação e Execução (3 minutos)

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 3️⃣ Abrir no Navegador
Acesse: `http://localhost:3000`

---

## 📂 Estrutura do Projeto

```
src/
├── components/
│   ├── atoms/          # Botões, Cards, Badges
│   ├── molecules/      # InstrumentCard, RegionCard
│   └── organisms/      # TerraGlobe (3D), TreePlantingGame
├── pages/
│   └── HomePage/       # Página principal
├── hooks/              # useNASAImagery, useGameState
├── services/           # nasaGIBS.service (API NASA)
├── types/              # TypeScript types
├── config/             # nasa.config (dados dos instrumentos)
└── utils/              # Funções utilitárias
```

---

## 🎯 Funcionalidades Principais

### 1. Storytelling (📖 História)
- Narrativa: "Terra como médico do planeta"
- 25 anos de missão do satélite Terra
- Explicação dos 5 instrumentos científicos

### 2. Globo 3D (🌍 Globo 3D)
- Visualização interativa da Terra
- Pontos nas regiões brasileiras
- Indicadores de saúde ambiental
- Clique nos pontos para mais info

### 3. Instrumentos (🔬 Instrumentos)
- **MODIS**: Vegetação e incêndios
- **ASTER**: Mudanças climáticas
- **CERES**: Radiação solar
- **MISR**: Qualidade do ar
- **MOPITT**: Poluição

### 4. Regiões (📍 Regiões)
- Amazônia (Crítico)
- Cerrado (Alerta)
- Rio Grande do Sul (Crítico - Enchentes 2024)
- São Paulo (Alerta - Poluição)

### 5. Mini-Jogo (🎮 Mini-Jogo)
- Reflorestamento interativo
- Plante árvores (clique ou ESPAÇO)
- Veja impacto real: CO₂ compensado, área restaurada
- Metas por região

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (porta 3000)

# Build
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # ESLint
npm run type-check       # TypeScript check
```

---

## 🎨 Como Adicionar Novos Componentes (com TailwindCSS)

### Exemplo: Criar um novo Atom

```typescript
// src/components/atoms/NewAtom/NewAtom.tsx
import { clsx } from 'clsx';

export interface NewAtomProps {
  text: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const variantStyles = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-200 text-gray-800',
};

export const NewAtom = ({ text, variant = 'primary', className }: NewAtomProps) => {
  return (
    <div
      className={clsx(
        'px-4 py-2 rounded-lg font-semibold',
        variantStyles[variant],
        className
      )}
    >
      {text}
    </div>
  );
};
```

```typescript
// src/components/atoms/NewAtom/index.ts
export { NewAtom } from './NewAtom';
export type { NewAtomProps } from './NewAtom';
```

```typescript
// src/components/atoms/index.ts
export * from './NewAtom';
```

### Dicas TailwindCSS

**Classes Úteis:**
- Layout: `flex`, `grid`, `space-y-4`, `gap-4`
- Cores: `bg-blue-500`, `text-white`, `border-gray-200`
- Espaçamento: `p-4`, `px-6`, `py-3`, `m-4`, `mx-auto`
- Tipografia: `text-lg`, `font-bold`, `leading-relaxed`
- Efeitos: `shadow-lg`, `rounded-xl`, `hover:bg-blue-600`
- Animações: `transition-all`, `duration-300`, `animate-fade-in`

**Responsividade:**
```tsx
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔗 Integração NASA GIBS API

### Exemplo de Uso

```typescript
import { nasaGIBSService } from '@services/nasaGIBS.service';
import { NASA_CONFIG } from '@config/nasa.config';

// Pegar uma camada
const layer = NASA_CONFIG.layers[0]; // MODIS True Color

// Gerar URL de tile
const tileUrl = nasaGIBSService.getTileUrlTemplate(
  layer,
  new Date()
);

// Usar com Leaflet ou react-globe.gl
```

---

## 📱 Responsividade

Todos os componentes são **mobile-first**:
- Breakpoint principal: `768px`
- Grid adaptativo
- Fontes escaláveis
- Touch-friendly

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@atoms/Button'"
**Solução**: Verifique se os path aliases estão configurados em `tsconfig.json` e `vite.config.ts`

### Erro: "Module not found: react-globe.gl"
**Solução**: Execute `npm install` novamente

### Globo 3D não aparece
**Solução**: Verifique se o navegador suporta WebGL

### Imagens NASA não carregam
**Solução**: Verifique conexão com internet e CORS

---

## 🎯 Próximos Passos Sugeridos

1. ✅ Testar todas as funcionalidades
2. ✅ Adicionar mais regiões brasileiras
3. ✅ Implementar mais mini-jogos (quiz, simulações)
4. ✅ Adicionar animações de transição
5. ✅ Implementar sistema de conquistas
6. ✅ Criar modo offline (PWA)
7. ✅ Adicionar compartilhamento social
8. ✅ Implementar analytics

---

## 📚 Recursos Úteis

- **NASA GIBS**: https://wiki.earthdata.nasa.gov/display/GIBS
- **React Globe.gl**: https://github.com/vasturiano/react-globe.gl
- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **TypeScript**: https://www.typescriptlang.org/docs/

---

**Desenvolvido para NASA Space Apps Challenge 2024** 🚀
