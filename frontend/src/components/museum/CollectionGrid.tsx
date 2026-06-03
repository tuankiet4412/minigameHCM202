'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { GalleryImage } from '@/lib/types';
import { ArtifactCard } from './ArtifactCard';
import type { FilterCategory } from './MuseumFilterBar';

interface CollectionGridProps {
  images: GalleryImage[];
  filter: FilterCategory;
  sortNewest: boolean;
  viewGrid: boolean;
  onSelect: (img: GalleryImage) => void;
}

export function CollectionGrid({ images, filter, sortNewest, viewGrid, onSelect }: CollectionGridProps) {
  const filtered = useMemo(() => {
    let list = [...images];
    if (filter !== 'all') {
      list = list.filter(img => {
        const cat = (img.category || 'photograph').toLowerCase();
        return cat === filter || (filter === 'photograph' && cat === 'photograph');
      });
    }
    list.sort((a, b) => {
      const ay = a.year || 0;
      const by = b.year || 0;
      return sortNewest ? by - ay : ay - by;
    });
    return list;
  }, [images, filter, sortNewest]);

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="text-5xl mb-4" style={{ opacity: 0.3 }}>🏛</div>
        <div style={{ fontFamily: 'var(--font-playfair)', color: 'rgba(255,255,255,0.3)', fontSize: '1.3rem', marginBottom: '8px' }}>
          Không có hiện vật trong danh mục này
        </div>
        <div style={{ fontFamily: 'var(--font-source)', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
          Hãy chọn danh mục khác
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${filter}-${viewGrid}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={
        viewGrid
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
          : 'flex flex-col gap-3'
      }
    >
      {filtered.map((img, i) => (
        <ArtifactCard
          key={img.id}
          image={img}
          index={i}
          onSelect={onSelect}
          viewGrid={viewGrid}
        />
      ))}
    </motion.div>
  );
}
