'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  Loader2,
  Rocket,
  Tag,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DESTINATIONS = ['Bangkok', 'Phuket', 'Chiang Mai', 'Koh Samui', 'Pattaya', 'Krabi'];
const GROUP_SIZES = ['Solo', 'Couple', 'Family', 'Business'];
const VIBES = ['Adventure', 'Luxury', 'Culture', 'Chill'];
const INTEREST_TAGS = ['History', 'Nightlife', 'Nature', 'Adventure', 'Foodie', 'Shopping', 'Wellness'];

export function PlannerSection() {
  const [destination, setDestination] = useState('Bangkok');
  const [duration, setDuration] = useState(3);
  const [groupSize, setGroupSize] = useState('Solo');
  const [budget, setBudget] = useState(500);
  const [vibe, setVibe] = useState('Adventure');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Foodie', 'Adventure']);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setResult('');

    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}, Thailand.
- Group: ${groupSize}
- Budget: ~$${budget} USD total
- Vibe: ${vibe}
- Interests: ${selectedTags.join(', ')}

Include day-by-day schedule with:
- Morning, afternoon, evening activities
- Specific restaurant/food recommendations with approximate THB prices
- Transport tips between locations
- Estimated daily costs in THB
- Local insider tips and warnings

Format as markdown with headers for each day.`;

    const sessionId = `planner-${Date.now()}`;

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          sessionId,
          travelMode: groupSize.toLowerCase() === 'business' ? 'business' : groupSize.toLowerCase(),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error('Failed to generate');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                accumulated += data.content;
                setResult(accumulated);
              }
              if (data.done) break;
            } catch {
              // skip malformed data
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setResult('⚠️ Failed to generate itinerary. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [destination, duration, groupSize, budget, vibe, selectedTags]);

  return (
    <section id="planner" className="py-16 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 text-xs font-bold uppercase tracking-widest">
            <Rocket className="w-3 h-3 mr-1" />
            Trip Planner
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MISSION <span className="text-amber-400">BUILDER</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-wider">Strategic Planning Ops</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  Mission Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Destination */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Destination
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATIONS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration & Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Duration (days)
                    </label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min={1}
                      max={30}
                      className="bg-slate-700 border-slate-600 text-white h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      <Users className="w-3 h-3 inline mr-1" />
                      Group Size
                    </label>
                    <Select value={groupSize} onValueChange={setGroupSize}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUP_SIZES.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    <DollarSign className="w-3 h-3 inline mr-1" />
                    Budget (USD)
                  </label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={50}
                    className="bg-slate-700 border-slate-600 text-white h-10"
                  />
                </div>

                {/* Vibe */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Vibe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VIBES.map((v) => (
                      <Button
                        key={v}
                        variant={vibe === v ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setVibe(v)}
                        className={
                          vibe === v
                            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                            : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 bg-transparent'
                        }
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Interest Tags */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    <Tag className="w-3 h-3 inline mr-1" />
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                          selectedTags.includes(tag)
                            ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
                            : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600 hover:text-white'
                        }`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 text-base shadow-lg shadow-amber-500/25"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Itinerary...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Generated Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="prose prose-sm prose-invert max-w-none max-h-[600px] overflow-y-auto custom-scrollbar">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                      <Rocket className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No itinerary generated yet</p>
                    <p className="text-slate-600 text-xs mt-1">Configure your mission parameters and hit Generate</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
