// import axios, { AxiosInstance } from 'axios';
import { format } from 'date-fns';
import type {
  GIBSLayer,
  TemporalComparison,
  APIResponse,
  ImageryMetadata,
} from '@/types/nasa.types';
import { NASA_CONFIG } from '@config/nasa.config';

/**
 * NASA GIBS API Service
 * Serviço para integração com NASA Global Imagery Browse Services
 * 
 * Documentação: https://wiki.earthdata.nasa.gov/display/GIBS
 */

class NASAGIBSService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = NASA_CONFIG.gibs.baseUrl;
  }

  // ==========================================================================
  // WMTS TILE URLS
  // ==========================================================================

  /**
   * Gera URL para tile WMTS da NASA GIBS
   */
  public getTileUrl(layer: GIBSLayer, date: Date, z: number, x: number, y: number): string {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { identifier, format: imageFormat, tileMatrixSet } = layer;

    return `${this.baseUrl}/${identifier}/default/${dateStr}/${tileMatrixSet}/${z}/${y}/${x}.${this.getFormatExtension(imageFormat)}`;
  }

  /**
   * Gera URL template para Leaflet TileLayer
   */
  public getTileUrlTemplate(layer: GIBSLayer, date: Date): string {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { identifier, format: imageFormat, tileMatrixSet } = layer;
    const ext = this.getFormatExtension(imageFormat);

    return `${this.baseUrl}/${identifier}/default/${dateStr}/${tileMatrixSet}/{z}/{y}/{x}.${ext}`;
  }

  // ==========================================================================
  // IMAGERY REQUESTS
  // ==========================================================================

  /**
   * Busca metadados de uma camada de imagem
   */
  public async getImageryMetadata(
    layer: GIBSLayer,
    date: Date
  ): Promise<APIResponse<ImageryMetadata>> {
    try {
      const metadata: ImageryMetadata = {
        layer: layer.identifier,
        date: format(date, 'yyyy-MM-dd'),
        resolution: layer.tileMatrixSet,
        instrument: layer.instrument,
        bounds: [[-90, -180], [90, 180]], // Global bounds
      };

      return {
        success: true,
        data: metadata,
        timestamp: new Date(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Cria comparação temporal entre duas datas
   */
  public async createTemporalComparison(
    layer: GIBSLayer,
    currentDate: Date,
    previousDate: Date
  ): Promise<APIResponse<TemporalComparison>> {
    try {
      const comparison: TemporalComparison = {
        current: {
          date: currentDate,
          imageUrl: this.getTileUrlTemplate(layer, currentDate),
        },
        previous: {
          date: previousDate,
          imageUrl: this.getTileUrlTemplate(layer, previousDate),
        },
      };

      return {
        success: true,
        data: comparison,
        timestamp: new Date(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // LAYER MANAGEMENT
  // ==========================================================================

  /**
   * Retorna todas as camadas disponíveis
   */
  public getAvailableLayers(): GIBSLayer[] {
    return NASA_CONFIG.layers;
  }

  /**
   * Busca camada por identificador
   */
  public getLayerById(identifier: string): GIBSLayer | undefined {
    return NASA_CONFIG.layers.find((layer) => layer.identifier === identifier);
  }

  /**
   * Filtra camadas por instrumento
   */
  public getLayersByInstrument(instrument: string): GIBSLayer[] {
    return NASA_CONFIG.layers.filter((layer) => layer.instrument === instrument);
  }

  /**
   * Valida se uma data está disponível para uma camada
   */
  public isDateAvailable(layer: GIBSLayer, date: Date): boolean {
    const startDate = new Date(layer.startDate);
    const endDate = layer.endDate ? new Date(layer.endDate) : new Date();

    return date >= startDate && date <= endDate;
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Converte formato MIME para extensão de arquivo
   */
  private getFormatExtension(format: string): string {
    const formatMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
    };
    return formatMap[format] || 'jpg';
  }

  /**
   * Tratamento de erros padronizado
   */
  private handleError<T>(error: unknown): APIResponse<T> {
    console.error('NASA GIBS Service Error:', error);

    let errorMessage = 'Erro desconhecido ao acessar NASA GIBS';
    let errorCode = 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorCode = 'ERROR';
    }

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
      timestamp: new Date(),
    };
  }

  // ==========================================================================
  // LEAFLET INTEGRATION
  // ==========================================================================

  /**
   * Cria opções para Leaflet TileLayer
   */
  public getLeafletTileLayerOptions(layer: GIBSLayer, date: Date) {
    return {
      url: this.getTileUrlTemplate(layer, date),
      attribution: '&copy; NASA GIBS',
      maxZoom: 9,
      tileSize: 256,
      noWrap: true,
      bounds: [[-90, -180], [90, 180]] as [[number, number], [number, number]],
    };
  }
}

// Singleton instance
export const nasaGIBSService = new NASAGIBSService();
