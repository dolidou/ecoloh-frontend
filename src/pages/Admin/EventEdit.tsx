import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import categoryService, { Category } from '../../services/categoryService';

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
  '🛎️', '🔔', '🔕', '🧎', '🧏', '🧖', '🧗', '🧘', '🧠', '🧡',
  '💛', '💚', '💙', '💜', '🖤', '🍽️', '🍴', '🥄'
];

export default function EventEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📌');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'active' | 'inactive' | 'cancelled'>('draft');
  const [category, setCategory] = useState('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [backgroundImagePreview, setBackgroundImagePreview] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);

  const [ticketTypes, setTicketTypes] = useState<Array<{ name: string; description?: string; price: number; quantity: number }>>([]);
  const [formFields, setFormFields] = useState<
    Array<{
      id?: number;
      field_name: string;
      field_type: 'text' | 'email' | 'number' | 'phone' | 'textarea' | 'select' | 'checkbox';
      field_label: string;
      is_required: boolean;
      display_order: number;
    }>
  >([]);

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
        visible: false,
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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (!id) return;
        const response = await adminService.getEvent(Number(id));
        const event = response.data?.data || response.data;

        setTitle(event.title || '');
        setDescription(event.description || '');
        setStartDate(event.start_date?.split('T')[0] || '');
        setEndDate(event.end_date?.split('T')[0] || '');
        setLocation(event.location || '');
        setMaxCapacity(event.total_capacity || 100);
        setIsFeatured(event.featured || false);
        setStatus(event.status || 'draft');
        setCategory(event.category || '');
        setTicketTypes(event.ticket_types || []);
        setFormFields(event.form_fields || []);
        setBackgroundImageUrl(event.cover_image || '');
        setBackgroundImagePreview(event.cover_image || '');
        setError(null);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Erreur lors du chargement de l\'événement');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

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

  const extractPhotoId = (url: string): string => {
    const match = url.match(/photos\/[a-zA-Z0-9_-]*-([a-zA-Z0-9]{11})$/);
    return match ? match[1] : '';
  };

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBackgroundImageUrl(url);

    // Simply use the URL directly as preview
    if (url) {
      setBackgroundImagePreview(url);
    } else {
      setBackgroundImagePreview('');
    }
  }, []);

  const handleImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.size, file.type);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploadingBg(true);
    try {
      const response = await adminService.uploadImage(file);
      console.log('Upload response:', response);
      if (response.success) {
        setBackgroundImageUrl(response.url);
      } else {
        alert('Erreur: ' + (response.message || 'Upload échoué'));
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      console.error('Response data:', err.response?.data);
      alert('Erreur lors de l\'upload: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingBg(false);
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!id) return;

      const eventData: any = {
        title,
        description,
        start_date: startDate,
        end_date: endDate || startDate,
        location,
        total_capacity: maxCapacity,
        featured: isFeatured,
        status,
        category: category || undefined,
        ticket_types: ticketTypes.filter(t => t.name.trim() !== ''),
        form_fields: formFields.filter(f => f.field_name.trim() !== '' && f.field_label.trim() !== ''),
      };

      if (backgroundImageUrl) {
        eventData.cover_image = backgroundImageUrl;
      }

      await adminService.updateEvent(Number(id), eventData);
      navigate('/admin/events');
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Erreur lors de la mise à jour de l\'événement');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 className="section-title">✏️ Modifier l'Événement</h2>
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
        <div className="form-section">
          <h3 className="form-section-title">📋 Informations de Base</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Titre *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Date de début *</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Date de fin</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Lieu</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacité maximale *</label>
              <input
                id="capacity"
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
                required
                min={1}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Statut</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'active' | 'inactive' | 'cancelled')}
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="category"
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
              <label htmlFor="featured">
                <input
                  id="featured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                À la une
              </label>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="bg-image">Image de bannière 🖼️</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  id="bg-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageInputChange}
                  disabled={uploadingBg}
                  style={{ flex: 1 }}
                />
                {uploadingBg && <span style={{ color: '#27ae60' }}>Upload...</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7f8c8d', margin: '0 0 10px 0' }}>OU entrez une URL directe d'image</p>
              <input
                id="bg-image"
                type="text"
                value={backgroundImageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://images.unsplash.com/... ou https://images.pexels.com/..."
              />
              <p style={{ fontSize: '0.8rem', color: '#e74c3c', margin: '5px 0 0 0' }}>💡 Pour Unsplash: clic-droit sur l'image → Copier l'URL de l'image</p>
              {backgroundImagePreview && (
                <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', maxHeight: '150px' }}>
                  <img src={backgroundImagePreview} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Types */}
        <div className="form-section">
          <h3 className="form-section-title">🎫 Types de Tickets</h3>
          {ticketTypes.map((ticket, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor={`ticket-name-${index}`}>Nom du ticket</label>
                  <input
                    id={`ticket-name-${index}`}
                    type="text"
                    value={ticket.name}
                    onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                    placeholder="Ex: Accès Standard"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`ticket-price-${index}`}>Prix (DA)</label>
                  <input
                    id={`ticket-price-${index}`}
                    type="number"
                    value={ticket.price}
                    onChange={(e) => handleTicketTypeChange(index, 'price', parseFloat(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`ticket-quantity-${index}`}>Quantité</label>
                  <input
                    id={`ticket-quantity-${index}`}
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketTypeChange(index, 'quantity', parseInt(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor={`ticket-description-${index}`}>Description</label>
                  <textarea
                    id={`ticket-description-${index}`}
                    value={ticket.description || ''}
                    onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTicketType(index)}
                  style={{
                    padding: '8px 16px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddTicketType}
            style={{
              padding: '10px 20px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + Ajouter un type de ticket
          </button>
        </div>

        {/* Form Fields Section */}
        <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
          <h3 className="form-section-title">📝 Champs du Formulaire de Réservation</h3>
          {formFields.map((field, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
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
                    <option value="text">Texte</option>
                    <option value="email">Email</option>
                    <option value="number">Nombre</option>
                    <option value="phone">Téléphone</option>
                    <option value="textarea">Zone de texte</option>
                    <option value="select">Liste déroulante</option>
                    <option value="checkbox">Case à cocher</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`field-order-${index}`}>Ordre d'affichage</label>
                  <input
                    id={`field-order-${index}`}
                    type="number"
                    value={field.display_order}
                    onChange={(e) => handleFormFieldChange(index, 'display_order', Number.parseInt(e.target.value))}
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

                {formFields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFormField(index)}
                    style={{
                      padding: '8px 16px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddFormField}
            style={{
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + Ajouter un champ
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '15px',
              background: submitting ? '#95a5a6' : '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            style={{
              flex: 1,
              padding: '15px',
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
        .form-section {
          background: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 25px;
          border: 1px solid #e0e0e0;
        }

        .form-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #2ecc71;
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }
      `}</style>
    </div>
  );
}
