import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { EventFormData } from '../../services/adminService';
import categoryService, { Category } from '../../services/categoryService';

const THEME_PRESETS = {
  default: {
    color_primary: '#2ecc71',
    color_secondary: '#27ae60',
    color_accent: '#3498db',
    color_text: '#2c3e50',
    gradient_start: '#2ecc71',
    gradient_end: '#27ae60',
  },
  algerassic: {
    color_primary: '#e74c3c',
    color_secondary: '#c0392b',
    color_accent: '#f39c12',
    color_text: '#2c3e50',
    gradient_start: '#e74c3c',
    gradient_end: '#c0392b',
  },
  space: {
    color_primary: '#9b59b6',
    color_secondary: '#8e44ad',
    color_accent: '#3498db',
    color_text: '#ecf0f1',
    gradient_start: '#9b59b6',
    gradient_end: '#8e44ad',
  },
  drift: {
    color_primary: '#f39c12',
    color_secondary: '#e67e22',
    color_accent: '#e74c3c',
    color_text: '#2c3e50',
    gradient_start: '#f39c12',
    gradient_end: '#e67e22',
  },
  other: {
    color_primary: '#34495e',
    color_secondary: '#2c3e50',
    color_accent: '#95a5a6',
    color_text: '#ecf0f1',
    gradient_start: '#34495e',
    gradient_end: '#2c3e50',
  },
};

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Téléphone' },
  { value: 'textarea', label: 'Zone de texte' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'checkbox', label: 'Case à cocher' },
];

const EMOJI_LIST = [
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎳',
  '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '⛸️', '🎣',
  '🎽', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🏌️', '🤼', '🤸', '⛹️',
  '🤺', '🤾', '🏇', '🧘', '🚴', '🚵', '🤹', '🎪', '🦸', '🦹',
  '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺',
  '🎸', '🍕', '🍔', '🍟', '🌭', '🍿', '🍗', '🍖', '🌮', '🍱',
  '🍜', '🍲', '🍛', '🍣', '🍝', '🍠', '🥘', '🍢', '🍤', '🥞',
  '🍪', '🍩', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍾', '🍷',
  '🍸', '🍹', '🍺', '🥂', '🍻', '☕', '🍵', '🥤', '🧃', '🧉',
  '🧊', '🦖', '🦕', '🦴', '🐉', '🐲', '🌲', '🌳', '🌴', '🌵',
  '🌾', '🌿', '☘️', '🍀', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧',
  '🧨', '🚀', '🛸', '🛰️', '✈️', '🛩️', '💺', '🛶', '⛵', '🚤',
  '🛳️', '🚢', '⛴️', '🛥️', '🌊', '⛱️', '🏖️', '🏝️', '🏜️', '🌋',
  '⛰️', '🏔️', '🗻', '🎢', '🎡', '⛲', '⛺', '🏠', '🏡', '🏘️',
  '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨',
  '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🔨',
  '⛏️', '⚒️', '🛠️', '🔧', '🔩', '⚙️', '⛓️', '🧰', '🧱', '🔐',
  '🔒', '🔓', '🔑', '🗝️', '🚪', '🪑', '🚽', '🚿', '🛁', '🛀',
  '🛎️', '🔔', '🔕', '🧎', '🧏', '🧖', '🧗', '🧠', '🧡',
  '💛', '💚', '💙', '💜', '🖤', '🍽️', '🍴', '🥄'
];

export default function EventCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📌');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Basic event info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxCapacity, setMaxCapacity] = useState<number>(100);
  const [price, setPrice] = useState<number>(0);
  const [hasChildPricing, setHasChildPricing] = useState(false);
  const [childPrice, setChildPrice] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'active' | 'inactive' | 'cancelled'>('draft');
  const [category, setCategory] = useState<string>('');

  // Theme
  const [themePreset, setThemePreset] = useState<'default' | 'algerassic' | 'space' | 'drift' | 'other'>('default');
  const [customTheme, setCustomTheme] = useState(THEME_PRESETS.default);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [backgroundImagePreview, setBackgroundImagePreview] = useState('');
  const [headerImagePreview, setHeaderImagePreview] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);

  // Ticket types
  const [ticketTypes, setTicketTypes] = useState<Array<{ name: string; description?: string; price: number; quantity: number }>>([
    { name: 'Standard', description: '', price: 0, quantity: 100 },
  ]);

  // Form fields
  const [formFields, setFormFields] = useState<
    Array<{
      field_name: string;
      field_type: 'text' | 'textarea' | 'checkbox' | 'email' | 'select' | 'phone';
      field_label: string;
      is_required: boolean;
      display_order: number;
    }>
  >([
    { field_name: 'full_name', field_type: 'text', field_label: 'Nom complet', is_required: true, display_order: 1 },
    { field_name: 'email', field_type: 'email', field_label: 'Email', is_required: true, display_order: 2 },
  ]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim()) {
      alert('Le titre de la catégorie est requis');
      return;
    }

    setCreatingCategory(true);
    try {
      const slug = newCategoryTitle.toLowerCase().replace(/\s+/g, '_');
      const newCat = await categoryService.create({
        slug,
        title: newCategoryTitle,
        description: newCategoryDescription,
        icon: newCategoryIcon,
      });

      setCategories([...categories, newCat]);
      setCategory(newCat.slug);
      setShowNewCategoryModal(false);
      setNewCategoryTitle('');
      setNewCategoryDescription('');
      setNewCategoryIcon('📌');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Erreur lors de la création de la catégorie');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handlePresetChange = (preset: typeof themePreset) => {
    setThemePreset(preset);
    setCustomTheme(THEME_PRESETS[preset]);
  };

  const handleImageUpload = async (file: File, type: 'background' | 'header') => {
    if (type === 'background') {
      setUploadingBg(true);
    } else {
      setUploadingHeader(true);
    }

    try {
      const response = await adminService.uploadImage(file);
      if (response.success) {
        if (type === 'background') {
          setBackgroundImageUrl(response.url);
          setBackgroundImagePreview(response.url);
        } else {
          setHeaderImageUrl(response.url);
          setHeaderImagePreview(response.url);
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      if (type === 'background') {
        setUploadingBg(false);
      } else {
        setUploadingHeader(false);
      }
    }
  };

  const extractPhotoId = (url: string): string => {
    const match = url.match(/photos\/[a-zA-Z0-9_-]*-([a-zA-Z0-9]{11})$/);
    return match ? match[1] : '';
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'header') => {
    const url = e.target.value;

    if (type === 'background') {
      setBackgroundImageUrl(url);
      if (url && url.includes('unsplash.com')) {
        const photoId = extractPhotoId(url);
        if (photoId) {
          // Call backend to avoid CORS issues
          fetch('http://localhost:8000/api/extract-unsplash-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photo_id: photoId })
          })
            .then(res => res.json())
            .then(data => {
              if (data.url) {
                setBackgroundImagePreview(data.url);
              } else {
                setBackgroundImagePreview(url);
              }
            })
            .catch(err => {
              console.warn('Image extraction error:', err);
              setBackgroundImagePreview(url);
            });
        }
      } else if (url) {
        setBackgroundImagePreview(url);
      } else {
        setBackgroundImagePreview('');
      }
    } else {
      setHeaderImageUrl(url);
      if (url && url.includes('unsplash.com')) {
        const photoId = extractPhotoId(url);
        if (photoId) {
          fetch(`https://unsplash.com/napi/photos/${photoId}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
            .then(data => {
              if (data.urls?.regular) {
                setHeaderImagePreview(data.urls.regular);
              } else {
                console.warn('No regular URL in response:', data);
                setHeaderImagePreview(url);
              }
            })
            .catch(err => {
              console.warn('Unsplash API error:', err);
              setHeaderImagePreview(url);
            });
        }
      } else if (url) {
        setHeaderImagePreview(url);
      } else {
        setHeaderImagePreview('');
      }
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'header') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'background') {
          setBackgroundImagePreview(reader.result as string);
        } else {
          setHeaderImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      handleImageUpload(file, type);
    }
  };

  const handleAddTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: '', description: '', price: 0, quantity: 100 },
    ]);
  };

  const handleRemoveTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleTicketTypeChange = (index: number, field: string, value: unknown) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const handleAddFormField = () => {
    setFormFields([
      ...formFields,
      {
        field_name: '',
        field_type: 'text',
        field_label: '',
        is_required: false,
        display_order: formFields.length + 1,
      },
    ]);
  };

  const handleRemoveFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleFormFieldChange = (index: number, field: string, value: unknown) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], [field]: value };
    setFormFields(updated);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !description.trim() || !location.trim() || !startDate) {
      setError('Veuillez remplir tous les champs obligatoires (titre, description, lieu, date de début)');
      setLoading(false);
      return;
    }

    try {
      const eventData: EventFormData = {
        title,
        description,
        start_date: startDate,
        end_date: endDate || startDate,
        location,
        max_capacity: maxCapacity,
        is_featured: isFeatured,
        status,
        category: category || undefined,
        cover_image: backgroundImageUrl || undefined,
        theme: {
          preset: themePreset,
          ...customTheme,
          background_image_url: backgroundImageUrl || undefined,
          header_image_url: headerImageUrl || undefined,
        },
        ticket_types: ticketTypes.filter(t => t.name.trim() !== ''),
        form_fields: formFields.filter(f => f.field_name.trim() !== '' && f.field_label.trim() !== ''),
      };

      await adminService.createEvent(eventData);
      navigate('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Erreur lors de la création de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 className="section-title">➕ Créer un Événement</h2>
        <button
          onClick={() => navigate('/admin/events')}
          style={{
            padding: '10px 20px',
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Retour
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3 className="form-section-title">📋 Informations de Base</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="event-title">Titre *</label>
              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex: ALGERASSIC LAND"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="event-description">Description *</label>
              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Description de l'événement..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-start-date">Date de début *</label>
              <input
                id="event-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-end-date">Date de fin</label>
              <input
                id="event-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-start-time">Heure de début</label>
              <input
                id="event-start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-end-time">Heure de fin</label>
              <input
                id="event-end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-location">Lieu *</label>
              <input
                id="event-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Centre culturel de Constantine"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-capacity">Capacité maximale *</label>
              <input
                id="event-capacity"
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number.parseInt(e.target.value))}
                required
                min={1}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-price">Prix de base (DA)</label>
              <input
                id="event-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
                min={0}
                step={0.01}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-child-pricing" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={hasChildPricing}
                  onChange={(e) => setHasChildPricing(e.target.checked)}
                />
                Tarif enfant
              </label>
              {hasChildPricing && (
                <input
                  type="number"
                  value={childPrice}
                  onChange={(e) => setChildPrice(Number.parseFloat(e.target.value))}
                  min={0}
                  step={0.01}
                  placeholder="Prix enfant"
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="event-status">Statut</label>
              <select id="event-status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="event-category">Catégorie</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="event-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryModal(true)}
                  style={{
                    padding: '12px 16px',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                  }}
                  title="Créer une nouvelle catégorie"
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="event-featured" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  id="event-featured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Événement à la une
              </label>
            </div>
          </div>
        </div>

        {/* Theme Customization */}
        <div className="form-section">
          <h3 className="form-section-title">🎨 Personnalisation du Thème</h3>

          <div className="form-group">
            <label htmlFor="theme-preset">Thème prédéfini</label>
            <select id="theme-preset" value={themePreset} onChange={(e) => handlePresetChange(e.target.value as any)}>
              <option value="default">Default (Vert)</option>
              <option value="algerassic">Algerassic (Rouge)</option>
              <option value="space">Space (Violet)</option>
              <option value="drift">Drift (Orange)</option>
              <option value="other">Other (Gris)</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="color-primary">Couleur primaire</label>
              <input
                id="color-primary"
                type="color"
                value={customTheme.color_primary}
                onChange={(e) => setCustomTheme({ ...customTheme, color_primary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color-secondary">Couleur secondaire</label>
              <input
                id="color-secondary"
                type="color"
                value={customTheme.color_secondary}
                onChange={(e) => setCustomTheme({ ...customTheme, color_secondary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color-accent">Couleur accent</label>
              <input
                id="color-accent"
                type="color"
                value={customTheme.color_accent}
                onChange={(e) => setCustomTheme({ ...customTheme, color_accent: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color-text">Couleur texte</label>
              <input
                id="color-text"
                type="color"
                value={customTheme.color_text}
                onChange={(e) => setCustomTheme({ ...customTheme, color_text: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gradient-start">Gradient début</label>
              <input
                id="gradient-start"
                type="color"
                value={customTheme.gradient_start}
                onChange={(e) => setCustomTheme({ ...customTheme, gradient_start: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gradient-end">Gradient fin</label>
              <input
                id="gradient-end"
                type="color"
                value={customTheme.gradient_end}
                onChange={(e) => setCustomTheme({ ...customTheme, gradient_end: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="bg-image">Image de fond 🖼️</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  id="bg-image-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageInputChange(e, 'background')}
                  disabled={uploadingBg}
                  style={{ flex: 1 }}
                />
                {uploadingBg && <span style={{ color: '#27ae60' }}>Upload...</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7f8c8d', margin: '0 0 10px 0' }}>OU entrez une URL</p>
              <input
                id="bg-image"
                type="text"
                value={backgroundImageUrl}
                onChange={(e) => handleImageUrlChange(e, 'background')}
                placeholder="https://images.unsplash.com/... ou https://images.pexels.com/..."
              />
              {backgroundImagePreview && (
                <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd', backgroundColor: '#f9f9f9' }}>
                  <img
                    src={backgroundImagePreview}
                    alt="Aperçu bannière"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="header-image">Image d'en-tête (logo) 🎭</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  id="header-image-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageInputChange(e, 'header')}
                  disabled={uploadingHeader}
                  style={{ flex: 1 }}
                />
                {uploadingHeader && <span style={{ color: '#27ae60' }}>Upload...</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7f8c8d', margin: '0 0 10px 0' }}>OU entrez une URL</p>
              <input
                id="header-image"
                type="text"
                value={headerImageUrl}
                onChange={(e) => handleImageUrlChange(e, 'header')}
                placeholder="https://images.unsplash.com/... ou https://images.pexels.com/..."
              />
              {headerImagePreview && (
                <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd', backgroundColor: '#f9f9f9' }}>
                  <img
                    src={headerImagePreview}
                    alt="Aperçu logo"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Theme Preview */}
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${customTheme.gradient_start}, ${customTheme.gradient_end})`,
              color: customTheme.color_text,
            }}
          >
            <h4 style={{ margin: 0, marginBottom: '10px' }}>Aperçu du thème</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
              Voici à quoi ressemblera votre événement avec ces couleurs
            </p>
          </div>
        </div>

        {/* Ticket Types */}
        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 className="form-section-title">🎟️ Types de Tickets</h3>
            <button
              type="button"
              onClick={handleAddTicketType}
              style={{
                padding: '8px 16px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Ajouter
            </button>
          </div>

          {ticketTypes.map((ticket, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom du ticket</label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                    placeholder="Ex: VIP, Standard, Étudiant"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={ticket.description || ''}
                    onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                    placeholder="Description du ticket"
                  />
                </div>

                <div className="form-group">
                  <label>Prix (DA)</label>
                  <input
                    type="number"
                    value={ticket.price}
                    onChange={(e) => handleTicketTypeChange(index, 'price', parseFloat(e.target.value))}
                    min={0}
                    step={0.01}
                  />
                </div>

                <div className="form-group">
                  <label>Quantité disponible</label>
                  <input
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketTypeChange(index, 'quantity', parseInt(e.target.value))}
                    min={0}
                  />
                </div>
              </div>

              {ticketTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTicketType(index)}
                  className="remove-btn"
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Custom Form Fields */}
        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 className="form-section-title">📝 Champs de Formulaire Personnalisés</h3>
            <button
              type="button"
              onClick={handleAddFormField}
              style={{
                padding: '8px 16px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Ajouter
            </button>
          </div>

          {formFields.map((field, index) => (
            <div key={`field-${field.field_name}-${index}`} className="dynamic-item">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor={`field-name-${index}`}>Nom du champ</label>
                  <input
                    id={`field-name-${index}`}
                    type="text"
                    value={field.field_name}
                    onChange={(e) => handleFormFieldChange(index, 'field_name', e.target.value)}
                    placeholder="Ex: phone_number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`field-label-${index}`}>Label</label>
                  <input
                    id={`field-label-${index}`}
                    type="text"
                    value={field.field_label}
                    onChange={(e) => handleFormFieldChange(index, 'field_label', e.target.value)}
                    placeholder="Ex: Numéro de téléphone"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`field-type-${index}`}>Type de champ</label>
                  <select
                    id={`field-type-${index}`}
                    value={field.field_type}
                    onChange={(e) => handleFormFieldChange(index, 'field_type', e.target.value)}
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`field-order-${index}`}>Ordre d'affichage</label>
                  <input
                    id={`field-order-${index}`}
                    type="number"
                    value={field.display_order}
                    onChange={(e) => handleFormFieldChange(index, 'display_order', parseInt(e.target.value))}
                    min={1}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`field-required-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      id={`field-required-${index}`}
                      type="checkbox"
                      checked={field.is_required}
                      onChange={(e) => handleFormFieldChange(index, 'is_required', e.target.checked)}
                    />
                    Champ obligatoire
                  </label>
                </div>
              </div>

              {formFields.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFormField(index)}
                  className="remove-btn"
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            style={{
              padding: '12px 30px',
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              background: loading ? '#95a5a6' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            {loading ? '⏳ Création...' : '✅ Créer l\'événement'}
          </button>
        </div>
      </form>

      {/* Modal for creating new category */}
      {showNewCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ marginTop: 0 }}>➕ Créer une nouvelle catégorie</h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Icône 🎨
              </label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '2rem',
                  width: '100%',
                  cursor: 'pointer',
                  background: 'white',
                  transition: 'all 0.2s',
                }}
              >
                {newCategoryIcon}
              </button>
              {showEmojiPicker && (
                <div style={{
                  marginTop: '10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: '5px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: '#f9f9f9',
                }}>
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setNewCategoryIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                      style={{
                        fontSize: '1.5rem',
                        border: 'none',
                        background: newCategoryIcon === emoji ? '#e8f5e9' : 'transparent',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f0f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = newCategoryIcon === emoji ? '#e8f5e9' : 'transparent';
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Titre *
              </label>
              <input
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="Ex: Gastronomie"
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Description de la catégorie..."
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  minHeight: '80px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategoryModal(false);
                  setNewCategoryTitle('');
                  setNewCategoryDescription('');
                  setNewCategoryIcon('📌');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
                disabled={creatingCategory}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                style={{
                  padding: '10px 20px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: creatingCategory ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: creatingCategory ? 0.6 : 1,
                }}
                disabled={creatingCategory}
              >
                {creatingCategory ? '⏳ Création...' : '✅ Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .section-title {
          font-size: 1.8rem;
          margin: 0;
          font-weight: 700;
          color: var(--text);
        }

        .form-section {
          background: var(--card-bg);
          padding: 25px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          margin-bottom: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .form-section-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 20px 0;
          color: var(--text);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 1rem;
          font-family: inherit;
          background: var(--card-bg);
          color: var(--text);
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }

        .form-group input[type="checkbox"] {
          width: 20px;
          height: 20px;
        }

        .dynamic-item {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid var(--border);
          margin-bottom: 15px;
          position: relative;
        }

        .remove-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 6px 12px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .remove-btn:hover {
          background: #c0392b;
        }
      `}</style>
    </div>
  );
}
