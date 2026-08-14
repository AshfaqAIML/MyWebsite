'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { statistics } from '@/lib/picnic-seed-data';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp, Camera, MapPin, DollarSign, Car, Sun, CloudRain,
  UtensilsCrossed, Gamepad2, Flame, Calendar, Video, BookOpen, Mic
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const COLORS = ['#2D5A27', '#5BA4CF', '#E8751A', '#7CB342', '#F4A261', '#C49A2A'];

function AnimatedCounter({ target, label, icon: Icon, suffix = '' }: {
  target: number;
  label: string;
  icon: React.ElementType;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  const formatNumber = (n: number) => {
    if (n >= 1000) return n.toLocaleString();
    return String(n);
  };

  return (
    <div ref={ref} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="text-xl font-bold tabular-nums">
          {formatNumber(count)}{suffix}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

const budgetData = [
  { year: 2013, budget: 2500 }, { year: 2014, budget: 4500 },
  { year: 2015, budget: 3800 }, { year: 2016, budget: 2000 },
  { year: 2017, budget: 3200 }, { year: 2018, budget: 5500 },
  { year: 2019, budget: 4800 }, { year: 2020, budget: 1500 },
  { year: 2021, budget: 4000 }, { year: 2022, budget: 2800 },
  { year: 2023, budget: 3000 }, { year: 2024, budget: 4200 },
];

const distanceData = [
  { year: 2013, distance: 95 }, { year: 2014, distance: 50 },
  { year: 2015, distance: 87 }, { year: 2016, distance: 42 },
  { year: 2017, distance: 47 }, { year: 2018, distance: 123 },
  { year: 2019, distance: 110 }, { year: 2020, distance: 5 },
  { year: 2021, distance: 130 }, { year: 2022, distance: 68 },
  { year: 2023, distance: 105 }, { year: 2024, distance: 115 },
];

const seasonData = [
  { name: 'Summer', value: 5 }, { name: 'Spring', value: 3 },
  { name: 'Winter', value: 1 }, { name: 'Autumn', value: 2 },
  { name: 'Monsoon', value: 1 },
];

export default function StatisticsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="statistics" ref={ref} className="py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <TrendingUp className="w-3 h-3 mr-1.5" />
            By The Numbers
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Our Friendship in <span className="text-gradient">Numbers</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            12 years of data, beautifully visualized. Every number tells a story.
          </p>
        </motion.div>

        {/* Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12"
        >
          <AnimatedCounter target={statistics.yearsTogether} label="Years Together" icon={Calendar} />
          <AnimatedCounter target={statistics.totalPicnics} label="Total Picnics" icon={MapPin} />
          <AnimatedCounter target={statistics.totalPhotos} label="Photos Taken" icon={Camera} />
          <AnimatedCounter target={statistics.totalVideos} label="Videos Recorded" icon={Video} />
          <AnimatedCounter target={statistics.totalStories} label="Stories Written" icon={BookOpen} />
          <AnimatedCounter target={statistics.voiceNotes} label="Voice Notes" icon={Mic} />
          <AnimatedCounter target={statistics.distanceTravelled} label="KM Travelled" icon={Car} suffix=" km" />
          <AnimatedCounter target={statistics.moneySpent} label="Money Spent" icon={DollarSign} suffix=" ₹" />
          <AnimatedCounter target={statistics.mealsShared} label="Meals Shared" icon={UtensilsCrossed} />
          <AnimatedCounter target={statistics.gamesPlayed} label="Games Played" icon={Gamepad2} />
          <AnimatedCounter target={statistics.campfires} label="Campfires Lit" icon={Flame} />
          <AnimatedCounter target={statistics.sunnyTrips} label="Sunny Trips" icon={Sun} />
        </motion.div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Budget Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Budget per Picnic (₹)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 40%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 40%)" />
                    <Tooltip
                      contentStyle={{
                        background: 'oklch(1 0 0)',
                        border: '1px solid oklch(0.9 0 0)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px oklch(0 0 0 / 10%)',
                      }}
                      formatter={(value) => [value != null ? `₹${Number(value).toLocaleString()}` : '₹0', 'Budget']}
                    />
                    <Bar dataKey="budget" fill="#2D5A27" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Distance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#5BA4CF]" />
                  Distance per Trip (km)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={distanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 40%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0 0 / 40%)" />
                    <Tooltip
                      contentStyle={{
                        background: 'oklch(1 0 0)',
                        border: '1px solid oklch(0.9 0 0)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px oklch(0 0 0 / 10%)',
                      }}
                    />
                    <defs>
                      <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5BA4CF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5BA4CF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="distance" stroke="#5BA4CF" strokeWidth={2} fill="url(#colorDistance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Season Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#E8751A]" />
                  Trips by Season
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={seasonData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {seasonData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'oklch(1 0 0)',
                        border: '1px solid oklch(0.9 0 0)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px oklch(0 0 0 / 10%)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 -mt-6">
                  {seasonData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border-border/50 shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Fun Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Most Visited Place', value: statistics.mostVisitedPlace, icon: MapPin },
                  { label: 'Favorite Food', value: statistics.favoriteFood, icon: UtensilsCrossed },
                  { label: 'Favorite Season', value: statistics.favoriteSeason, icon: Sun },
                  { label: 'Longest Trip', value: statistics.longestTrip, icon: Car },
                  { label: 'Shortest Trip', value: statistics.shortestTrip, icon: MapPin },
                  { label: 'Most Photos By', value: statistics.friendWithMostPhotos, icon: Camera },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <stat.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <p className="text-sm font-medium mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
