'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

const MuseumGallery3D = dynamic(() => import('@/components/three/MuseumGallery3D'), { ssr: false });

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

  if (loading) return <PageSkeleton />;

  return (
    <div className="pt-24 pb-section">
      <section className="px-4">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-heritage-gold">Digital Museum</p>
          <h1 className="section-title mt-2">Historical Gallery</h1>
          <p className="mt-4 text-muted-foreground">
            An immersive collection of artifacts and moments from the journey
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-glass glass-card">
          <MuseumGallery3D count={images.length} />
        </div>

        <div className="masonry-grid mx-auto mt-16 max-w-6xl">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="masonry-item group cursor-pointer"
              onClick={() => setSelected(img)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(img)}
            >
              <div className="museum-card overflow-hidden p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={img.image_url}
                    alt={img.title}
                    width={600}
                    height={400}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-heritage-charcoal/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
                    <span className="text-xs font-bold text-heritage-gold">{img.year}</span>
                    <h3 className="font-display text-lg font-semibold text-white">{img.title}</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <span className="font-bold text-heritage-gold">{selected.year}</span>
            <div className="relative mt-4 h-64 w-full overflow-hidden rounded-glass">
              <Image src={selected.image_url} alt={selected.title} fill className="object-cover" />
            </div>
            <p className="mt-4 text-muted-foreground">{selected.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
