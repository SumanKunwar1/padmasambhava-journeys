import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

import destBhutan from "@/assets/dest-bhutan.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";
import destJapan from "@/assets/dest-japan.jpg";
import destThailand from "@/assets/dest-thailand.jpg";
import destVietnam from "@/assets/dest-vietnam.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import destBali from "@/assets/dest-bali.jpg";

const blogs = [
  {
    id: 1,
    title: "Top 10 Sacred Buddhist Monasteries You Must Visit",
    excerpt: "Explore the most spiritually significant Buddhist monasteries across the Himalayas, from Bhutan to Ladakh, and discover their profound history.",
    image: destBhutan,
    readTime: "5 min read",
    category: "Pilgrimage",
  },
  {
    id: 2,
    title: "Complete Guide to Spiti Valley Trip",
    excerpt: "Everything you need to know before embarking on a Spiti Valley adventure - best time to visit, must-see places, and travel tips.",
    image: destSpiti,
    readTime: "8 min read",
    category: "Travel Guide",
  },
  {
    id: 3,
    title: "Solo Travel Safety Tips for Women",
    excerpt: "Empowering tips and practical advice for women travelers exploring India and beyond. Stay safe while embracing adventure.",
    image: destLadakh,
    readTime: "6 min read",
    category: "Travel Tips",
  },
  {
    id: 4,
    title: "Exploring Japan's Ancient Temples",
    excerpt: "A spiritual journey through Japan's most iconic temples, from Kyoto's golden pavilions to Nara's sacred deer parks.",
    image: destJapan,
    readTime: "7 min read",
    category: "International",
  },
  {
    id: 5,
    title: "Thailand's Hidden Beaches and Islands",
    excerpt: "Discover secluded paradises away from the tourist crowds. A guide to Thailand's best-kept beach secrets.",
    image: destThailand,
    readTime: "5 min read",
    category: "Beach",
  },
  {
    id: 6,
    title: "Vietnam: A Culinary Journey",
    excerpt: "From street food in Hanoi to fine dining in Ho Chi Minh City, explore Vietnam through its incredible cuisine.",
    image: destVietnam,
    readTime: "6 min read",
    category: "Food & Travel",
  },
  {
    id: 7,
    title: "Dubai Beyond the Glamour",
    excerpt: "Explore the cultural heart of Dubai - traditional souks, historic neighborhoods, and authentic Emirati experiences.",
    image: destDubai,
    readTime: "5 min read",
    category: "City Guide",
  },
  {
    id: 8,
    title: "Georgia: Europe's Best Kept Secret",
    excerpt: "Ancient monasteries, stunning Caucasus mountains, and world-class wine - why Georgia should be on your bucket list.",
    image: destGeorgia,
    readTime: "7 min read",
    category: "Adventure",
  },
  {
    id: 9,
    title: "Bali's Spiritual Side: Temples and Rituals",
    excerpt: "Beyond the beaches, discover Bali's rich spiritual heritage through its ancient temples and traditional ceremonies.",
    image: destBali,
    readTime: "6 min read",
    category: "Pilgrimage",
  },
  {
    id: 10,
    title: "Packing Essentials for Himalayan Treks",
    excerpt: "A comprehensive packing guide for high-altitude treks in the Himalayas. Don't leave home without these essentials.",
    image: destLadakh,
    readTime: "4 min read",
    category: "Travel Tips",
  },
  {
    id: 11,
    title: "Photography Tips for Travel Enthusiasts",
    excerpt: "Capture stunning travel memories with these professional photography tips for landscapes, portraits, and street photography.",
    image: destSpiti,
    readTime: "5 min read",
    category: "Photography",
  },
  {
    id: 12,
    title: "Sustainable Travel: A Beginner's Guide",
    excerpt: "How to travel responsibly and minimize your environmental footprint while still having amazing adventures.",
    image: destBhutan,
    readTime: "6 min read",
    category: "Sustainable Travel",
  },
];

export default function Blogs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
            >
              Travel Stories & Tips
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Discover travel guides, tips, and inspiring stories from our journeys around the world
            </motion.p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/blog/${blog.id}`}
                    className="block bg-card rounded-2xl overflow-hidden card-hover group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
