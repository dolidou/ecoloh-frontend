import { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import categoryService, { Category, CategoryFormData } from '../../services/categoryService';

interface Event {
  id: number;
  title: string;
  category: string;
  is_category_hero: boolean;
  start_date: string;
}

interface CategoryHero {
  category: string;
  categoryTitle: string;
  categoryIcon: string;
  heroId: number | null;
  events: Event[];
}

interface FormState {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image_url: string;
  eventIds: number[];
  visible: boolean;
}

const EMOJI_LIST = [
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎳',
  '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '⛸️', '🎣',
  '🎽', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🏌️', '🤼', '🤸', '⛹️',
  '🤺', '🤾', '🏇', '🧘', '🚴', '🚵', '🤹', '🎪', '🦸',
  '🦹', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷',
  '🎺', '🎸', '🍕', '🍔', '🍟', '🌭', '🍿', '🍗', '🍖', '🌮',
  '🍱', '🍜', '🍲', '🍛', '🍣', '🍝', '🍠', '🥘', '🍢', '🍤',
  '🥞', '🍪', '🍩', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫',
  '🍾', '🍷', '🍸', '🍹', '🍺', '🥂', '🍻', '🥃', '☕', '🍵',
  '🦖', '🦕', '🦴', '🐉', '🐲', '🌲', '🌳', '🌴', '🌵', '🌾',
  '🌿', '☘️', '🍀', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🧨',
  '🚀', '🛸', '🛰️', '✈️', '🛩️', '💺', '🛶', '⛵', '🚤', '🛳️',
  '🚢', '⛴️', '🛥️', '🌊', '⛱️',
  '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🎢', '🎡', '⛲',
  '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣',
  '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪',
  '🕌', '🕍', '🛕', '🔨', '⛏️', '⚒️', '🛠️', '🔧', '🔩', '⚙️',
  '⛓️', '🧰', '🧱', '🔐', '🔒', '🔓', '🔑', '🗝️', '🚪',
  '🪑', '🚽', '🚿', '🛁', '🛀', '🛎️', '🔔', '🔕', '🧎', '🧏',
  '🧖', '🧗', '🧠', '🧡', '💛', '💚', '💙', '💜', '🖤',
  '🍽️', '🍴', '🥄', '🍶', '🥤', '🧃', '🧉', '🧊'
];

interface AllEvent {
  id: number;
  title: string;
  category: string;
}

export default function CategoryHeroes() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryHeroes, setCategoryHeroes] = useState<CategoryHero[]>([]);
  const [allEvents, setAllEvents] = useState<AllEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    slug: '',
    title: '',
    description: '',
    icon: '',
    image_url: '',
    eventIds: [],
    visible: true,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, eventsResponse] = await Promise.all([
        categoryService.getAll(),
        adminService.getEvents(),
      ]);
      const events = eventsResponse.data.data || [];

      // Group events by category with category info
      const categoriesMap = new Map<string, Event[]>();
      events.forEach((event: any) => {
        if (!event.category) return; // Skip events without category
        if (!categoriesMap.has(event.category)) {
          categoriesMap.set(event.category, []);
        }
        categoriesMap.get(event.category)!.push({
          id: event.id,
          title: event.title,
          category: event.category,
          is_category_hero: event.is_category_hero,
          start_date: event.start_date,
        });
      });

      const heroesData: CategoryHero[] = Array.from(categoriesMap.entries())
        .map(([slug, categoryEvents]) => {
          const cat = cats.find(c => c.slug === slug);
          return {
            category: slug,
            categoryTitle: cat?.title || (slug ? slug.toUpperCase() : 'Unknown'),
            categoryIcon: cat?.icon || '📌',
            heroId: categoryEvents.find(e => e.is_category_hero)?.id || null,
            events: categoryEvents.sort((a, b) => a.title.localeCompare(b.title)),
          };
        });

      setCategories(cats);
      setCategoryHeroes(heroesData.sort((a, b) => a.categoryTitle.localeCompare(b.categoryTitle)));

      // Load all events for selection
      setAllEvents(events.map((e: any) => ({
        id: e.id,
        title: e.title,
        category: e.category
      })));
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleHeroChange = async (category: CategoryHero, newHeroId: number | null) => {
    try {
      setSaving(true);

      if (newHeroId !== null) {
        await adminService.updateEvent(newHeroId, { is_category_hero: true });
        for (const event of category.events) {
          if (event.id !== newHeroId && event.is_category_hero) {
            await adminService.updateEvent(event.id, { is_category_hero: false });
          }
        }
      }

      setSuccess(`Héros mis à jour avec succès`);
      setTimeout(() => setSuccess(null), 3000);
      await loadData();
    } catch (error) {
      console.error('Error updating hero:', error);
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewCategory = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      icon: '',
      image_url: '',
      eventIds: [],
      visible: true,
    });
    setEditingCategorySlug(null);
    setShowCategoryForm(true);
    setShowEmojiPicker(false);
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventToggle = (eventId: number) => {
    setFormData(prev => ({
      ...prev,
      eventIds: prev.eventIds.includes(eventId)
        ? prev.eventIds.filter(id => id !== eventId)
        : [...prev.eventIds, eventId]
    }));
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slug || !formData.title) {
      setError('Slug et titre sont obligatoires');
      return;
    }

    try {
      setSaving(true);

      const payload: any = {
        slug: formData.slug,
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        image_url: formData.image_url,
        visible: formData.visible,
      };

      if (editingCategorySlug) {
        await categoryService.update(editingCategorySlug, payload);
        setSuccess('Catégorie mise à jour');
      } else {
        await categoryService.create(payload);
        setSuccess('Catégorie créée');
      }

      // Update selected events to this category
      for (const eventId of formData.eventIds) {
        try {
          await adminService.updateEvent(eventId, { category: formData.slug });
        } catch (error) {
          console.warn(`Could not update event ${eventId}:`, error);
        }
      }

      setShowCategoryForm(false);
      setTimeout(() => setSuccess(null), 3000);
      await loadData();
    } catch (error: any) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    try {
      setSaving(true);
      await categoryService.delete(slug);
      setSuccess('Catégorie supprimée');
      setDeleteCategoryConfirm(null);
      setTimeout(() => setSuccess(null), 3000);
      await loadData();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setError(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (slug: string, currentVisible: boolean) => {
    try {
      setSaving(true);
      await categoryService.update(slug, { visible: !currentVisible });
      setSuccess(!currentVisible ? 'Catégorie affichée' : 'Catégorie masquée');
      setTimeout(() => setSuccess(null), 3000);
      await loadData();
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '1.5rem' }}>⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">🎬 Héros & Catégories</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Gérez vos catégories et sélectionnez l'événement héros pour chacune
      </p>

      {error && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#c33'
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          background: '#efe',
          border: '1px solid #cfc',
          borderRadius: '6px',
          color: '#3c3'
        }}>
          ✅ {success}
        </div>
      )}

      {/* CATEGORY MANAGEMENT */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>🏷️ Gestion des Catégories</h3>

        {!showCategoryForm && (
          <button
            onClick={handleCreateNewCategory}
            style={{
              padding: '12px 20px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ➕ Nouvelle Catégorie
          </button>
        )}

        {showCategoryForm && (
          <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <form onSubmit={handleSaveCategory}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px' }}>Slug*</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleCategoryInputChange}
                  disabled={editingCategorySlug !== null}
                  placeholder="ex: street_food"
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px' }}>Titre*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleCategoryInputChange}
                  placeholder="ex: STREET FOOD"
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px' }}>Icône 🎨</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleCategoryInputChange}
                    placeholder="🍽️"
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1.5rem' }}
                    maxLength={2}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      padding: '8px 15px',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {showEmojiPicker ? '✕' : '📋 Choisir'}
                  </button>
                </div>
                {showEmojiPicker && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gap: '5px'
                  }}>
                    {EMOJI_LIST.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, icon: emoji }));
                          setShowEmojiPicker(false);
                        }}
                        style={{
                          padding: '8px',
                          fontSize: '1.5rem',
                          border: formData.icon === emoji ? '2px solid #3498db' : '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label style={{ fontWeight: 600, cursor: 'pointer' }}>
                  👁️ Afficher dans la barre
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px' }}>📌 Événements</label>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                  {allEvents.map((event) => (
                    <label
                      key={event.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        marginBottom: '8px',
                        background: formData.eventIds.includes(event.id) ? '#e8f5e9' : '#f9f9f9',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.eventIds.includes(event.id)}
                        onChange={() => handleEventToggle(event.id)}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{event.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>Actuellement: {event.category}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  💾 Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#7f8c8d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          {categories.map((cat) => (
            <div
              key={cat.slug}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                  {cat.icon} {cat.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>{cat.slug}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleVisibility(cat.slug, (cat as any).visible)}
                  disabled={saving}
                  style={{
                    padding: '8px 12px',
                    background: (cat as any).visible ? '#27ae60' : '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    opacity: saving ? 0.6 : 1
                  }}
                >
                  {(cat as any).visible ? '👁️ Visible' : '🚫 Masqué'}
                </button>
                <button
                  onClick={() => setDeleteCategoryConfirm(deleteCategoryConfirm === cat.slug ? null : cat.slug)}
                  style={{
                    padding: '8px 12px',
                    background: deleteCategoryConfirm === cat.slug ? '#c0392b' : '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {deleteCategoryConfirm === cat.slug ? '✓' : '🗑️'}
                </button>
              </div>
              {deleteCategoryConfirm === cat.slug && (
                <button
                  onClick={() => handleDeleteCategory(cat.slug)}
                  disabled={saving}
                  style={{
                    marginLeft: '10px',
                    padding: '8px 12px',
                    background: '#c0392b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Confirmer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HERO SELECTION */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>⭐ Sélection des Héros</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '25px'
      }}>
        {categoryHeroes.map((category) => (
          <div
            key={category.category}
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#333'
            }}>
              {category.categoryIcon} {category.categoryTitle}
            </h3>

            {/* Sélecteur Héros */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>
                ⭐ Événement Héros
              </label>
              <select
                value={category.heroId || ''}
                onChange={(e) => handleHeroChange(category, e.target.value ? Number(e.target.value) : null)}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  backgroundColor: 'white',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1
                }}
              >
                <option value="">-- Aucun --</option>
                {category.events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Affichage du héros actuel */}
            {category.heroId && (
              <div style={{
                padding: '12px',
                background: '#f0f8ff',
                border: '1px solid #b3d9ff',
                borderRadius: '6px',
                fontSize: '0.9rem',
                color: '#0066cc'
              }}>
                ⭐ <strong>Héros actuel:</strong> {category.events.find(e => e.id === category.heroId)?.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
