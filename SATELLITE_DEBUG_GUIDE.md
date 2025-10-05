# 🛰️ Guia de Debug do Satélite Terra - Ajuste de Coordenadas 3D

## 🎯 Objetivo
Este guia explica como usar o **Modo Debug** para ajustar com precisão as posições 3D dos instrumentos do satélite Terra no modelo Sketchfab.

## 🔧 Como Usar o Modo Debug

### Passo 1: Ativar o Modo Debug
1. Acesse a página `/satellite`
2. No canto superior esquerdo, clique no botão **"🔍 Debug OFF"**
3. O botão ficará verde: **"🔍 Debug ON"**

### Passo 2: Capturar Coordenadas 3D
1. Com o Debug Mode ativo, **clique** em qualquer parte do modelo 3D do satélite
2. Um painel verde aparecerá mostrando as coordenadas 3D exatas do ponto clicado:
   ```
   📍 Clicked Position:
   [0.45, -0.23, 0.67]
   ```
3. Use a referência visual da **imagem NASA Terra** para identificar onde cada instrumento está localizado

### Passo 3: Copiar e Aplicar Coordenadas
1. Clique no botão **"📋 Copy Code"** no painel de debug
2. O código será copiado no formato:
   ```typescript
   'INSTRUMENT': [0.45, -0.23, 0.67],
   ```
3. Cole as coordenadas no arquivo `SatellitePage.tsx`, na função `startTrackingInstruments`:

```typescript
const instrument3DPositions: Record<string, [number, number, number]> = {
  'MODIS': [0, 0.8, 0],         // SUBSTITUA com valores capturados
  'ASTER': [0.6, 0, 0.3],       // SUBSTITUA com valores capturados
  'MISR': [0, -0.3, 0.6],       // SUBSTITUA com valores capturados
  'MOPITT': [-0.6, -0.3, 0.3],  // SUBSTITUA com valores capturados
  'CERES': [-0.6, -0.5, 0],     // SUBSTITUA com valores capturados
};
```

## 📐 Entendendo o Sistema de Coordenadas

### Eixos 3D do Modelo
- **X (horizontal)**: Negativo = esquerda, Positivo = direita
- **Y (vertical)**: Negativo = baixo, Positivo = cima
- **Z (profundidade)**: Negativo = longe, Positivo = perto

### Posição Inicial da Câmera
A câmera está configurada para visualizar o satélite **de baixo**:
```typescript
// Posição da câmera: [x, y, z]
[0, -3, 2]  // Abaixo e ligeiramente atrás do satélite

// Olhando para:
[0, 0, 0]   // Centro do satélite
```

## 🎯 Mapeamento dos Instrumentos NASA Terra

### Referência Visual
Use a imagem oficial da NASA que mostra os 5 instrumentos:
1. **MODIS** - Instrumento principal no topo central
2. **ASTER** - Lateral direita (meio)
3. **MISR** - Centro inferior frontal
4. **MOPITT** - Lateral esquerda inferior
5. **CERES** - Canto inferior esquerdo

### Processo de Mapeamento
Para cada instrumento:

1. **Identifique visualmente** onde o instrumento está na imagem NASA
2. **Rotacione o modelo 3D** até ver a mesma região
3. **Clique no modelo** exatamente onde o instrumento está localizado
4. **Copie as coordenadas** e teste focando a câmera nesse ponto
5. **Ajuste fino**: Se necessário, modifique os valores ligeiramente

## 🔄 Ajuste da Rotação Inicial

### Problema
Se o corpo do satélite bloqueia a visualização dos instrumentos, ajuste a câmera inicial.

### Solução
No arquivo `SatellitePage.tsx`, dentro do `viewerready` callback:

```typescript
// Configurar câmera inicial - visualização de baixo do satélite
api.setCameraLookAt(
  [0, -3, 2],  // Posição da câmera - AJUSTE AQUI
  [0, 0, 0],   // Olhando para o centro
  0            // Sem animação inicial
);
```

### Valores Sugeridos para Testes
- **Visualização de baixo mais próxima**: `[0, -2.5, 1.5]`
- **Visualização de baixo mais afastada**: `[0, -4, 3]`
- **Visualização lateral esquerda**: `[-2, -2, 2]`
- **Visualização lateral direita**: `[2, -2, 2]`
- **Visualização diagonal**: `[1.5, -3, 2.5]`

## ✅ Validação dos Ajustes

### Checklist
1. ✅ Câmera inicial mostra o satélite de baixo sem obstruções
2. ✅ Todos os 5 instrumentos são visíveis na vista inicial
3. ✅ Durante o tour, a câmera foca corretamente em cada instrumento
4. ✅ O ponto amarelo pulsante aparece sobre o instrumento correto
5. ✅ A transição entre instrumentos é suave (2 segundos)

### Teste Completo
1. Inicie o tour (deve começar automaticamente)
2. Avance por todas as 8 etapas
3. Verifique se cada instrumento é destacado corretamente
4. Confirme que as informações no modal correspondem ao instrumento focado

## 🐛 Troubleshooting

### Problema: Coordenadas não aparecem ao clicar
**Solução**: Certifique-se de que o Debug Mode está ativado (botão verde)

### Problema: Câmera foca em local errado
**Solução**: 
1. Use o Debug Mode para capturar a coordenada correta
2. Atualize `instrument3DPositions` em `startTrackingInstruments`
3. Também atualize as mesmas coordenadas em `focusOnInstrument`

### Problema: Corpo do satélite bloqueia vista
**Solução**: Ajuste a posição inicial da câmera para um ângulo diferente

### Problema: Ponto amarelo não aparece sobre instrumento
**Solução**: O sistema usa `getWorldToScreenCoordinates` para converter 3D→2D. Se as coordenadas 3D estiverem corretas, o ponto 2D será calculado automaticamente.

## 📝 Notas Importantes

1. **Coordenadas são relativas ao centro do modelo** (0, 0, 0)
2. **Valores típicos variam de -1 a +1** para a maioria dos pontos visíveis
3. **Use decimais** para precisão (ex: 0.45, não apenas 0 ou 1)
4. **Teste imediatamente** após cada ajuste para validar
5. **Console do navegador** mostra logs úteis - pressione F12 para ver

## 🚀 Próximos Passos

Após ajustar as coordenadas:
1. Desative o Debug Mode (clique no botão verde)
2. Teste a experiência completa do tour
3. Se necessário, faça ajustes finos
4. Documente os valores finais para referência futura

## 📚 Recursos Adicionais

- [Documentação Sketchfab Viewer API](https://sketchfab.com/developers/viewer)
- [Imagem Oficial NASA Terra](https://terra.nasa.gov/about/terra-instruments)
- Modelo 3D usado: `0d9ed6443b0f41c2b08671ac12019859` (Sketchfab)

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0
