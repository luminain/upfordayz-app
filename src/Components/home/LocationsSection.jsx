import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Phone } from 'lucide-react';

const LOCATIONS = [
  {
    name: 'Polk St',
    address: '1801 Polk St',
    city: 'San Francisco, CA 94109',
    phone: '(415) 555-0101',
    hours: 'Mon–Fri 6:30AM–7PM\nSat–Sun 7AM–6PM',
    mapsUrl: 'https://maps.google.com/?q=1801+Polk+St+San+Francisco+CA',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.5!2d-122.4215!3d37.7946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580e0e13a7b3f%3A0x1!2s1801+Polk+St%2C+San+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1',
    color: '#E76F51',
    bg: 'from-[#2C1E14] to-[#3B2A1C]',
    tag: 'Russian Hill',
  },
  {
    name: 'Valencia St',
    address: '1198 Valencia St',
    city: 'San Francisco, CA 94110',
    phone: '(415) 555-0202',
    hours: 'Mon–Fri 7AM–7PM\nSat–Sun 8AM–5PM',
    mapsUrl: 'https://maps.google.com/?q=1198+Valencia+St+San+Francisco+CA',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2!2d-122.4213!3d37.7566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e3b5b5b5b5b%3A0x1!2s1198+Valencia+St%2C+San+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1',
    color: '#D4A574',
    bg: 'from-[#1E2A10] to-[#2A3A18]',
    tag: 'Mission District',
  },
];

export default function LocationsSection() {
  return (
    <section id="home-bottom-locations" className="bg-espresso px-5 pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <span className="font-display text-citrus text-xs tracking-[0.3em] uppercase">Visit Us</span>
        <h2 className="font-heading text-cream text-2xl font-bold mt-2">Our Locations</h2>
        <p className="text-cream/40 text-sm mt-1 font-body">Two cozy spots in San Francisco</p>
      </motion.div>

      <div className="flex flex-col gap-5 max-w-lg mx-auto">
        {LOCATIONS.map((loc, i) => (
          <motion.div
            key={loc.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`rounded-3xl bg-gradient-to-br ${loc.bg} border border-white/5 overflow-hidden`}
          >
            {/* Map */}
            <div className="w-full h-40 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#1E1B18] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: loc.color }} />
                  <p className="text-cream/60 text-xs font-display">{loc.address}</p>
                </div>
              </div>
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#2C1E14] to-transparent" />
              {/* Tag */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-display font-semibold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: loc.color + '33', border: `1px solid ${loc.color}44` }}>
                  {loc.tag}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 pt-3">
              <h3 className="font-heading text-cream text-xl font-bold">{loc.name}</h3>

              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: loc.color }} />
                  <div>
                    <p className="text-cream/80 text-xs font-display">{loc.address}</p>
                    <p className="text-cream/40 text-xs font-display">{loc.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: loc.color }} />
                  <p className="text-cream/60 text-xs font-display whitespace-pre-line">{loc.hours}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: loc.color }} />
                  <a href={`tel:${loc.phone}`} className="text-cream/60 text-xs font-display hover:text-cream transition-colors">
                    {loc.phone}
                  </a>
                </div>
              </div>

              {/* Directions button */}
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-white text-sm font-display font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: loc.color }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}