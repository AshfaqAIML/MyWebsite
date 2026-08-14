'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { picnics, stories } from '@/lib/picnic-seed-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen, MapPin, Thermometer, DollarSign, Car, UtensilsCrossed, Music, Route,
  Clock, CloudRain, Cloud, Sun, CloudSnow, ChevronDown, ChevronUp, Heart, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JournalSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  return (
    <section id="journal" ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {} }
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <BookOpen className="w-3 h-3 mr-1.5" />
            Memory Journal
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            The <span className="text-gradient">Diary</span> of Adventures
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every picnic documented with love. Weather, routes, food, and the moments that made each year special.
          </p>
        </motion.div>

        {/* Journal Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Latest 4 picnics as journal entries */}
          {picnics.slice(-4).reverse().map((picnic, index) => (
            <motion.div
              key={picnic.year}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {} }
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-border/50 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-32 sm:h-auto shrink-0 overflow-hidden">
<Image
                      src={picnic.heroImageUrl}
                      alt={picnic.title}
                      width={400}
                      height={229}
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-primary">{picnic.year}</span>
                      <Badge variant="secondary" className="text-[10px]">{picnic.season}</Badge>
                    </div>
                    <h3 className="font-semibold text-base mb-2">{picnic.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="truncate">{picnic.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3 h-3 text-primary" />
                        <span>{picnic.temperature}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-primary" />
                        <span>₹{picnic.budget?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3 h-3 text-primary" />
                        <span>{picnic.travelDistance} km</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <UtensilsCrossed className="w-3 h-3 mt-0.5 shrink-0 text-[#E8751A]" />
                        <span className="line-clamp-1">{picnic.food}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {} }
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Quote className="w-6 h-6 text-primary" />
            Stories from the Trail
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story, index) => {
              const friendName = story.friendId === 'ishfaq' ? 'Ishfaq' : story.friendId === 'rouf' ? 'Rouf' : 'Shoib';
              const moodEmojis: Record<string, string> = {
                'Nostalgic': '🥹', 'Hilarious': '😂', 'Funny': '😄',
                'Emotional': '❤️', 'Reflective': '🤔',
              };
              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {} }
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="h-full border-border/50 shadow-sm hover:shadow-lg transition-all hover:border-primary/20 group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">{story.year}</Badge>
                        <span className="text-lg">{moodEmojis[story.mood] || '✨'}</span>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{story.title}</h4>
                      <p className={`text-xs text-muted-foreground leading-relaxed ${
                        expandedStory === story.id ? '' : 'line-clamp-4'
                      }`}>
                        {story.content}
                      </p>
                      <button
                        onClick={() => setExpandedStory(
                          expandedStory === story.id ? null : story.id
                        )}
                        className="text-xs text-primary font-medium mt-2 flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        {expandedStory === story.id ? 'Show Less' : 'Read More'}
                        {expandedStory === story.id
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                        }
                      </button>
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span className="text-xs text-muted-foreground">By {friendName}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{story.mood}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
