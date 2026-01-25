import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

import destBhutan from "@/assets/dest-bhutan.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";

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
];

export function BlogsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Related Blogs
          </h2>
          <Button variant="outline" className="self-start sm:self-center">
            View All Blogs
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
  );
}
