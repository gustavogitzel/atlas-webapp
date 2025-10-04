# ⚡ Quick Setup - GitHub Actions + Vercel

## 🎯 O que você precisa fazer:

### 1️⃣ Configurar Vercel (5 minutos)

#### Passo 1: Criar conta e projeto
1. Acesse: https://vercel.com/signup
2. Faça login com GitHub
3. Click **"Add New Project"**
4. Selecione seu repositório `nasa`
5. Click **"Import"**
6. Vercel detecta automaticamente Vite
7. Click **"Deploy"** (só para criar o projeto)

#### Passo 2: Pegar os IDs do projeto
1. Vá para: **Settings** → **General**
2. Copie:
   - **Project ID** (exemplo: `prj_abc123xyz`)
   - Role a página e encontre **Team ID** ou **Org ID** (exemplo: `team_def456`)

#### Passo 3: Criar Token de Deploy
1. Vá para: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Nome: `GitHub Actions Deploy`
4. Scope: **Full Account**
5. Click **"Create"**
6. **COPIE O TOKEN** (você não verá ele novamente!)

---

### 2️⃣ Configurar GitHub Secrets (2 minutos)

1. Vá para seu repositório no GitHub
2. Click em **Settings** (do repositório)
3. No menu lateral: **Secrets and variables** → **Actions**
4. Click **"New repository secret"**

#### Adicione estes 3 secrets:

| Nome do Secret | Valor | Onde encontrar |
|----------------|-------|----------------|
| `VERCEL_TOKEN` | `xxxxxxxxxxxxx` | Do Passo 3 acima |
| `VERCEL_ORG_ID` | `team_xxxxxx` | Do Passo 2 (Team/Org ID) |
| `VERCEL_PROJECT_ID` | `prj_xxxxxx` | Do Passo 2 (Project ID) |

**Como adicionar cada secret:**
- Click "New repository secret"
- Name: `VERCEL_TOKEN`
- Secret: Cole o valor
- Click "Add secret"
- Repita para os outros 2

---

### 3️⃣ Fazer Push (1 minuto)

```bash
# Commit suas mudanças
git add .
git commit -m "feat: setup GitHub Actions deploy"

# Push para GitHub
git push origin main
```

---

## ✅ Pronto! O que acontece agora:

1. **GitHub Actions** detecta o push
2. Roda os testes (CI)
3. Faz build do projeto
4. Deploy automático para Vercel
5. Você recebe a URL do deploy

### Ver o progresso:

1. Vá para: **Actions** tab no GitHub
2. Veja o workflow rodando
3. Quando terminar (✅ verde), seu app está no ar!

---

## 🔍 Onde ver a URL do deploy:

**Opção 1: GitHub Actions**
- Actions tab → Click no workflow
- Veja os logs do deploy
- URL aparece no final

**Opção 2: Vercel Dashboard**
- https://vercel.com/dashboard
- Veja seu projeto
- URL: `https://seu-projeto.vercel.app`

---

## 🐛 Troubleshooting

### ❌ Deploy falha com "Invalid token"
- Verifique se copiou o `VERCEL_TOKEN` corretamente
- Crie um novo token se necessário

### ❌ "Project not found"
- Verifique o `VERCEL_PROJECT_ID`
- Certifique-se que o projeto existe no Vercel

### ❌ "Unauthorized"
- Verifique o `VERCEL_ORG_ID`
- Pode ser `team_xxx` ou `user_xxx`

### ❌ Build falha
- Teste localmente: `npm run build`
- Verifique os logs no GitHub Actions

---

## 📋 Checklist Rápido

- [ ] Conta criada no Vercel
- [ ] Projeto importado no Vercel
- [ ] Token criado no Vercel
- [ ] 3 secrets adicionados no GitHub
- [ ] Push feito para GitHub
- [ ] Workflow rodou com sucesso
- [ ] App está no ar! 🎉

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────────────┐
│  1. VERCEL                                      │
│  ├─ Criar conta                                 │
│  ├─ Importar projeto                            │
│  ├─ Copiar Project ID                           │
│  ├─ Copiar Org ID                               │
│  └─ Criar Token                                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. GITHUB SECRETS                              │
│  ├─ VERCEL_TOKEN                                │
│  ├─ VERCEL_ORG_ID                               │
│  └─ VERCEL_PROJECT_ID                           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. GIT PUSH                                    │
│  └─ git push origin main                        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. GITHUB ACTIONS                              │
│  ├─ CI: Build + Test                            │
│  └─ Deploy: Vercel                              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  5. ✅ APP NO AR!                               │
│  └─ https://seu-projeto.vercel.app              │
└─────────────────────────────────────────────────┘
```

---

## 💡 Dica Pro

Depois do primeiro deploy, você pode:
- Fazer mudanças no código
- Commit e push
- Deploy automático acontece!

**Não precisa mais configurar nada!** 🚀

---

Precisa de ajuda? Veja `GITHUB_ACTIONS_SETUP.md` para mais detalhes.
