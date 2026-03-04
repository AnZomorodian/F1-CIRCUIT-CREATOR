import React from 'react';
import { TrackPiece } from '@/lib/track-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, PaintBucket } from 'lucide-react';

interface Props {
  selectedPiece: TrackPiece | null;
  onChange: (piece: TrackPiece) => void;
  onDelete: (id: string) => void;
}

export const PropertiesPanel: React.FC<Props> = ({ selectedPiece, onChange, onDelete }) => {
  if (!selectedPiece) {
    return (
      <div className="w-80 border-l border-white/10 bg-card/80 backdrop-blur-xl flex flex-col justify-center items-center p-8 text-center shadow-2xl z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <SplineIcon className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">No Piece Selected</h3>
        <p className="text-sm text-muted-foreground">Click a piece on the canvas to customize its properties.</p>
      </div>
    );
  }

  const handleChange = (field: keyof TrackPiece, value: any) => {
    onChange({ ...selectedPiece, [field]: value });
  };

  return (
    <div className="w-80 border-l border-white/10 bg-card/80 backdrop-blur-xl flex flex-col z-10 shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground capitalize">
          {selectedPiece.type.replace(/([A-Z])/g, ' $1').trim()}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => onDelete(selectedPiece.id)} className="text-destructive hover:bg-destructive/20 hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Position & Rotation */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transform</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position X</Label>
              <Input 
                type="number" 
                value={Math.round(selectedPiece.x)} 
                onChange={(e) => handleChange('x', Number(e.target.value))}
                className="font-mono bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Position Y</Label>
              <Input 
                type="number" 
                value={Math.round(selectedPiece.y)} 
                onChange={(e) => handleChange('y', Number(e.target.value))}
                className="font-mono bg-black/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex justify-between">
              Rotation 
              <Button variant="link" className="h-auto p-0 text-xs text-primary" onClick={() => handleChange('rotation', 0)}>
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </Label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="-180" max="180" 
                value={Math.round(selectedPiece.rotation)} 
                onChange={(e) => handleChange('rotation', Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="font-mono text-sm w-12 text-right">{Math.round(selectedPiece.rotation)}°</span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Geometry */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Geometry</h3>
          
          <div className="space-y-2">
            <Label>Track Width</Label>
            <input 
              type="range" 
              min="40" max="150" 
              value={selectedPiece.width} 
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {(selectedPiece.type === 'straight' || selectedPiece.type === 'startFinish' || selectedPiece.type === 'pitLane' || selectedPiece.type === 'bridge' || selectedPiece.type === 'tunnel' || selectedPiece.type === 'grandstand' || selectedPiece.type === 'grass' || selectedPiece.type === 'gravel' || selectedPiece.type === 'paddock' || selectedPiece.type === 'wall' || selectedPiece.type === 'kerb') && (
            <div className="space-y-2">
              <Label>Length</Label>
              <input 
                type="range" 
                min="50" max="1000" step="10"
                value={selectedPiece.length} 
                onChange={(e) => handleChange('length', Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}

          {(selectedPiece.type === 'curve' || selectedPiece.type === 'sCurve') && (
            <>
              <div className="space-y-2">
                <Label>Radius</Label>
                <input 
                  type="range" 
                  min="50" max="500" step="10"
                  value={selectedPiece.radius} 
                  onChange={(e) => handleChange('radius', Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>Angle</Label>
                <input 
                  type="range" 
                  min="10" max="360" step="5"
                  value={selectedPiece.angle} 
                  onChange={(e) => handleChange('angle', Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </>
          )}
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Styling */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Styling</h3>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <PaintBucket className="w-4 h-4" /> Curb Primary Color
            </Label>
            <div className="flex gap-2 mt-2">
              {['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ffffff'].map(color => (
                <button
                  key={color}
                  onClick={() => handleChange('curbColor', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedPiece.curbColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Advanced</h3>
          <div className="flex items-center justify-between">
            <Label>Lock Piece</Label>
            <input 
              type="checkbox" 
              checked={selectedPiece.isLocked || false} 
              onChange={(e) => handleChange('isLocked', e.target.checked)}
              className="accent-primary w-4 h-4"
            />
          </div>
          <div className="space-y-2">
            <Label>Opacity</Label>
            <input 
              type="range" 
              min="0.1" max="1" step="0.1"
              value={selectedPiece.opacity || 1} 
              onChange={(e) => handleChange('opacity', Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function SplineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 15a4 4 0 0 0-4-4h-2" />
      <path d="M9 11a4 4 0 0 1 4-4h2" />
      <circle cx="5" cy="11" r="2" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="5" cy="15" r="2" />
      <circle cx="19" cy="19" r="2" />
    </svg>
  );
}
