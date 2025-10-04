# 🤖 GitHub Actions - Auto Deploy Setup

## 📁 Workflows Created

1. **`ci.yml`** - Build and test on every push
2. **`deploy.yml`** - Deploy to Vercel automatically
3. **`netlify-deploy.yml`** - Deploy to Netlify automatically

## 🚀 Setup Instructions

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Get Vercel Tokens

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login and link project**:
   ```bash
   vercel login
   vercel link
   ```

3. **Get your tokens**:
   ```bash
   # This creates .vercel/project.json
   cat .vercel/project.json
   ```
   
   You'll see:
   ```json
   {
     "orgId": "team_xxxxx",
     "projectId": "prj_xxxxx"
   }
   ```

4. **Get Vercel Token**:
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: `GitHub Actions`
   - Copy the token

#### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

   | Name | Value | Where to find |
   |------|-------|---------------|
   | `VERCEL_TOKEN` | `xxxxx` | From step 4 above |
   | `VERCEL_ORG_ID` | `team_xxxxx` | From `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | `prj_xxxxx` | From `.vercel/project.json` |
   | `VITE_API_URL` | `https://atlas-api-apy0.onrender.com` | API URL (optional) |

#### Step 3: Push to GitHub

```bash
git add .
git commit -m "feat: add GitHub Actions for auto deploy"
git push
```

✅ **Done!** GitHub Actions will automatically deploy to Vercel on every push to `main`.

---

### Option 2: Deploy to Netlify

#### Step 1: Get Netlify Tokens

1. **Go to Netlify**:
   - https://app.netlify.com

2. **Create new site**:
   - Sites → Add new site → Import existing project
   - Connect to GitHub
   - Select your repository
   - Deploy (just once to create the site)

3. **Get Site ID**:
   - Site settings → General → Site details
   - Copy **Site ID** (e.g., `abc123-456def-789ghi`)

4. **Get Auth Token**:
   - User settings → Applications → Personal access tokens
   - Click "New access token"
   - Name: `GitHub Actions`
   - Copy the token

#### Step 2: Add GitHub Secrets

Add these secrets to your GitHub repository:

| Name | Value | Where to find |
|------|-------|---------------|
| `NETLIFY_AUTH_TOKEN` | `xxxxx` | From step 4 above |
| `NETLIFY_SITE_ID` | `abc123-456def-789ghi` | From step 3 above |
| `VITE_API_URL` | `https://atlas-api-apy0.onrender.com` | API URL (optional) |

#### Step 3: Disable or Delete Vercel Workflow

If you're using Netlify, disable the Vercel workflow:

```bash
# Rename to disable
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
```

Or delete it:
```bash
rm .github/workflows/deploy.yml
```

#### Step 4: Push to GitHub

```bash
git add .
git commit -m "feat: add GitHub Actions for Netlify deploy"
git push
```

✅ **Done!** GitHub Actions will automatically deploy to Netlify.

---

## 🔄 How It Works

### On Every Push to `main`:

1. **CI Workflow** runs:
   - ✅ Installs dependencies
   - ✅ Runs type check
   - ✅ Runs linter
   - ✅ Builds the project
   - ✅ Uploads build artifacts

2. **Deploy Workflow** runs:
   - ✅ Builds the project
   - ✅ Deploys to Vercel/Netlify
   - ✅ Comments on PR with preview URL

### On Pull Requests:

- ✅ Runs CI checks
- ✅ Creates preview deployment
- ✅ Comments on PR with preview link

---

## 📊 Workflow Status

After pushing, check:

1. **GitHub Actions tab** in your repository
2. See workflow runs and logs
3. Get deployment URLs from workflow output

---

## 🎯 Workflow Features

### CI Workflow (`ci.yml`)
- ✅ Tests on Node 18 and 20
- ✅ Type checking
- ✅ Linting
- ✅ Build verification
- ✅ Artifact upload

### Deploy Workflow (`deploy.yml` or `netlify-deploy.yml`)
- ✅ Automatic deployment on push
- ✅ Preview deployments for PRs
- ✅ Environment variables support
- ✅ Build caching for faster deploys

---

## 🔧 Customization

### Change Deploy Branch

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
      - production  # Add more branches
```

### Add Environment Variables

Add to GitHub Secrets, then use in workflow:

```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
  VITE_CUSTOM_VAR: ${{ secrets.VITE_CUSTOM_VAR }}
```

### Deploy Only on Tags

```yaml
on:
  push:
    tags:
      - 'v*'  # Deploy only on version tags
```

---

## 🐛 Troubleshooting

### Build Fails

1. **Check workflow logs** in GitHub Actions tab
2. **Test locally**:
   ```bash
   npm ci
   npm run type-check
   npm run lint
   npm run build
   ```
3. **Check Node version** (should be 18+)

### Deploy Fails

1. **Verify secrets** are set correctly
2. **Check token permissions**
3. **Verify project IDs** are correct

### Secrets Not Working

- Make sure secret names match exactly
- Secrets are case-sensitive
- Re-create secrets if needed

---

## 📝 Quick Commands

```bash
# Check workflow status
gh workflow list

# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# Re-run failed workflow
gh run rerun <run-id>
```

---

## 🎉 What You Get

After setup:

- ✅ **Auto-deploy** on every push to main
- ✅ **Preview deployments** for pull requests
- ✅ **CI checks** before merge
- ✅ **Build artifacts** saved
- ✅ **Status badges** for README

---

## 📌 Add Status Badge to README

Add to your `README.md`:

```markdown
![CI](https://github.com/YOUR_USERNAME/nasa/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/nasa/actions/workflows/deploy.yml/badge.svg)
```

---

## 🚀 Next Steps

1. ✅ Choose Vercel or Netlify
2. ✅ Add secrets to GitHub
3. ✅ Push to GitHub
4. ✅ Watch automatic deployment
5. ✅ Share your live app!

Your NASA Fire Globe will be live with automatic deployments! 🌍🔥
