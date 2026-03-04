# F1 Track Designer 🏎️

An advanced, Canva-style web application for designing professional Formula 1 circuits.

## Features

### 🏁 Interactive Canvas Editor
- **Drag & Drop**: Seamlessly add track components from the toolbox to the infinite blueprint canvas.
- **Precision Customization**: Tweak every aspect of your track pieces including length, radius, angle, and curb styles.
- **Magnetic Snapping (New!)**: Components now snap together like magnets, making it easier to create continuous, smooth racing lines.
- **Zoom & Pan**: Navigation controls (mouse wheel to zoom, drag to pan) allow for designing massive, complex circuits.

### 🛠️ Track Components
- **Straights**: High-speed sectors with customizable lengths.
- **Hairpins**: Tight, heavy-braking zones for overtaking opportunities.
- **Fast Corners**: High-G sweeping curves that test car aerodynamics.
- **Chicanes**: Rapid direction changes requiring precision.
- **Start/Finish**: The grid and timing line for your circuit.
- **S-Curves (New!)**: Flowing sequences of corners.
- **Pit Lane (New!)**: Dedicated entry and exit for pit stops.

### 🌐 Community & Persistence
- **Save & Load**: Save your designs to a persistent database and load them anytime to continue editing.
- **Community Circuits**: Browse and load tracks created by other designers in the community.
- **Circuit Management**: Easily delete your circuits from the community list.

## Technical Architecture

- **Frontend**: React with TypeScript, Vite, and Tailwind CSS.
- **Canvas Engine**: [Konva](https://konvajs.org/) and [react-konva](https://github.com/konvajs/react-konva) for high-performance 2D rendering.
- **State Management**: React Query for API data and local state for editor interactions.
- **Backend**: Express.js server providing a RESTful API.
- **Database**: PostgreSQL (via Drizzle ORM) for persistent storage.
- **Animations**: Framer Motion for smooth UI transitions.

## Updates (v2.0)
1. **Automatic Magnet Engine**: Pieces now auto-align rotation and position upon snapping.
2. **12+ New Objects**: Added Safety Car, Armco Walls, Tire Stacks, Floodlights, etc.
3. **Lock System**: Lock objects to prevent accidental movement.
4. **Opacity Control**: Create transparent or ghost pieces for layered designs.
5. **Advanced Documentation**: Expanded in-app guides.
6. **Hotkeys**: `Ctrl+D` (Duplicate), `Del` (Remove).
7. **Responsive UI**: Smoother sidebars and backdrop blur effects.
8. **Grid View**: Better carbon-fibre background for precision.
9. ** community Deletion**: Users can manage their shared tracks.
10. **Pit Lane Logic**: Specialized snapping for pit entry/exit.
11. **Performance**: Optimized Konva layer drawing.
12. **Local Persistence**: Integrated DATABASE.JSON for local backups.

## Designer Shortcuts
- `Ctrl + D`: Duplicate the currently selected track piece.
- `Delete` / `Backspace`: Remove the selected piece from the canvas.
- `Mouse Wheel`: Precision zoom for complex circuit sectors.

## Environment Variables
- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `SESSION_SECRET`: Used for secure session management.

## Data Model

Tracks are stored with the following schema:
- `id`: Unique identifier
- `title`: Name of the circuit
- `creatorName`: Designer's name
- `description`: Circuit details
- `trackData`: JSON object containing the serialized canvas state (piece types, positions, rotations, and properties)
- `createdAt`: Timestamp of creation

## Getting Started

1. **Launch the Editor**: Click "Create New Circuit" from the home page.
2. **Build**: Drag pieces from the left sidebar onto the canvas.
3. **Connect**: Bring pieces close to each other to trigger the magnetic snap.
4. **Fine-tune**: Select a piece to adjust its properties in the right-hand panel.
5. **Save**: Use the "Save Circuit" button to name your creation and store it.
