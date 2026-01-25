import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Users, Award, MapPin, Heart, Target, Eye } from "lucide-react";

import destBhutan from "@/assets/dest-bhutan.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";

const stats = [
  { label: "Happy Travelers", value: "50,000+", icon: Users },
  { label: "Tours Completed", value: "1,200+", icon: MapPin },
  { label: "Years Experience", value: "10+", icon: Award },
  { label: "Destinations", value: "100+", icon: Heart },
];

const teamMembers = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: destBhutan,
    description: "Passionate traveler with 15+ years of experience in curating spiritual journeys.",
  },
  {
    name: "Priya Sharma",
    role: "Operations Head",
    image: destSpiti,
    description: "Expert in logistics and ensuring seamless travel experiences for our guests.",
  },
  {
    name: "Amit Singh",
    role: "Tour Director",
    image: destLadakh,
    description: "Certified guide with deep knowledge of Himalayan culture and traditions.",
  },
];

export default function AboutUs() {
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
              About Padmasambhava Trips
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              We are dedicated to creating meaningful travel experiences that connect you with the spiritual essence of the Himalayas and beyond.
            </motion.p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2016, Padmasambhava Trips was born from a deep passion for travel and spirituality. Our journey began with a simple mission: to share the transformative power of pilgrimage and adventure travel with fellow seekers.
                </p>
                <p className="text-muted-foreground mb-4">
                  Named after the great Buddhist master Padmasambhava, who brought Buddhism to Tibet, we strive to guide our travelers on journeys that nourish both the body and soul.
                </p>
                <p className="text-muted-foreground">
                  Today, we've grown into a trusted travel partner for thousands of travelers, offering curated experiences across India and international destinations including Bhutan, Nepal, Tibet, and more.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={destBhutan}
                  alt="Our journey"
                  className="w-full h-[400px] object-cover rounded-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-10 h-10 mx-auto text-primary mb-3" />
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border border-border"
              >
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To create transformative travel experiences that connect people with sacred places, diverse cultures, and their inner selves. We believe travel is not just about destinations—it's about the journey within.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border"
              >
                <Eye className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the most trusted name in spiritual and adventure travel, known for our authentic experiences, exceptional service, and commitment to sustainable tourism practices.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-muted">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our dedicated team of travel enthusiasts is here to make your journey unforgettable.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </div>
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
