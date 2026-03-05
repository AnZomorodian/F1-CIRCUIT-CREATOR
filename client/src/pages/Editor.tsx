import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Stage, Layer, Transformer } from 'react-konva';
import { TrackPiece, createPiece } from '@/lib/track-types';
import { TrackPieceRenderer } from '@/components/editor/TrackPieceRenderer';
import { Toolbox } from '@/components/editor/Toolbox';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { useTrack, useCreateTrack, useUpdateTrack } from '@/hooks/use-tracks';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Loader2, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Editor() {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const isNew = params.id === 'new';
  const trackId = !isNew ? Number(params.id) : null;

  const { data: trackData, isLoading } = useTrack(trackId);
  const createMutation = useCreateTrack();
  const updateMutation = useUpdateTrack();
  const { toast } = useToast();

  const [pieces, setPieces] = useState<TrackPiece[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [undoStack, setUndoStack] = useState<TrackPiece[][]>([]);
  const [redoStack, setRedoStack] = useState<TrackPiece[][]>([]);

  const [autoConnect, setAutoConnect] = useState(false);

  const GRID_SIZE = 50;
  
  const saveState = () => {
    setUndoStack(prev => [...prev, [...pieces]].slice(-20));
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, [...pieces]]);
    setUndoStack(prev => prev.slice(0, -1));
    setPieces(previous);
    toast({ title: "Undo" });
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, [...pieces]]);
    setRedoStack(prev => prev.slice(0, -1));
    setPieces(next);
    toast({ title: "Redo" });
  };
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('Anonymous Racer');

  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Load existing track data
  useEffect(() => {
    if (trackData && !isNew) {
      setTitle(trackData.title);
      setCreatorName(trackData.creatorName);
      if (Array.isArray(trackData.trackData)) {
        setPieces(trackData.trackData as TrackPiece[]);
      }
    }
  }, [trackData, isNew]);

  // Connect transformer to selected node
  useEffect(() => {
    if (selectedId && trRef.current && stageRef.current) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne('#' + selectedId);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, pieces]); // Re-run when pieces change to maintain handles

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('trackPieceType');
    if (!type || !stageRef.current) return;

    stageRef.current.setPointersPositions(e);
    const pos = stageRef.current.getPointerPosition();
    const transform = stageRef.current.getAbsoluteTransform().copy().invert();
    const relPos = transform.point(pos);

    const newPiece = createPiece(type, relPos.x, relPos.y);
    saveState();
    setPieces([...pieces, newPiece]);
    setSelectedId(newPiece.id);
  };

  const handleCanvasClick = (e: any) => {
    // Deselect if clicking on empty stage
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const duplicatePiece = () => {
    if (!selectedId) return;
    const piece = pieces.find(p => p.id === selectedId);
    if (!piece) return;
    saveState();
    const newPiece = { ...piece, id: Math.random().toString(36).substr(2, 9), x: piece.x + 20, y: piece.y + 20 };
    setPieces([...pieces, newPiece]);
    setSelectedId(newPiece.id);
    toast({ title: "Piece Duplicated" });
  };

  const clearCanvas = () => {
    if (confirm("Are you sure you want to clear the entire canvas?")) {
      saveState();
      setPieces([]);
      setSelectedId(null);
      toast({ title: "Canvas Cleared" });
    }
  };

  const deletePiece = (id: string) => {
    saveState();
    setPieces(pieces.filter(p => p.id !== id));
    setSelectedId(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedId) {
        deletePiece(selectedId);
      }
    }
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      duplicatePiece();
    }
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
    }
    if (e.key.startsWith('Arrow') && selectedId) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      setPieces(prev => prev.map(p => {
        if (p.id === selectedId) {
          let nx = p.x;
          let ny = p.y;
          if (e.key === 'ArrowLeft') nx -= step;
          if (e.key === 'ArrowRight') nx += step;
          if (e.key === 'ArrowUp') ny -= step;
          if (e.key === 'ArrowDown') ny += step;
          return { ...p, x: nx, y: ny };
        }
        return p;
      }));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, pieces]);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  };

  const handleDragEnd = (e: any, id: string) => {
    const piece = pieces.find(p => p.id === id);
    if (!piece) return;

    let newX = e.target.x();
    let newY = e.target.y();

    if (autoConnect) {
      // Magnetic Snapping Logic
      const SNAP_THRESHOLD = 50; // Increased threshold for better feel
      
      for (const other of pieces) {
        if (other.id === id) continue;

        const getPoints = (p: TrackPiece) => {
          const rad = (p.rotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          
          // Start point (p1)
          const p1 = { x: p.x, y: p.y };
          
          // End point (p2)
          let p2 = { x: p.x, y: p.y };
          
          if (p.type === 'curve' || p.type === 'sCurve') {
             const endRad = ((p.rotation + p.angle) * Math.PI) / 180;
             p2.x = p.x + p.radius * Math.cos(endRad);
             p2.y = p.y + p.radius * Math.sin(endRad);
          } else {
             p2.x = p.x + p.length * cos;
             p2.y = p.y + p.length * sin;
          }

          return { p1, p2 };
        };

        const my = getPoints({ ...piece, x: newX, y: newY });
        const target = getPoints(other);

        const dist = (a: any, b: any) => Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);

        // Snap logic: Try to connect my start to their end, or my end to their start
        if (dist(my.p1, target.p2) < SNAP_THRESHOLD) {
          newX = target.p2.x;
          newY = target.p2.y;
          // Also snap rotation to match or continue the flow
          // For a seamless connection, my rotation should align with the 'exit' angle of the previous piece
          const targetExitRotation = other.type === 'curve' || other.type === 'sCurve' ? other.rotation + other.angle : other.rotation;
          piece.rotation = targetExitRotation;
          break;
        } else if (dist(my.p2, target.p1) < SNAP_THRESHOLD) {
          const myPoints = getPoints(piece);
          const offset = { x: myPoints.p2.x - piece.x, y: myPoints.p2.y - piece.y };
          newX = target.p1.x - offset.x;
          newY = target.p1.y - offset.y;
          break;
        }
      }
    }

    setPieces(pieces.map(p => {
      if (p.id === id) {
        return { ...p, x: newX, y: newY };
      }
      return p;
    }));
    saveState();
  };

  const handleDragStart = (e: any) => {
    const id = e.target.id();
    const piece = pieces.find(p => p.id === id);
    if (piece?.isLocked) {
      e.target.stopDrag();
      toast({ 
        title: "Piece Locked", 
        description: "Unlock this piece in the Properties Panel to move it.",
        variant: "destructive"
      });
    }
    setSelectedId(id);
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: title || "Untitled Circuit",
        creatorName,
        description: "Created in F1 Track Designer",
        trackData: pieces
      };

      if (isNew) {
        const res = await createMutation.mutateAsync(payload);
        toast({ title: "Track Created!", description: "Your circuit is now saved." });
        setSaveDialogOpen(false);
        setLocation(`/editor/${res.id}`);
      } else {
        await updateMutation.mutateAsync({ id: trackId!, ...payload });
        toast({ title: "Track Saved!", description: "Updates applied successfully." });
        setSaveDialogOpen(false);
      }
    } catch (error) {
      toast({ title: "Save Failed", description: "There was an error saving the track.", variant: "destructive" });
    }
  };

  const selectedPiece = pieces.find(p => p.id === selectedId) || null;

  const totalLength = pieces.reduce((acc, p) => {
    if (p.type === 'curve' || p.type === 'sCurve') {
      return acc + (2 * Math.PI * p.radius * (p.angle / 360));
    }
    return acc + (p.length || 0);
  }, 0);

  const exportAsImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = `${title || 'circuit'}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Image Exported" });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-card/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')} className="hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1.5 border border-white/5">
            <span className="text-xs font-mono text-muted-foreground uppercase">Length</span>
            <span className="text-sm font-bold text-primary">{(totalLength / 10).toFixed(1)}m</span>
          </div>
          <Button variant="outline" size="sm" onClick={exportAsImage} className="border-white/10 hover:bg-white/5 ml-2">
            Export PNG
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAutoConnect(!autoConnect)} 
            className={`border-white/10 ml-2 ${autoConnect ? 'bg-primary/20 text-primary border-primary/50' : 'opacity-50'}`}
          >
            Auto-Snap {autoConnect ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={clearCanvas} className="border-destructive/50 text-destructive hover:bg-destructive/10 ml-2">
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground mr-4">
            {isNew ? 'Unsaved Draft' : title}
          </span>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/80 text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                <Save className="w-4 h-4 mr-2" /> Save Circuit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border border-white/10">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Save Circuit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Track Name</Label>
                  <Input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Silverstone V2"
                    className="bg-background border-white/10 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Creator Name</Label>
                  <Input 
                    value={creatorName} 
                    onChange={e => setCreatorName(e.target.value)} 
                    placeholder="Your name"
                    className="bg-background border-white/10 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)} className="border-white/10">Cancel</Button>
                <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="bg-primary hover:bg-primary/90">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex row overflow-hidden">
        <Toolbox />
        
        <div 
          className="flex-1 relative bg-blueprint overflow-hidden"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Instructions overlay */}
          {pieces.length === 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center animate-pulse">
                <p className="text-xl font-display font-medium text-white/80">Drag components here to start building</p>
                <p className="text-sm text-white/50 mt-2">Scroll to zoom, drag background to pan</p>
              </div>
            </div>
          )}

          <Stage
            ref={stageRef}
            width={window.innerWidth - 288 - 320} // Subtracting sidebars approx width
            height={window.innerHeight - 64}
            onMouseDown={handleCanvasClick}
            onTouchStart={handleCanvasClick}
            onWheel={handleWheel}
            draggable // Allows panning
            className="cursor-crosshair active:cursor-grabbing"
          >
            <Layer>
              {showGrid && Array.from({ length: 40 }).map((_, i) => (
                <React.Fragment key={`grid-${i}`}>
                  <rect width={5000} height={1} x={0} y={i * GRID_SIZE} fill="rgba(255,255,255,0.05)" />
                  <rect width={1} height={5000} x={i * GRID_SIZE} y={0} fill="rgba(255,255,255,0.05)" />
                </React.Fragment>
              ))}
              {pieces.map((piece) => (
                <TrackPieceRenderer
                  key={piece.id}
                  piece={piece}
                  isSelected={piece.id === selectedId}
                  onSelect={setSelectedId}
                  onChange={(updated) => {
                    setPieces(pieces.map(p => p.id === updated.id ? updated : p));
                  }}
                  onDragEnd={(e) => handleDragEnd(e, piece.id)}
                />
              ))}
              <Transformer 
                ref={trRef} 
                resizeEnabled={false} 
                rotateEnabled={true}
                borderStroke="#f43f5e"
                anchorStroke="#f43f5e"
                anchorFill="#ffffff"
                anchorSize={12}
                anchorCornerRadius={6}
              />
            </Layer>
          </Stage>
        </div>

        <PropertiesPanel 
          selectedPiece={selectedPiece}
          onChange={(updated) => {
            saveState();
            setPieces(pieces.map(p => p.id === updated.id ? updated : p));
          }}
          onDelete={deletePiece}
        />
      </div>
    </div>
  );
}
