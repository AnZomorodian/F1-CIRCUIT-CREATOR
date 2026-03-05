import { v4 as uuidv4 } from 'uuid';

export type PieceType = 'straight' | 'curve' | 'startFinish' | 'sCurve' | 'pitLane' | 'bridge' | 'tunnel' | 'grandstand' | 'gravel' | 'grass' | 'paddock' | 'safetyCar' | 'kerb' | 'wall' | 'tireStack' | 'floodlight' | 'tree' | 'safetyBarrier' | 'water' | 'asphaltRunoff';

export interface TrackPiece {
  id: string;
  type: PieceType;
  x: number;
  y: number;
  rotation: number;
  length: number;    // for straights
  radius: number;    // for curves
  angle: number;     // for curves
  width: number;     // Track width
  curbColor: string;
  opacity?: number;
  isLocked?: boolean;
  label?: string;
  theme?: 'modern' | 'classic' | 'night' | 'wet';
}

const DEFAULT_WIDTH = 80;

export const createPiece = (type: string, x: number, y: number): TrackPiece => {
  const base = {
    id: uuidv4(),
    type: type as PieceType,
    x,
    y,
    rotation: 0,
    width: DEFAULT_WIDTH,
    curbColor: '#ef4444', // F1 Red
    length: 0,
    radius: 0,
    angle: 0,
  };

  switch (type) {
    case 'straight':
      return { ...base, length: 300 };
    case 'startFinish':
      return { ...base, type: 'startFinish', length: 200, curbColor: '#ffffff' };
    case 'hairpin':
      return { ...base, type: 'curve', radius: 100, angle: 180 };
    case 'fastCorner':
      return { ...base, type: 'curve', radius: 250, angle: 90 };
    case 'chicane':
      return { ...base, type: 'curve', radius: 150, angle: 45 };
    case 'sCurve':
      return { ...base, type: 'sCurve', radius: 100, angle: 90 };
    case 'pitLane':
      return { ...base, type: 'pitLane', length: 250, width: 40 };
    case 'bridge':
      return { ...base, type: 'bridge', length: 200 };
    case 'tunnel':
      return { ...base, type: 'tunnel', length: 200 };
    case 'grandstand':
      return { ...base, type: 'grandstand', length: 150, width: 40 };
    case 'floodlight':
      return { ...base, type, width: 20, length: 20 };
    case 'tree':
      return { ...base, type, width: 40, length: 40 };
    case 'safetyBarrier':
      return { ...base, type, width: 20, length: 60, curbColor: '#3b82f6' };
    case 'water':
      return { ...base, type, width: 200, length: 300 };
    case 'asphaltRunoff':
      return { ...base, type, width: 100, length: 200 };
    default:
      return { ...base, length: 200 };
  }
};
