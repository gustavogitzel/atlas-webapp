# 🚀 Configuração do Deploy Vercel + GitHub Actions

## 📋 Problema Identificado

O deploy está falhando porque as **secrets do GitHub** não estão configuradas. O erro indica:
```
Error: Input required and not supplied: vercel-token
```

## ✅ Solução: Configurar GitHub Secrets

### **Passo 1: Obter as credenciais da Vercel**

#### 1.1 - Obter VERCEL_TOKEN
1. Acesse: https://vercel.com/account/tokens
2. Clique em **"Create Token"**
3. Dê um nome (ex: `github-actions-atlas`)
4. Copie o token gerado (você só verá uma vez!)

#### 1.2 - Obter VERCEL_ORG_ID e VERCEL_PROJECT_ID
1. No terminal, entre na pasta do projeto:
   ```bash
   cd /Users/akotsubo/Documents/projects/github/atlas-webapp
   ```

2. Instale a CLI da Vercel (se ainda não tiver):
   ```bash
   npm i -g vercel
   ```

3. Faça login:
   ```bash
   vercel login
   ```

4. Vincule o projeto:
   ```bash
   vercel link
   ```

5. Abra o arquivo `.vercel/project.json`:
   ```bash
   cat .vercel/project.json
   ```

6. Copie os valores:
   ```json
   {
     "orgId": "seu-org-id-aqui",
     "projectId": "seu-project-id-aqui"
   }
   ```

### **Passo 2: Configurar Secrets no GitHub**

1. Acesse o repositório no GitHub:
   ```
   https://github.com/gustavogitzel/atlas-webapp/settings/secrets/actions
   ```

2. Clique em **"New repository secret"**

3. Adicione as seguintes secrets:

   | Nome | Valor | Descrição |
   |------|-------|-----------|
   | `VERCEL_TOKEN` | token copiado do passo 1.1 | Token de autenticação da Vercel |
   | `VERCEL_ORG_ID` | orgId do passo 1.2 | ID da organização Vercel |
   | `VERCEL_PROJECT_ID` | projectId do passo 1.2 | ID do projeto Vercel |

4. (Opcional) Adicione também:
   
   | Nome | Valor | Descrição |
   |------|-------|-----------|
   | `VITE_API_URL` | `https://atlas-api-apy0.onrender.com` | URL da API (se necessário) |

### **Passo 3: Testar o Deploy**

Depois de configurar as secrets:

1. Faça commit das mudanças do CI:
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "fix: update upload-artifact to v4"
   git push origin main
   ```

2. Verifique o deploy em:
   ```
   https://github.com/gustavogitzel/atlas-webapp/actions
   ```

## 🔧 Mudanças Aplicadas

### ✅ Atualizado `ci.yml`
- Mudado `actions/upload-artifact@v3` → `actions/upload-artifact@v4`
- Corrigido warning de versão deprecated

### ✅ Verificado `deploy.yml`
- Workflow configurado corretamente
- Esperando apenas as secrets do GitHub

## 📚 Documentação Adicional

- **Vercel Tokens**: https://vercel.com/docs/rest-api#creating-an-access-token
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Vercel Action**: https://github.com/amondnet/vercel-action

## 🎯 Checklist de Configuração

- [ ] Token da Vercel criado
- [ ] ORG_ID e PROJECT_ID obtidos
- [ ] Secrets configuradas no GitHub
- [ ] Commit e push das mudanças
- [ ] Deploy testado e funcionando

## ⚠️ Notas Importantes

1. **Nunca compartilhe os tokens** - São credenciais sensíveis
2. **Guarde o token em local seguro** - Só aparece uma vez na criação
3. **Revogue tokens antigos** - Se suspeitar de vazamento
4. **Use `.gitignore`** - Certifique-se que `.vercel/` está ignorado

## 🆘 Problemas Comuns

### Deploy ainda falhando?

1. Verifique se as secrets foram salvas corretamente
2. Confirme que os nomes das secrets estão EXATAMENTE como no workflow
3. Tente re-rodar o workflow manualmente no GitHub Actions
4. Verifique se o projeto está vinculado à Vercel correta

### Token inválido?

- Crie um novo token e atualize a secret `VERCEL_TOKEN`

### Build failing?

- Teste localmente: `npm run build`
- Verifique as variáveis de ambiente necessárias
