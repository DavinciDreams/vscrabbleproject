"use client"

import { useState } from 'react';
import { LETTER_VALUES } from '@/lib/constants';
import type { Tile as TileType } from '@/types/game';

interface TileProps {
  tile: TileType;
  onDragStart?: () => boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isPlaced?: boolean;
}

const tileSizeClasses = {
  sm: 'w-8 h-8 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
};

export default function Tile({ 
  tile, 
  onDragStart, 
  showValue = false, 
  size = 'md',
  isPlaced = false 
}: TileProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart && onDragStart()) {
      e.dataTransfer.setData('text/plain', JSON.stringify(tile));
      setIsDragging(true);
    } else {
      e.preventDefault();
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        tile
        ${tileSizeClasses[size]}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isPlaced ? 'bg-amber-300' : ''}
        transition-all duration-200
      `}
    >
      {tile.letter}
      {showValue && (
        <span className="tile-value">{LETTER_VALUES[tile.letter]}</span>
      )}
    </div>
  );
}