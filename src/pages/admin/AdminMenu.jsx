import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, Save, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const CATEGORIES = ['coffee', 'espresso', 'tea', 'juice', 'smoothie', 'pastry', 'sandwich', 'bakery', 'vegan'];

const emptyItem = {
  name: '', category: 'coffee', description: '', tagline: '',
  price_small: '', price_medium: '', price_large: '',
  image_url: '', rating: '', is_available: true, is_featured: false, sort_order: 0,
};

export default function AdminMenu() {
  const [tab, setTab] = useState('all'); // 'all' | 'daily'
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyItem);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: () => base44.entities.MenuItem.list('-sort_order', 200),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price_small: data.price_small ? parseFloat(data.price_small) : undefined,
        price_medium: data.price_medium ? parseFloat(data.price_medium) : undefined,
        price_large: data.price_large ? parseFloat(data.price_large) : undefined,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        sort_order: parseInt(data.sort_order) || 0,
      };
      if (editing === 'new') {
        return base44.entities.MenuItem.create(payload);
      } else {
        return base44.entities.MenuItem.update(editing, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      setEditing(null);
      toast({ title: editing === 'new' ? 'Item created!' : 'Item updated!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MenuItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      toast({ title: 'Item deleted' });
    },
  });

  const openEditor = (item) => {
    if (item) {
      setEditing(item.id);
      setFormData({
        ...item,
        price_small: item.price_small || '',
        price_medium: item.price_medium || '',
        price_large: item.price_large || '',
        rating: item.rating || '',
      });
    } else {
      setEditing('new');
      setFormData(emptyItem);
    }
  };

  const toggleDailyMutation = useMutation({
    mutationFn: ({ id, value }) => base44.entities.MenuItem.update(id, { is_daily_feature: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-menu'] }),
  });

  const clearAllDailyMutation = useMutation({
    mutationFn: async () => {
      const featured = items.filter(i => i.is_daily_feature);
      await Promise.all(featured.map(i => base44.entities.MenuItem.update(i.id, { is_daily_feature: false })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      toast({ title: 'Daily features cleared' });
    },
  });

  const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const dailyItems = items.filter(i => i.is_daily_feature);
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('all')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-display transition-all ${tab === 'all' ? 'bg-citrus text-white' : 'bg-white/5 text-cream/40'}`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setTab('daily')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-display transition-all flex items-center justify-center gap-1.5 ${tab === 'daily' ? 'bg-citrus text-white' : 'bg-white/5 text-cream/40'}`}
        >
          <Sparkles className="w-3 h-3" /> Today's Features ({dailyItems.length})
        </button>
      </div>

      {/* DAILY FEATURES TAB */}
      {tab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-citrus/10 border border-citrus/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cream font-display text-sm font-semibold">Daily Features</p>
                <p className="text-cream/40 text-xs mt-0.5">{today} · {dailyItems.length} selected</p>
              </div>
              {dailyItems.length > 0 && (
                <button
                  onClick={() => clearAllDailyMutation.mutate()}
                  className="text-red-400/70 text-xs font-display hover:text-red-400"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <p className="text-cream/30 text-xs font-display">Tap any item to toggle it on/off for today's features section:</p>

          <div className="space-y-2">
            {items.map(item => {
              const isOn = item.is_daily_feature;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => toggleDailyMutation.mutate({ id: item.id, value: !isOn })}
                  className={`w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition-all duration-200 ${
                    isOn ? 'bg-citrus/15 border border-citrus/30' : 'bg-white/5 border border-transparent hover:bg-white/8'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg shrink-0">☕</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-cream font-display text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-cream/40 text-xs capitalize">{item.category} · ${item.price_medium}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all duration-200 ${
                    isOn ? 'bg-citrus' : 'bg-white/10'
                  }`}>
                    {isOn && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL ITEMS TAB */}
      {tab === 'all' && (
        <>
      <div className="flex items-center justify-between">
        <h3 className="text-cream font-heading text-base font-bold">Menu Items</h3>
        <Button
          size="sm"
          onClick={() => openEditor(null)}
          className="bg-citrus hover:bg-citrus/90 rounded-xl gap-1.5 font-display text-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </Button>
      </div>

      {/* Editor */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="bg-white/5 rounded-2xl p-5 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Name *" value={formData.name} onChange={e => set('name', e.target.value)}
                className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl" />
              <Select value={formData.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="bg-white/8 border-0 text-cream rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Tagline" value={formData.tagline} onChange={e => set('tagline', e.target.value)}
              className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl" />
            <Textarea placeholder="Description" value={formData.description} onChange={e => set('description', e.target.value)}
              className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl resize-none" rows={2} />
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Price S" type="number" value={formData.price_small} onChange={e => set('price_small', e.target.value)}
                className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl" />
              <Input placeholder="Price M *" type="number" value={formData.price_medium} onChange={e => set('price_medium', e.target.value)}
                className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl" />
              <Input placeholder="Price L" type="number" value={formData.price_large} onChange={e => set('price_large', e.target.value)}
                className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl" />
            </div>
            <Input placeholder="Image URL" value={formData.image_url} onChange={e => set('image_url', e.target.value)}
              className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_available} onCheckedChange={v => set('is_available', v)} />
                <span className="text-cream/50 text-xs font-display">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_featured} onCheckedChange={v => set('is_featured', v)} />
                <span className="text-cream/50 text-xs font-display">Featured</span>
              </div>
              <Input placeholder="Rating" type="number" step="0.1" value={formData.rating} onChange={e => set('rating', e.target.value)}
                className="bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl w-24" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}
                className="bg-citrus hover:bg-citrus/90 rounded-xl gap-1.5 font-display text-xs flex-1">
                <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)} className="text-cream/40 rounded-xl">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items list */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-cream/20 border-t-citrus rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-cream font-display text-sm font-semibold truncate">{item.name}</p>
                  {item.is_daily_feature && (
                    <span className="text-[10px] bg-citrus/20 text-citrus px-1.5 py-0.5 rounded-full font-display flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Today
                    </span>
                  )}
                  {!item.is_available && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-display">Hidden</span>
                  )}
                </div>
                <p className="text-cream/40 text-xs">{item.category} · ${item.price_medium}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEditor(item)} className="p-2 rounded-lg hover:bg-white/5">
                  <Pencil className="w-3.5 h-3.5 text-cream/30" />
                </button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-2 rounded-lg hover:bg-red-500/10">
                  <Trash2 className="w-3.5 h-3.5 text-red-400/50" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}