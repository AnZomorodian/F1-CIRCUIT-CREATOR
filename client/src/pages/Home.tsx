import React from 'react';
import { Link } from 'wouter';
import { useTracks } from '@/hooks/use-tracks';
import { TrackCard } from '@/components/TrackCard';
import { Button } from '@/components/ui/button';
import { Plus, Flag, Trophy, Target, Loader2, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Home() {
  const { data: tracks, isLoading } = useTracks();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
         <h1 className="font-display font-bold text-xl tracking-wide flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> F1 Designer
         </h1>
         <div className="flex gap-4">
           <Link href="/editor/new">
             <Button size="sm" className="bg-primary hover:bg-primary/80">New Circuit</Button>
           </Link>
         </div>
      </header>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/10">
        {/* Abstract racing line background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <svg className="absolute w-full h-full text-primary" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            <path d="M0,60 Q30,90 60,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 text-sm font-semibold tracking-wide uppercase">
              <Trophy className="w-4 h-4" /> Next-Gen Track Editor
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6">
              Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">Ultimate</span> Circuit
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Experience the world's most advanced web-based F1 track designer. 
              Drag, drop, snap, and customize professional-grade racing lines in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/editor/new">
                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/80 shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] transition-all rounded-full">
                  <Plus className="w-5 h-5 mr-2" /> Create New Circuit
                </Button>
              </Link>
              <a href="#documentation">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 hover:bg-white/5">
                  <Target className="w-5 h-5 mr-2" /> View Documentation
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="max-w-7xl mx-auto px-6 mt-20 py-20 border-b border-white/10">
        <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" /> Documentation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-muted-foreground">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Getting Started</h3>
            <p>1. Click "Create New Circuit" to open the editor.</p>
            <p>2. Drag track pieces from the left toolbox onto the canvas.</p>
            <p>3. Use the right panel to customize lengths, angles, and colors.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Advanced Controls</h3>
            <p><kbd className="px-2 py-1 bg-white/10 rounded">Ctrl + D</kbd> Duplicate selected piece.</p>
            <p><kbd className="px-2 py-1 bg-white/10 rounded">Del / Backspace</kbd> Delete selected piece.</p>
            <p><strong>Mouse Wheel</strong> Zoom in/out of the canvas.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Advanced Simulation</h3>
            <p><strong>Smart Magnet:</strong> Objects auto-rotate and snap to exact coordinates for a professional finish.</p>
            <p><strong>15+ Components:</strong> From DRS straights to safety cars and floodlights.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Community & Sharing</h3>
            <p>Save your creations and they will appear in the Community Circuits gallery. You can delete your own tracks directly from the card.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Professional Controls</h3>
            <p><strong>Locking:</strong> Prevent pieces from being moved accidentally by locking them in the Properties Panel.</p>
            <p><strong>Hotkeys:</strong> Use <code>Ctrl+D</code> to duplicate and <code>Del</code> to remove pieces instantly.</p>
          </div>
        </div>
      </section>

      {/* Community Tracks Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <Flag className="w-8 h-8 text-primary" /> Community Circuits
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[280px] rounded-xl bg-card border border-white/5 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
              </div>
            ))}
          </div>
        ) : !tracks || tracks.length === 0 ? (
          <div className="text-center py-20 bg-card border border-white/5 rounded-2xl">
            <Map className="w-16 h-16 mx-auto text-white/10 mb-4" />
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">No circuits found</h3>
            <p className="text-muted-foreground mb-6">Be the first to design an amazing track!</p>
            <Link href="/editor/new">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Start Designing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-card/30 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight">F1 Designer</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-primary transition-colors">Terms of Service</button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">Terms of Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm leading-relaxed opacity-80">
                  <p>Welcome to F1 Designer. By using our platform, you agree to the following terms:</p>
                  <h4 className="font-bold text-foreground">1. Acceptance of Terms</h4>
                  <p>By accessing or using F1 Designer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                  <h4 className="font-bold text-foreground">2. User Creations</h4>
                  <p>Any track designs created using our tools remain your intellectual property. However, by saving them to our community gallery, you grant F1 Designer a non-exclusive license to display and share your work with other users.</p>
                  <h4 className="font-bold text-foreground">3. Prohibited Conduct</h4>
                  <p>Users are prohibited from using the platform for any illegal activities or to create content that is offensive, defamatory, or violates the rights of others.</p>
                  <h4 className="font-bold text-foreground">4. Limitation of Liability</h4>
                  <p>F1 Designer is provided "as is" without any warranties. We are not liable for any damages resulting from the use or inability to use our service.</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-primary transition-colors">Privacy Policy</button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">Privacy Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm leading-relaxed opacity-80">
                  <p>Your privacy is important to us. This policy outlines how we handle your data:</p>
                  <h4 className="font-bold text-foreground">1. Information We Collect</h4>
                  <p>We collect minimal information necessary to provide our services, including your "Creator Name" (if provided) and the track data you save.</p>
                  <h4 className="font-bold text-foreground">2. How We Use Information</h4>
                  <p>Data is used solely to save your circuit designs and display them in the community gallery. We do not sell your personal information to third parties.</p>
                  <h4 className="font-bold text-foreground">3. Data Storage</h4>
                  <p>Your track designs and associated metadata are stored securely in our database. You can request deletion of your tracks at any time.</p>
                  <h4 className="font-bold text-foreground">4. Contact Us</h4>
                  <p>If you have questions about your data or this policy, please contact us through the Replit project interface.</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-primary transition-colors">Cookie Policy</button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">Cookie Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm leading-relaxed opacity-80">
                  <p>This site uses essential cookies to ensure functionality:</p>
                  <h4 className="font-bold text-foreground">1. Essential Cookies</h4>
                  <p>We use small data files (cookies) to maintain your session and ensure the editor functions correctly. These are required for the application to work.</p>
                  <h4 className="font-bold text-foreground">2. Analytical Cookies</h4>
                  <p>We may use basic analytics to understand how users interact with our track designer to improve the experience.</p>
                  <h4 className="font-bold text-foreground">3. Managing Cookies</h4>
                  <p>Most browsers allow you to control cookies through their settings. However, disabling essential cookies may prevent you from using the designer.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} F1 Designer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
