import React from 'react';
import { Track } from '@shared/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Clock, ArrowRight, Flag, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { useDeleteTrack } from '@/hooks/use-tracks';
import { useToast } from '@/hooks/use-toast';

interface Props {
  track: Track;
}

export const TrackCard: React.FC<Props> = ({ track }) => {
  const deleteMutation = useDeleteTrack();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this circuit?')) {
      try {
        await deleteMutation.mutateAsync(track.id);
        toast({ title: "Track Deleted", description: "The circuit has been removed." });
      } catch (error) {
        toast({ title: "Delete Failed", variant: "destructive" });
      }
    }
  };

  // Try to parse pieces to count them
  let pieceCount = 0;
  try {
    const data = track.trackData as any[];
    pieceCount = data?.length || 0;
  } catch (e) {}

  return (
    <Card className="bg-card border-white/10 hover:border-primary/50 transition-all duration-300 group overflow-hidden shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
      <div className="h-32 bg-gradient-to-br from-black to-neutral-900 relative border-b border-white/10 flex items-center justify-center overflow-hidden">
        <Map className="w-16 h-16 text-white/5 group-hover:scale-110 group-hover:text-primary/20 transition-all duration-500" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-xl text-foreground truncate">{track.title}</h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 ml-2 shrink-0">
            {pieceCount} Sectors
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Flag className="w-3.5 h-3.5 mr-1.5" />
          <span>By {track.creatorName}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground/70">
          <Clock className="w-3 h-3 mr-1" />
          {track.createdAt ? formatDistanceToNow(new Date(track.createdAt), { addSuffix: true }) : 'Unknown date'}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Link href={`/editor/${track.id}`} className="w-full">
          <Button className="w-full bg-white/5 hover:bg-primary text-foreground group-hover:text-primary-foreground border border-white/10 group-hover:border-primary transition-all">
            Load Circuit <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
