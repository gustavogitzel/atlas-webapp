# 🚀 Comandos Úteis - Terra Health Monitor

## 📦 Instalação

```bash
# Instalar todas as dependências
npm install

# Instalar dependência específica
npm install <package-name>

# Instalar dependência de desenvolvimento
npm install -D <package-name>
```

---

## 🏃 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Iniciar em porta específica
PORT=3001 npm run dev
```

---

## 🏗️ Build

```bash
# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Build + Preview
npm run build && npm run preview
```

---

## 🧹 Qualidade de Código

```bash
# Executar ESLint
npm run lint

# Executar ESLint e corrigir automaticamente
npm run lint -- --fix

# Type check do TypeScript
npm run type-check

# Executar tudo
npm run lint && npm run type-check
```

---

## 🎨 TailwindCSS

```bash
# Tailwind já está configurado e roda automaticamente com Vite
# Não precisa de comando separado!

# Para ver as classes geradas (debug)
npx tailwindcss -i ./src/index.css -o ./debug.css
```

---

## 📦 Gerenciamento de Dependências

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Atualizar dependência específica
npm update <package-name>

# Limpar cache do npm
npm cache clean --force

# Reinstalar tudo do zero
rm -rf node_modules package-lock.json && npm install
```

---

## 🔍 Debugging

```bash
# Verificar versão do Node
node --version

# Verificar versão do npm
npm --version

# Ver informações do projeto
npm list --depth=0

# Ver informações de uma dependência
npm info <package-name>
```

---

## 🌐 Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

### Build Manual
```bash
# 1. Build
npm run build

# 2. A pasta 'dist' contém os arquivos para deploy
# 3. Faça upload da pasta 'dist' para seu servidor
```

---

## 🧪 Testes (Para Implementar)

```bash
# Instalar Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Adicionar ao package.json:
# "test": "vitest"
# "test:ui": "vitest --ui"
# "coverage": "vitest --coverage"

# Executar testes
npm test

# Executar com UI
npm run test:ui

# Ver cobertura
npm run coverage
```

---

## 📊 Análise de Bundle

```bash
# Instalar rollup-plugin-visualizer
npm install -D rollup-plugin-visualizer

# Adicionar ao vite.config.ts:
# import { visualizer } from 'rollup-plugin-visualizer';
# plugins: [react(), visualizer()]

# Build e gerar análise
npm run build

# Abrir stats.html no navegador
open stats.html
```

---

## 🔧 Utilitários

```bash
# Encontrar arquivos grandes
find . -type f -size +1M -not -path "./node_modules/*"

# Contar linhas de código
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Remover arquivos CSS antigos (já feito)
find src -name "*.css" -type f -delete

# Ver estrutura de pastas
tree src -I node_modules

# Limpar dist
rm -rf dist
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@atoms/Button'"
```bash
# Verificar tsconfig.json e vite.config.ts
# Reiniciar servidor
npm run dev
```

### Erro: "Module not found: react-globe.gl"
```bash
# Reinstalar dependências
npm install
```

### Erro: Tailwind não está funcionando
```bash
# Verificar se os arquivos existem:
# - tailwind.config.js
# - postcss.config.js
# - src/index.css (com @tailwind directives)

# Reiniciar servidor
npm run dev
```

### Erro: Port 3000 já está em uso
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
PORT=3001 npm run dev
```

### Build falha
```bash
# Limpar e reconstruir
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Git (Controle de Versão)

```bash
# Inicializar repositório (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: implementação completa do projeto Terra Health Monitor"

# Adicionar remote
git remote add origin <url-do-repositorio>

# Push
git push -u origin main

# Ver status
git status

# Ver histórico
git log --oneline

# Criar branch
git checkout -b feature/nova-funcionalidade
```

---

## 🎯 Comandos Rápidos do Hackathon

```bash
# Setup inicial completo
npm install && npm run dev

# Verificar tudo antes de apresentar
npm run lint && npm run type-check && npm run build

# Deploy rápido (Vercel)
npm run build && vercel --prod

# Backup rápido
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz src public package.json
```

---

## 🔥 Comandos de Emergência

```bash
# Tudo quebrou? Reset completo!
rm -rf node_modules package-lock.json dist
npm install
npm run dev

# Reverter para último commit
git reset --hard HEAD

# Ver diferenças antes de commitar
git diff

# Salvar trabalho temporariamente
git stash
git stash pop
```

---

## 📱 Teste em Dispositivos

```bash
# Descobrir IP local
ifconfig | grep "inet " | grep -v 127.0.0.1

# Acessar de outro dispositivo na mesma rede
# http://<seu-ip>:3000

# Exemplo: http://192.168.1.100:3000
```

---

## 🎉 Comandos de Celebração

```bash
# Projeto completo!
echo "🎉 Projeto Terra Health Monitor está pronto!"

# Ver estatísticas
echo "Linhas de código:" && find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | tail -1

# Criar tag de versão
git tag -a v1.0.0 -m "Versão final para NASA Space Apps Challenge 2024"
git push origin v1.0.0
```

---

**Boa sorte no hackathon! 🚀🛰️**
