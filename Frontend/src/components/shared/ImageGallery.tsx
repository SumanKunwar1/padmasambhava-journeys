// src/components/shared/ImageGallery.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  maxDisplay?: number;
}

export function ImageGallery({ images, maxDisplay = 6 }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  const displayImages = images.slice(0, maxDisplay);
  const remainingCount = images.length - maxDisplay;

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer group ${
              index === maxDisplay - 1 && remainingCount > 0 ? 'relative' : ''
            }`}
            onClick={() => openImage(index)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            
            {/* Show +N overlay on last image if there are more */}
            {index === maxDisplay - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center text-white">
                  <Plus className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-2xl font-bold">+{remainingCount}</p>
                  <p className="text-sm">more photos</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            {/* Close Button */}
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl max-h-[90vh] mx-auto px-16"
            >
              <img
                src={images[selectedImageIndex]}
                alt={`Full size image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Keyboard Navigation */}
            <div
              className="absolute inset-0"
              onKeyDown={(e) => {
                if (e.key === 'Escape') closeImage();
                if (e.key === 'ArrowLeft') goToPrevious();
                if (e.key === 'ArrowRight') goToNext();
              }}
              tabIndex={0}
            />
          </div>
        )}
      </AnimatePresence>

      {/* View All Modal */}
      <AnimatePresence>
        {showAllModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="pointer-events-auto w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                  <h3 className="text-xl font-display font-semibold">
                    All Photos ({images.length})
                  </h3>
                  <button
                    onClick={() => setShowAllModal(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Grid */}
                <div className="overflow-y-auto flex-1 p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => {
                          setShowAllModal(false);
                          openImage(index);
                        }}
                      >
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}