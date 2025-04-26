"use client"

import { useState } from 'react';
import type { Tile } from '@/types/game';

export function useDrag() {
  const [draggedTile, setDraggedTile] = useState<Tile | null>(null);
  
  const startDrag = (tile: Tile) => {
    setDraggedTile(tile);
  };
  
  const endDrag = () => {
    setDraggedTile(null);
  };
  
  const getDraggedTile = () => draggedTile;
  
  return {
    startDrag,
    endDrag,
    getDraggedTile
  };
}