import { PresetImage } from './types';

export const PRESET_PEOPLE: PresetImage[] = [
  {
    id: 'p1',
    // Replaced Alibaba image with Unsplash for better CORS reliability and access
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    label: '预设模特 1'
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    label: '预设模特 2'
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    label: '预设模特 3'
  }
];

export const PRESET_CLOTHES: PresetImage[] = [
  {
    id: 'c1',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    label: '运动红鞋'
  },
  {
    id: 'c2',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    label: '休闲T恤'
  },
  {
    id: 'c3',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    label: '时尚夹克'
  }
];

export const MODEL_NAME = 'gemini-2.5-flash-image';