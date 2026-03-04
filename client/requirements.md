## Packages
react-konva | High performance canvas rendering for the track editor
konva | Core canvas engine required by react-konva
uuid | Generating unique IDs for track pieces
@types/uuid | Type definitions for uuid
framer-motion | Smooth animations and page transitions

## Notes
- Using HTML5 drag-and-drop to move items from the toolbox into the Konva canvas.
- Konva handles the internal dragging, selection, and rotation of track pieces.
- Track data is serialized to JSON and stored directly in the `trackData` PostgreSQL column.
