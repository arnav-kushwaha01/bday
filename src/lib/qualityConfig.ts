import type { QualityTier } from "@/store/useAppStore";

export interface QualityConfig {
  dpr: [number, number];
  shadowMapEnabled: boolean;
  shadowMapSize: number;
  postProcessing: boolean;
  particleCount: number;
  antialiasing: boolean;
  bloom: boolean;
}

export const QUALITY_CONFIGS: Record<QualityTier, QualityConfig> = {
  ULTRA: {
    dpr: [1, 2],
    shadowMapEnabled: true,
    shadowMapSize: 2048,
    postProcessing: true,
    particleCount: 2000,
    antialiasing: true,
    bloom: true,
  },
  HIGH: {
    dpr: [1, 1.5],
    shadowMapEnabled: true,
    shadowMapSize: 1024,
    postProcessing: true,
    particleCount: 1000,
    antialiasing: true,
    bloom: true,
  },
  MEDIUM: {
    dpr: [1, 1.25],
    shadowMapEnabled: true,
    shadowMapSize: 512,
    postProcessing: false,
    particleCount: 500,
    antialiasing: false,
    bloom: false,
  },
  LOW: {
    dpr: [1, 1],
    shadowMapEnabled: false,
    shadowMapSize: 256,
    postProcessing: false,
    particleCount: 100,
    antialiasing: false,
    bloom: false,
  },
};
