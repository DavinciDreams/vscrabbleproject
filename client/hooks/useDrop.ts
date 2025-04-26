"use client"

import { useState } from 'react';
import type { Position, Tile } from '@/types/game';

export function useDrop() {
  const [dropTarget, setDropTarget] = useState<Position | null>(null);
  
  const handleDrop = (
    e: React.DragEvent,
    position: Position,
    onDrop: (tile: Tile) => void
  ) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    
    try {
      const tile = JSON.parse(data) as Tile;
      setDropTarget(position);
      onDrop(tile);
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };
  
  const getDropTarget = () => dropTarget;
  
  const resetDropTarget = () => {
    setDropTarget(null);
  };
  
  return {
    handleDrop,
    getDropTarget,
    resetDropTarget
  };
}