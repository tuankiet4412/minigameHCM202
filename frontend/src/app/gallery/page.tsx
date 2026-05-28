'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import Loading from '@/components/ui/Loading';

const fallbackGallery: GalleryImage[] = [
  { id: 1, title: 'Kim Lien Village', description: 'Birthplace in Nghe An', image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600', year: 1890 },
  { id: 2, title: 'Saigon Harbor', description: 'Departure in 1911', image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', year: 1911 },
  { id: 3, title: 'Paris Conference', description: 'Versailles 1919', image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600', year: 1919 },
  { id: 4, title: 'Revolutionary Training', description: 'Guangzhou 1925', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', year: 1925 },
  { id: 5, title: 'CPV Founding', description: 'Hong Kong 1930', image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=600', year: 1930 },
  { id: 6, title: 'Colonial Era', description: 'Life under French rule', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', year: 1900 },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.gallery.list()
      .then((data) => setImages(data as GalleryImage[]))
      .catch(() => setImages(fallbackGallery))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="section-title text-center">Historical Gallery</h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          A visual journey through key moments and places
        </p>

        <div className="masonry-grid mt-12">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="masonry-item group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelected(img)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(img)}
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={img.image_url}
                  alt={img.title}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-charcoal/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-semibold">{img.title}</h3>
                    {img.year && <p className="text-sm text-heritage-gold">{img.year}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image src={selected.image_url} alt={selected.title} fill className="object-cover" />
            </div>
            {selected.year && <p className="mt-2 text-heritage-gold font-medium">{selected.year}</p>}
            {selected.description && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">{selected.description}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
