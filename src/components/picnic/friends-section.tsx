'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { friends as friendsData } from '@/lib/picnic-seed-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Users, MapPin, UtensilsCrossed, Star, Laugh, Award, Camera, Crown,
  Sparkles, ChevronRight, Heart, Quote
} from 'lucide-react';

export default function FriendsSection() {
  const [selectedFriend, setSelectedFriend] = useState<typeof friendsData[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="friends" ref={ref} className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#5BA4CF]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#E8751A]/5 rounded-full blur-3xl translate-x-1/3" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <Users className="w-3 h-3 mr-1.5" />
            The Trio
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Meet the <span className="text-gradient">Friends</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Three friends, three personalities, one unbreakable bond. Meet the people behind the memories.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {friendsData.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div
                onClick={() => { setSelectedFriend(friend); setDialogOpen(true); }}
                className="cursor-pointer bg-card rounded-3xl overflow-hidden shadow-lg shadow-black/5 border border-border/50 hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
              >
                {/* Avatar */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
<Image
                    src={friend.avatarUrl}
                    alt={friend.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="img-overlay absolute inset-0" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground shadow-md">
                      <Crown className="w-3 h-3 mr-1" />
                      {friend.role}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">{friend.name}</h3>
                    <p className="text-sm text-white/70">&ldquo;{friend.nickname}&rdquo;</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {friend.bio}
                  </p>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">Fav Location:</span>
                      <span className="font-medium">{friend.favoriteLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UtensilsCrossed className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">Fav Food:</span>
                      <span className="font-medium">{friend.favoriteFood}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Camera className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">Best Picnic:</span>
                      <span className="font-medium">{friend.favoritePicnic}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {friend.awards.slice(0, 2).map(award => (
                        <Badge key={award} variant="secondary" className="text-[10px] px-2 py-0.5">
                          {award}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary text-xs">
                      Full Profile <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Friend Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0">
          {selectedFriend && (
            <>
              <div className="relative h-56 overflow-hidden">
                <Image src={selectedFriend.avatarUrl} alt={selectedFriend.name} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover object-top" />
                <div className="img-overlay absolute inset-0" />
                <div className="absolute bottom-4 left-5">
                  <h2 className="text-3xl font-bold text-white">{selectedFriend.name}</h2>
                  <p className="text-white/70">&ldquo;{selectedFriend.nickname}&rdquo; — {selectedFriend.role}</p>
                </div>
              </div>
              <ScrollArea className="max-h-[60vh]">
                <div className="p-5 space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedFriend.bio}</p>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-[#C49A2A]" /> Awards
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFriend.awards.map(award => (
                        <Badge key={award} variant="outline" className="text-xs border-primary/20 text-primary">
                          <Award className="w-3 h-3 mr-1" />{award}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" /> Fun Facts
                    </h3>
                    <ul className="space-y-2">
                      {selectedFriend.funFacts.map((fact, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Laugh className="w-4 h-4 text-[#E8751A]" /> Funny Habits
                    </h3>
                    <ul className="space-y-2">
                      {selectedFriend.funnyHabits.map((habit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A] mt-1.5 shrink-0" />
                          {habit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
