// src/components/home/WatchOurTrip.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOME_VIDEOS, SOCIAL_LINKS, type HomeVideo } from "@/lib/home-sections";

// Shows the thumbnail first and only loads the YouTube player on click, so the
// homepage does not pay for several embedded players nobody pressed play on.
function VideoCard({ video }: { video: HomeVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal shadow-md">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group absolute inset-0 w-full h-full"
          aria-label={`Play video: ${video.title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <span className="gradient-overlay" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-primary shadow-lg transition-transform group-hover:scale-110">
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </span>
          </span>
          <span className="absolute bottom-0 left-0 right-0 p-3 text-left text-sm font-medium text-white line-clamp-2">
            {video.title}
          </span>
        </button>
      )}
    </div>
  );
}

export function WatchOurTrip() {
  return (
    <section className="section-padding bg-background" aria-labelledby="watch-heading" data-testid="watch-our-trip">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 id="watch-heading" className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Watch Our Trip
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            See the journeys, the prayers and the smiles from our recent departures.
          </p>
        </motion.div>

        {HOME_VIDEOS.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10">
            {HOME_VIDEOS.map((video) => (
              <VideoCard key={video.youtubeId} video={video} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {SOCIAL_LINKS.instagram && (
            <Button asChild variant="outline">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram />
                Watch on Instagram
              </a>
            </Button>
          )}
          {SOCIAL_LINKS.facebook && (
            <Button asChild variant="outline">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook />
                Watch on Facebook
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
