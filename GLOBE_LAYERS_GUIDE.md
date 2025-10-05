# 🌍 Fire Globe - NASA GIBS Layers Guide

## Visão Geral

O Fire Globe agora suporta **10 camadas diferentes de imagens da NASA GIBS** (Global Imagery Browse Services), permitindo visualizar incêndios em diferentes espectros e contextos.

## 📡 Camadas Disponíveis

### 🌍 Visual Spectrum (Espectro Visual)
Imagens em cores naturais como vistas do espaço.

1. **True Color (Terra/MODIS)** `terra-truecolor`
   - Resolução: 250m
   - Melhor para: Visualização geral da Terra
   - Satélite: MODIS Terra
   - 🎯 Uso: Contexto geográfico natural

2. **True Color (Aqua/MODIS)** `aqua-truecolor`
   - Resolução: 250m
   - Melhor para: Imagens complementares ao Terra
   - Satélite: MODIS Aqua
   - 🎯 Uso: Cobertura adicional de horários

3. **True Color (VIIRS/SNPP)** `viirs-truecolor`
   - Resolução: 250m
   - Melhor para: Imagens de alta resolução
   - Satélite: VIIRS SNPP
   - 🎯 Uso: Detalhes mais nítidos

### 🔥 Infrared / Fire Detection (Infravermelho)
**RECOMENDADO PARA DETECÇÃO DE INCÊNDIOS** - Camadas otimizadas para visualizar fogo e calor.

4. **False Color (Bands 7-2-1)** `terra-bands721` ⭐ **PADRÃO**
   - Resolução: 250m
   - Melhor para: **Detecção de incêndios ativos**
   - Cores: Incêndios aparecem em **vermelho/laranja brilhante**
   - 🎯 Uso: Visualização primária de focos de incêndio

5. **False Color Aqua (Bands 7-2-1)** `aqua-bands721`
   - Resolução: 250m
   - Melhor para: Detecção complementar de incêndios
   - Cores: Incêndios em vermelho/laranja
   - 🎯 Uso: Cobertura adicional de horários

6. **VIIRS False Color** `viirs-bands-m11-i2-i1`
   - Resolução: 250m
   - Melhor para: Pontos quentes e incêndios noturnos
   - Cores: Calor destacado em cores falsas
   - 🎯 Uso: Detecção de alta sensibilidade

### 🗺️ Terrain & Topography (Terreno)
Visualização de relevo e topografia.

7. **Blue Marble** `blue-marble`
   - Resolução: 500m
   - Melhor para: Visualização artística da Terra
   - Características: Relevo sombreado + batimetria
   - 🎯 Uso: Apresentações e contexto geográfico

8. **Shaded Relief** `shaded-relief`
   - Resolução: 1km
   - Melhor para: Análise de elevação
   - Características: Relevo em tons de cinza
   - 🎯 Uso: Correlação incêndios x topografia

### 🌱 Environmental (Ambiental)
Camadas especializadas para monitoramento ambiental.

9. **Landsat 8 True Color** `landsat-truecolor`
   - Resolução: 30m (ALTA RESOLUÇÃO)
   - Melhor para: Detalhes de superfície
   - Características: Imagem anual composta
   - 🎯 Uso: Análise detalhada de áreas específicas

10. **Earth at Night** `night-lights`
    - Resolução: 500m
    - Melhor para: Luzes de cidades e incêndios noturnos
    - Características: VIIRS Day/Night Band
    - 🎯 Uso: Visualização noturna, impacto urbano

## 🎨 Casos de Uso Recomendados

### Para Detecção de Incêndios
```
1º - False Color (Bands 7-2-1) - terra-bands721
2º - VIIRS False Color - viirs-bands-m11-i2-i1
3º - False Color Aqua - aqua-bands721
```

### Para Apresentações
```
1º - True Color (Terra) - terra-truecolor
2º - Blue Marble - blue-marble
3º - True Color (VIIRS) - viirs-truecolor
```

### Para Análise Científica
```
1º - False Color (Bands 7-2-1) - terra-bands721
2º - Shaded Relief - shaded-relief
3º - Landsat 8 - landsat-truecolor
```

### Para Visualização Noturna
```
1º - Earth at Night - night-lights
2º - VIIRS False Color - viirs-bands-m11-i2-i1
```

## 🔧 Como Usar

### No Fire Globe
1. Clique no botão **"Base Layer"** no canto superior direito
2. Navegue pelas categorias:
   - 👁️ Visual Spectrum
   - 🔥 Infrared / Fire Detection
   - 🗺️ Terrain & Topography
   - 🌱 Environmental
3. Selecione a camada desejada
4. A camada será aplicada automaticamente ao globo

### Programaticamente
```typescript
import { GLOBE_LAYERS, getLayerUrl } from '@/config/globeLayers';

// Obter camada específica
const layer = GLOBE_LAYERS.find(l => l.id === 'terra-bands721');

// Gerar URL para uma data
const url = getLayerUrl(layer, '2024-01-15');

// Obter camadas por categoria
const fireLayers = GLOBE_LAYERS.filter(l => l.category === 'infrared');
```

## 📊 Comparação de Camadas

| Camada | Resolução | Incêndios | Nuvens | Noturno | Atualização |
|--------|-----------|-----------|--------|---------|-------------|
| Terra True Color | 250m | ⭐ | ❌ Bloqueado | ❌ | Diária |
| Terra Bands 7-2-1 | 250m | ⭐⭐⭐ | ✅ Penetra | ✅ | Diária |
| VIIRS False Color | 250m | ⭐⭐⭐ | ✅ Penetra | ⭐⭐⭐ | Diária |
| Blue Marble | 500m | ❌ | N/A | ❌ | Estática |
| Earth at Night | 500m | ⭐⭐ | ❌ | ⭐⭐⭐ | Mensal |

## 🌟 Dicas Avançadas

### Combinando Camadas
- Use **Bands 7-2-1** para identificar incêndios ativos
- Mude para **True Color** para ver contexto geográfico
- Use **Shaded Relief** para entender topografia
- Use **Earth at Night** para ver impacto em áreas urbanas

### Melhor Horário para Cada Satélite
- **Terra**: Passa pela manhã (10:30 AM local)
- **Aqua**: Passa à tarde (1:30 PM local)
- **VIIRS**: Cobertura contínua dia/noite

### Limitações
- Nuvens podem bloquear visualização em True Color
- Camadas infravermelhas penetram melhor através de fumaça
- Resolução varia de 30m (Landsat) a 1km (Shaded Relief)
- Algumas camadas têm delay de 1-3 dias

## 🔗 Recursos Adicionais

- [NASA GIBS Documentation](https://wiki.earthdata.nasa.gov/display/GIBS)
- [MODIS Fire Detection](https://modis.gsfc.nasa.gov/data/dataprod/mod14.php)
- [VIIRS Active Fire](https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms)
- [Worldview](https://worldview.earthdata.nasa.gov/) - Visualizador oficial da NASA

## 💡 Próximas Melhorias Possíveis

1. **Overlay de Múltiplas Camadas**: Combinar True Color + Fire Detection
2. **Animação Temporal**: Ver evolução de incêndios ao longo do tempo
3. **Comparação Lado a Lado**: Duas camadas simultaneamente
4. **Camadas Customizadas**: Permitir URLs personalizadas
5. **Opacity Control**: Ajustar transparência das camadas
6. **Blend Modes**: Diferentes modos de mesclagem

---

**Desenvolvido com dados da NASA GIBS**
