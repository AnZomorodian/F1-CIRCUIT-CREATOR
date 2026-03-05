import React from 'react';
import { Minus, Spline, FlagTriangleRight, Navigation, Layout, Landmark, Construction, Trees, Grid3X3, Tent, Car, Square, Hash, CircleDot, Lightbulb } from 'lucide-react';

const TOOLS = [
  { id: 'straight', name: 'Straight', icon: Minus, desc: 'High speed sector' },
  { id: 'hairpin', name: 'Hairpin', icon: Navigation, desc: 'Heavy braking zone' },
  { id: 'fastCorner', name: 'Fast Corner', icon: Spline, desc: 'High-G sweeping curve' },
  { id: 'chicane', name: 'Chicane', icon: Spline, desc: 'Quick direction change' },
  { id: 'sCurve', name: 'S-Curve', icon: Spline, desc: 'Flowing corner sequence' },
  { id: 'pitLane', name: 'Pit Lane', icon: Navigation, desc: 'Service area' },
  { id: 'startFinish', name: 'Start/Finish', icon: FlagTriangleRight, desc: 'Main straight & grid' },
  { id: 'bridge', name: 'Bridge', icon: Construction, desc: 'Elevated track section' },
  { id: 'tunnel', name: 'Tunnel', icon: Layout, desc: 'Underground passage' },
  { id: 'grandstand', name: 'Grandstand', icon: Landmark, desc: 'Spectator seating' },
  { id: 'grass', name: 'Grass', icon: Trees, desc: 'Infield decoration' },
  { id: 'gravel', name: 'Gravel', icon: Grid3X3, desc: 'Run-off area' },
  { id: 'paddock', name: 'Paddock', icon: Tent, desc: 'Team hospitality' },
  { id: 'safetyCar', name: 'Safety Car', icon: Car, desc: 'Emergency vehicle' },
  { id: 'kerb', name: 'Pro Kerb', icon: Hash, desc: 'Special rumble strip' },
  { id: 'wall', name: 'Armco Wall', icon: Square, desc: 'Safety barrier' },
  { id: 'tireStack', name: 'Tire Stack', icon: CircleDot, desc: 'Soft barrier' },
  { id: 'floodlight', name: 'Floodlight', icon: Lightbulb, desc: 'Night racing' },
  { id: 'tree', name: 'Forest Tree', icon: Trees, desc: 'Trackside scenery' },
  { id: 'safetyBarrier', name: 'Tecpro Barrier', icon: Square, desc: 'Modern safety' },
];

export const Toolbox: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('trackPieceType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-72 border-r border-white/10 bg-card/80 backdrop-blur-xl flex flex-col z-10 shadow-2xl shadow-black/50">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-display font-bold text-foreground">Track Components</h2>
        <p className="text-sm text-muted-foreground mt-1">Drag and drop onto canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tool.id)}
              className="group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-black/50 text-primary group-hover:text-white group-hover:bg-primary transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
