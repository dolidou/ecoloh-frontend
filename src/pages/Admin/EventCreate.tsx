import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { EventFormData } from '../../services/adminService';

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

export default function EventCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Theme
  const [themePreset, setThemePreset] = useState<'default' | 'algerassic' | 'space' | 'drift' | 'other'>('default');
  const [customTheme, setCustomTheme] = useState(THEME_PRESETS.default);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');

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

  const handlePresetChange = (preset: typeof themePreset) => {
    setThemePreset(preset);
    setCustomTheme(THEME_PRESETS[preset]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventData: EventFormData = {
        title,
        description,
        start_date: startDate,
        end_date: endDate || startDate,
        start_time: startTime,
        end_time: endTime,
        location,
        max_capacity: maxCapacity,
        price,
        has_child_pricing: hasChildPricing,
        child_price: hasChildPricing ? childPrice : undefined,
        is_featured: isFeatured,
        status,
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
    } catch (err) {
      setError((err as Error)?.message || 'Erreur lors de la création de l\'événement');
      console.error('Error creating event:', err);
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
              <label>Titre *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex: ALGERASSIC LAND"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Description de l'événement..."
              />
            </div>

            <div className="form-group">
              <label>Date de début *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>

            <div className="form-group">
              <label>Heure de début</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Heure de fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Lieu</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Centre culturel de Constantine"
              />
            </div>

            <div className="form-group">
              <label>Capacité maximale *</label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
                required
                min={1}
              />
            </div>

            <div className="form-group">
              <label>Prix de base (DA)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                min={0}
                step={0.01}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  onChange={(e) => setChildPrice(parseFloat(e.target.value))}
                  min={0}
                  step={0.01}
                  placeholder="Prix enfant"
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Statut</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
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
            <label>Thème prédéfini</label>
            <select value={themePreset} onChange={(e) => handlePresetChange(e.target.value as any)}>
              <option value="default">Default (Vert)</option>
              <option value="algerassic">Algerassic (Rouge)</option>
              <option value="space">Space (Violet)</option>
              <option value="drift">Drift (Orange)</option>
              <option value="other">Other (Gris)</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Couleur primaire</label>
              <input
                type="color"
                value={customTheme.color_primary}
                onChange={(e) => setCustomTheme({ ...customTheme, color_primary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Couleur secondaire</label>
              <input
                type="color"
                value={customTheme.color_secondary}
                onChange={(e) => setCustomTheme({ ...customTheme, color_secondary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Couleur accent</label>
              <input
                type="color"
                value={customTheme.color_accent}
                onChange={(e) => setCustomTheme({ ...customTheme, color_accent: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Couleur texte</label>
              <input
                type="color"
                value={customTheme.color_text}
                onChange={(e) => setCustomTheme({ ...customTheme, color_text: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Gradient début</label>
              <input
                type="color"
                value={customTheme.gradient_start}
                onChange={(e) => setCustomTheme({ ...customTheme, gradient_start: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Gradient fin</label>
              <input
                type="color"
                value={customTheme.gradient_end}
                onChange={(e) => setCustomTheme({ ...customTheme, gradient_end: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Image de fond (URL)</label>
              <input
                type="url"
                value={backgroundImageUrl}
                onChange={(e) => setBackgroundImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Image d'en-tête (URL)</label>
              <input
                type="url"
                value={headerImageUrl}
                onChange={(e) => setHeaderImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
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
            <div key={index} className="dynamic-item">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom du champ</label>
                  <input
                    type="text"
                    value={field.field_name}
                    onChange={(e) => handleFormFieldChange(index, 'field_name', e.target.value)}
                    placeholder="Ex: phone_number"
                  />
                </div>

                <div className="form-group">
                  <label>Label</label>
                  <input
                    type="text"
                    value={field.field_label}
                    onChange={(e) => handleFormFieldChange(index, 'field_label', e.target.value)}
                    placeholder="Ex: Numéro de téléphone"
                  />
                </div>

                <div className="form-group">
                  <label>Type de champ</label>
                  <select
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
                  <label>Ordre d'affichage</label>
                  <input
                    type="number"
                    value={field.display_order}
                    onChange={(e) => handleFormFieldChange(index, 'display_order', parseInt(e.target.value))}
                    min={1}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
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
