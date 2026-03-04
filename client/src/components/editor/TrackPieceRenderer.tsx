import React, { useRef, useEffect } from 'react';
import { Group, Rect, Arc, Line, Text, Circle } from 'react-konva';
import { TrackPiece } from '@/lib/track-types';

interface Props {
  piece: TrackPiece;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (piece: TrackPiece) => void;
  onDragEnd?: (e: any) => void;
}

export const TrackPieceRenderer: React.FC<Props> = ({ piece, isSelected, onSelect, onChange, onDragEnd }) => {
  const groupRef = useRef<any>(null);

  const handleDragEnd = (e: any) => {
    onChange({
      ...piece,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = groupRef.current;
    if (!node) return;
    
    // We only allow rotation, but just in case, reset scale to 1 to prevent distortion
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...piece,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      // If we allowed resizing, we'd multiply dimensions by scale here
    });
  };

  const ASPHALT_COLOR = '#1f1f22';
  const CURB_DASH = [20, 20];

  return (
    <Group
      ref={groupRef}
      id={piece.id}
      x={piece.x}
      y={piece.y}
      rotation={piece.rotation}
      draggable={!piece.isLocked}
      onClick={() => onSelect(piece.id)}
      onTap={() => onSelect(piece.id)}
      onDragStart={(e) => {
        if (piece.isLocked) {
          e.target.stopDrag();
        } else {
          onSelect(piece.id);
        }
      }}
      onDragEnd={(e) => {
        handleDragEnd(e);
        if (onDragEnd) onDragEnd(e);
      }}
      onTransformEnd={handleTransformEnd}
      opacity={piece.opacity ?? 1}
      shadowColor={isSelected ? '#f43f5e' : 'black'}
      shadowBlur={isSelected ? 15 : 10}
      shadowOpacity={isSelected ? 0.8 : 0.3}
    >
      {piece.type === 'safetyCar' && (
        <Group>
          <Rect width={40} height={20} fill="#facc15" cornerRadius={2} />
          <Rect width={10} height={4} x={15} y={-4} fill="#ef4444" />
          <Text text="SAFETY" width={40} align="center" y={22} fill="#facc15" fontSize={8} fontStyle="bold" />
        </Group>
      )}

      {piece.type === 'wall' && (
        <Rect width={piece.length} height={10} fill="#94a3b8" stroke="#475569" strokeWidth={1} />
      )}

      {piece.type === 'floodlight' && (
        <Group>
          <Circle radius={5} fill="#334155" />
          <Circle radius={15} fill="#fde047" opacity={0.3} />
          <Line points={[0, 0, 0, 50]} stroke="#334155" strokeWidth={3} />
        </Group>
      )}

      {piece.type === 'tireStack' && (
        <Group>
          {Array.from({length: 3}).map((_, i) => (
            <Circle key={i} x={i * 12} radius={8} fill="#18181b" stroke="#3f3f46" strokeWidth={2} />
          ))}
        </Group>
      )}

      {piece.type === 'kerb' && (
        <Rect width={piece.length} height={15} fill={piece.curbColor} dash={[10, 10]} stroke="#fff" strokeWidth={1} />
      )}

      {piece.type === 'grass' && (
        <Rect width={piece.length} height={piece.width} fill="#2d5a27" cornerRadius={8} opacity={0.8} />
      )}

      {piece.type === 'gravel' && (
        <Rect width={piece.length} height={piece.width} fill="#c2b280" cornerRadius={4} opacity={0.6} dash={[2, 2]} />
      )}

      {piece.type === 'paddock' && (
        <Group>
          <Rect width={piece.length} height={piece.width} fill="#333" cornerRadius={2} />
          <Rect width={piece.length - 20} height={piece.width - 20} x={10} y={10} fill="#444" cornerRadius={1} />
          <Text text="PADDOCK" width={piece.length} align="center" y={piece.width/2 - 5} fill="white" fontSize={10} opacity={0.3} />
        </Group>
      )}

      {(piece.type === 'straight' || piece.type === 'startFinish' || piece.type === 'pitLane' || piece.type === 'bridge' || piece.type === 'tunnel') && (
        <>
          {/* Asphalt */}
          <Rect 
            width={piece.length} 
            height={piece.width} 
            fill={piece.type === 'pitLane' ? '#2a2a2d' : piece.type === 'tunnel' ? '#0a0a0c' : ASPHALT_COLOR} 
            cornerRadius={2}
          />

          {piece.type === 'bridge' && (
            <Rect 
              width={piece.length} 
              height={piece.width + 20} 
              y={-10}
              fill="#333" 
              opacity={0.3}
              cornerRadius={2}
            />
          )}
          
          {/* Top Curb */}
          <Line points={[0, 0, piece.length, 0]} stroke={piece.curbColor} strokeWidth={8} dash={CURB_DASH} />
          <Line points={[0, 0, piece.length, 0]} stroke="#ffffff" strokeWidth={8} dash={CURB_DASH} dashOffset={20} />
          
          {/* Bottom Curb */}
          <Line points={[0, piece.width, piece.length, piece.width]} stroke={piece.curbColor} strokeWidth={8} dash={CURB_DASH} />
          <Line points={[0, piece.width, piece.length, piece.width]} stroke="#ffffff" strokeWidth={8} dash={CURB_DASH} dashOffset={20} />

          {/* Start/Finish Decoration */}
          {piece.type === 'startFinish' && (
            <Group x={piece.length / 2 - 30} y={piece.width / 2 - 10}>
              <Rect width={60} height={20} fill="white" cornerRadius={4} />
              <Text text="START" width={60} align="center" y={4} fill="black" fontStyle="bold" fontSize={12} fontFamily="Outfit" />
            </Group>
          )}

          {/* Pit Lane Decoration */}
          {piece.type === 'pitLane' && (
            <Group x={piece.length / 2 - 20} y={piece.width / 2 - 8}>
              <Text text="PITS" width={40} align="center" fill="white" opacity={0.5} fontStyle="bold" fontSize={10} fontFamily="Outfit" />
            </Group>
          )}
        </>
      )}

      {piece.type === 'grandstand' && (
        <Group>
          <Rect width={piece.length} height={piece.width} fill="#444" cornerRadius={4} />
          <Text text="GRANDSTAND" width={piece.length} align="center" y={piece.width/2 - 5} fill="white" fontSize={10} fontStyle="bold" />
          {Array.from({length: 5}).map((_, i) => (
            <Line key={i} points={[0, (i+1)*(piece.width/6), piece.length, (i+1)*(piece.width/6)]} stroke="#555" strokeWidth={1} />
          ))}
        </Group>
      )}

      {(piece.type === 'curve' || piece.type === 'sCurve') && (
        <>
          {/* Asphalt */}
          <Arc
            innerRadius={piece.radius - piece.width / 2}
            outerRadius={piece.radius + piece.width / 2}
            angle={piece.angle}
            fill={ASPHALT_COLOR}
          />
          
          {/* S-Curve has an extra arc bit visually or just a different angle by default */}
          {piece.type === 'sCurve' && (
            <Text text="~" x={piece.radius} y={0} fill="white" opacity={0.2} fontSize={20} />
          )}

          {/* Inner Curb */}
          <Arc
            innerRadius={piece.radius - piece.width / 2}
            outerRadius={piece.radius - piece.width / 2}
            angle={piece.angle}
            stroke={piece.curbColor}
            strokeWidth={8}
            dash={CURB_DASH}
          />
          <Arc
            innerRadius={piece.radius - piece.width / 2}
            outerRadius={piece.radius - piece.width / 2}
            angle={piece.angle}
            stroke="#ffffff"
            strokeWidth={8}
            dash={CURB_DASH}
            dashOffset={20}
          />

          {/* Outer Curb */}
          <Arc
            innerRadius={piece.radius + piece.width / 2}
            outerRadius={piece.radius + piece.width / 2}
            angle={piece.angle}
            stroke={piece.curbColor}
            strokeWidth={8}
            dash={CURB_DASH}
          />
          <Arc
            innerRadius={piece.radius + piece.width / 2}
            outerRadius={piece.radius + piece.width / 2}
            angle={piece.angle}
            stroke="#ffffff"
            strokeWidth={8}
            dash={CURB_DASH}
            dashOffset={20}
          />
        </>
      )}
    </Group>
  );
};
