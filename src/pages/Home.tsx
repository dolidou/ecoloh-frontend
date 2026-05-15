import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import eventService from "../services/eventService";
import categoryService, { Category } from "../services/categoryService";

interface ContentItem {
  t: string;
  p: number | string;
  d: string;
}

interface EventTheme {
  id?: number;
  event_id?: number;
  primary_color?: string;
  secondary_color?: string;
  color_accent?: string;
  color_text?: string;
  gradient_start?: string;
  gradient_end?: string;
  font_family?: string;
  logo_url?: string;
  banner_url?: string;
}

interface EventFormField {
  id: number;
  event_id: number;
  field_name: string;
  field_type: string;
  field_label: string;
  is_required: boolean;
  order: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  category?: string;
  cover_image?: string;
  is_category_hero?: boolean;
  theme?: EventTheme;
  ticket_types?: Array<{
    id: number;
    name: string;
    price: number;
    description?: string;
  }>;
  form_fields?: EventFormField[];
}

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedItem, setSelectedItem] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [currentItemType, setCurrentItemType] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [categoryEvents, setCategoryEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const loadFeaturedEvents = useCallback(async () => {
    try {
      const response = await eventService.getFeaturedEvents();
      const events = response.data?.data || [];
      if (events.length > 0) {
        setFeaturedEvents(events);
        setSelectedEvent(events[0]);
      }
    } catch (error) {
      console.error("Error loading featured events:", error);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const getCategoryInfo = (slug: string): Category | undefined => {
    return categories.find((c) => c.slug === slug);
  };

  const handleThemeChange = useCallback(
    async (theme: string): Promise<void> => {
      setSelectedTheme(theme);
      setSelectedItem("");
      setCurrentItemType("");

      // Load events from BD by category
      try {
        const response = await eventService.getActiveEvents();
        const allEvents = (response.data || []) as Event[];
        const categoryEventsData = allEvents.filter(
          (e: Event) => (e as any).category === theme,
        );
        setCategoryEvents(categoryEventsData);

        // Find the hero event for this category (for header display)
        const heroEvent = categoryEventsData.find((e) => e.is_category_hero);
        if (heroEvent) {
          console.log(
            "✅ Hero event found:",
            heroEvent.title,
            "Cover:",
            heroEvent.cover_image,
          );
          setSelectedEvent(heroEvent);
        } else if (categoryEventsData.length > 0) {
          console.log(
            "ℹ️ Using first event:",
            categoryEventsData[0].title,
            "Cover:",
            categoryEventsData[0].cover_image,
          );
          setSelectedEvent(categoryEventsData[0]);
        } else {
          console.log("⚠️ No events for category:", theme);
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error("Error loading events by category:", error);
        setCategoryEvents([]);
        setSelectedEvent(null);
      }
    },
    [],
  );

  useEffect(() => {
    loadFeaturedEvents();
    loadCategories();
  }, [loadFeaturedEvents, loadCategories]);

  // Reload categories periodically to reflect visibility changes
  useEffect(() => {
    const interval = setInterval(() => {
      loadCategories();
    }, 5000); // Reload every 5 seconds

    return () => clearInterval(interval);
  }, [loadCategories]);

  useEffect(() => {
    handleThemeChange("default");
  }, [handleThemeChange]);

  const handleSelectItem = (item: ContentItem): void => {
    setSelectedItem(item.t);
    setCurrentItemType(item.p === "dynamic" ? "dynamic" : "standard");
  };

  const getTotalPrice = (): number | string => {
    if (currentItemType === "dynamic") {
      return countAdult * 300 + countChild * 200;
    }
    const selectedTicket = categoryEvents
      .flatMap((e) => e.ticket_types || [])
      .find((t) => t.name === selectedItem);
    return selectedTicket?.price || 0;
  };

  const handleReserve = (): void => {
    if (!selectedItem) {
      alert("Veuillez sélectionner une activité");
      return;
    }
    setFormData({});
    setShowReservationModal(true);
  };

  const handleFormFieldChange = (fieldName: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handlePayment = (): void => {
    const requiredFields = selectedEvent?.form_fields?.filter((f) => f.is_required) || [];
    const missingFields = requiredFields.filter((f) => !formData[f.field_name]);

    if (missingFields.length > 0) {
      alert(
        `Veuillez remplir les champs obligatoires: ${missingFields.map((f) => f.field_label).join(", ")}`
      );
      return;
    }

    setShowReservationModal(false);
  };

  const showSportFields = selectedTheme === "default";
  const showTicketSelection = currentItemType === "dynamic";

  // Debug: Log selected event
  useEffect(() => {
    console.log("=== SELECTED EVENT ===");
    console.log("selectedEvent:", selectedEvent);
    console.log("cover_image:", selectedEvent?.cover_image);
    console.log("title:", selectedEvent?.title);
    console.log("category:", selectedEvent?.category);
  }, [selectedEvent]);

  // Apply theme colors dynamically from event data
  useEffect(() => {
    const root = document.documentElement;
    const defaultColors = {
      primary_color: "#2ecc71",
      secondary_color: "#27ae60",
      color_text: "#1a1a1a",
      gradient_start: "#f5f7fa",
      gradient_end: "#c3cfe2",
    };

    const t = selectedEvent?.theme || defaultColors;

    root.style.setProperty("--primary", t.primary_color || defaultColors.primary_color);
    root.style.setProperty("--secondary", t.secondary_color || defaultColors.secondary_color);
    root.style.setProperty("--text", t.color_text || defaultColors.color_text);
    root.style.setProperty(
      "--bg-gradient",
      `linear-gradient(135deg, ${t.gradient_start || defaultColors.gradient_start} 0%, ${t.gradient_end || defaultColors.gradient_end} 100%)`
    );
    root.style.setProperty("--glass", "rgba(255, 255, 255, 0.05)");
  }, [selectedEvent]);

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        margin: 0,
        padding: 0,
        background: "var(--bg-gradient)",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        color: "var(--text)",
        width: "100%",
        overflowX: "hidden",
      }}
      data-theme={selectedTheme}
    >
      {/* News Ticker */}
      <section
        style={{
          background: "#1a1a1a",
          color: "white",
          height: "40px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          fontSize: "0.9rem",
          zIndex: 2000,
          width: "100%",
        }}
        aria-label="Événements à la une"
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "scroll-left 30s linear infinite",
          }}
        >
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                style={{
                  padding: "0 40px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "0.9rem",
                }}
                aria-label={`Aller à ${event.title}`}
              >
                <span style={{ color: "var(--primary)", marginRight: "10px" }}>
                  🔥 NOUVEAU:
                </span>
                {event.title} -{" "}
                {new Date(event.start_date).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </button>
            ))
          ) : (
            <div style={{ padding: "0 40px", fontWeight: 600 }}>
              <span style={{ color: "var(--primary)", marginRight: "10px" }}>
                🔥 NOUVEAU:
              </span>{" "}
              Découvrez nos événements à venir!
            </div>
          )}
        </div>
      </section>

      {/* Complaint Button */}
      <button
        onClick={() => setShowComplaintModal(true)}
        style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          background: "#e74c3c",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "30px",
          fontWeight: 800,
          cursor: "pointer",
          zIndex: 1001,
          boxShadow: "0 10px 20px rgba(231,76,60,0.3)",
          fontSize: "1rem",
        }}
      >
        ⚠️ Réclamation
      </button>

      {/* Header avec image - Affiche l'événement sélectionné OU la catégorie */}
      <header
        style={{
          height: "400px",
          width: "100%",
          backgroundImage: selectedEvent?.cover_image
            ? (console.log('Using event image:', selectedEvent.cover_image), `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url('${selectedEvent.cover_image}')`)
            : (console.log('Using category image:', getCategoryInfo(selectedTheme)?.image_url), `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url('${getCategoryInfo(selectedTheme)?.image_url || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200'}')`),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          clipPath: "ellipse(150% 100% at 50% 0%)",
          color: "white",
          position: "relative",
          marginBottom: 0,
          transition: "background-image 0.5s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "30px",
            zIndex: 1001,
          }}
        >
          <img
            src="/logo-ecoloh.png"
            alt="Logo ECOLOH"
            style={{
              height: "70px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML =
                '<div style="font-size: 2rem; font-weight: 800; color: white; text-shadow: 0 4px 6px rgba(0,0,0,0.3)">ECOLOH</div>';
            }}
          />
        </div>

        {/* User Bar - Change selon l'état de connexion */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            zIndex: 1001,
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line sonarjs/no-negated-condition */}
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 600,
                  backdropFilter: "blur(5px)",
                  fontSize: "0.9rem",
                }}
              >
                Connexion
              </button>
              <button
                onClick={() => navigate("/register")}
                style={{
                  background: "var(--primary)",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 600,
                  backdropFilter: "blur(5px)",
                  fontSize: "0.9rem",
                }}
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              <span
                style={{ color: "white", fontSize: "0.95rem", fontWeight: 600 }}
              >
                Bienvenue,{" "}
                <span style={{ color: "var(--primary)" }}>
                  {user?.name || "Admin"}
                </span>
              </span>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  style={{
                    background: "var(--primary)",
                    border: "none",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    backdropFilter: "blur(5px)",
                    fontSize: "0.9rem",
                  }}
                >
                  🏛️ Admin
                </button>
              )}
              <button
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                style={{
                  background: "#e74c3c",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 600,
                  backdropFilter: "blur(5px)",
                  fontSize: "0.9rem",
                }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>

        {/* Header Content */}
        <div>
          <h1
            style={{ fontSize: "3rem", fontWeight: 800, margin: "0 0 10px 0" }}
          >
            {selectedEvent?.title ||
              getCategoryInfo(selectedTheme)?.title ||
              "ECOLOH"}
          </h1>
          <p style={{ fontSize: "1.2rem", margin: 0 }}>
            {selectedEvent?.description ||
              getCategoryInfo(selectedTheme)?.description ||
              "Découvrez nos événements"}
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "-80px auto 50px",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "var(--text)",
          }}
        >
          Étape 1 : Choisissez votre activité
        </h2>

        {/* Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {categoryEvents.length > 0
            ? categoryEvents.flatMap(
                (event) =>
                  event.ticket_types?.map((ticket) => {
                    const isDynamic =
                      ticket.description?.includes("Adulte") &&
                      ticket.description?.includes("Enfant");
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => {
                          handleSelectItem({
                            t: ticket.name,
                            p: isDynamic ? "dynamic" : ticket.price,
                            d: ticket.description || "",
                          });
                          setSelectedEvent(event);
                        }}
                        style={{
                          background: "var(--glass)",
                          backdropFilter: "blur(20px)",
                          borderRadius: "24px",
                          padding: "25px",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                          border:
                            selectedItem === ticket.name
                              ? "3px solid var(--primary)"
                              : "1px solid rgba(255,255,255,0.2)",
                          textAlign: "center",
                          cursor: "pointer",
                          transform:
                            selectedItem === ticket.name
                              ? "scale(1.05)"
                              : "scale(1)",
                          transition: "all 0.3s ease",
                          color: "var(--text)",
                        }}
                        aria-pressed={selectedItem === ticket.name}
                      >
                        <h3
                          style={{ margin: "0 0 10px 0", color: "var(--text)" }}
                        >
                          {ticket.name}
                        </h3>
                        <div
                          style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: "var(--primary)",
                            margin: "10px 0",
                          }}
                        >
                          {isDynamic
                            ? "À partir de 200"
                            : ticket.price === 0
                              ? "GRATUIT"
                              : `${ticket.price} DA`}
                        </div>
                        <p style={{ margin: 0, color: "var(--text)" }}>
                          {ticket.description || "Type de ticket"}
                        </p>
                      </button>
                    );
                  }) || [],
              )
            : null}
        </div>

        {/* Reservation Form */}
        <div
          style={{
            background: "var(--glass)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "var(--text)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "var(--text)" }}>
            Étape 2 : Détails de la réservation
          </h2>

          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              htmlFor="selected-item"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              Sélection actuelle
            </label>
            <input
              id="selected-item"
              type="text"
              value={selectedItem}
              readOnly
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                background: "white",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {showTicketSelection && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "15px",
              }}
            >
              <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label
                  htmlFor="count-adult"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  Adulte (300 DA)
                </label>
                <input
                  id="count-adult"
                  type="number"
                  value={countAdult}
                  onChange={(e) => setCountAdult(parseInt(e.target.value) || 0)}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background: "white",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label
                  htmlFor="count-child"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  Enfant (200 DA)
                </label>
                <input
                  id="count-child"
                  type="number"
                  value={countChild}
                  onChange={(e) => setCountChild(parseInt(e.target.value) || 0)}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background: "white",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {showSportFields && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label
                  htmlFor="event-date"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  Date
                </label>
                <input
                  id="event-date"
                  type="date"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background: "white",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label
                  htmlFor="event-time"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  Heure
                </label>
                <select
                  id="event-time"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background: "white",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                >
                  <option>17:00</option>
                  <option>19:00</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleReserve}
            style={{
              width: "100%",
              padding: "15px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "10px",
              fontSize: "1rem",
            }}
          >
            Réserver → ({getTotalPrice()} DA)
          </button>
        </div>
      </main>

      {/* Theme Switcher */}
      <nav
        style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          padding: "8px",
          borderRadius: "50px",
          display: "flex",
          gap: "10px",
          zIndex: 1000,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {categories
          .filter((cat) => (cat as any).visible === true || (cat as any).visible === 1)
          .map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleThemeChange(cat.slug)}
              style={{
                border: "none",
                background:
                  selectedTheme === cat.slug ? "var(--primary)" : "transparent",
                color: "white",
                padding: "10px 20px",
                borderRadius: "40px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
              }}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
      </nav>

      {/* Footer */}
      <footer
        style={{
          background: "#1a1a1a",
          color: "#ffffff",
          padding: "60px 20px 120px",
          marginTop: "80px",
          borderTop: "4px solid var(--primary)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
          }}
        >
          <div>
            <h4>EPIC ECOLOH</h4>
            <p>
              EPIC ECOLOH est un établissement public de wilaya chargé de la
              gestion et de la promotion de l'Oued El Harrach aménagé pour la
              wilaya d'Alger.
            </p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              📞 +213 (0) 23 922 831
              <br />
              ✉️ contact@ecoloh.dz
            </p>
          </div>
        </div>
      </footer>

      {/* Modal Réservation */}
      {showReservationModal && selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              width: "90%",
              maxWidth: "600px",
              color: "#333",
              margin: "20px 0",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Formulaire de Réservation</h2>
            <p style={{ color: "#666" }}>
              Événement: <strong>{selectedEvent.title}</strong>
            </p>
            <p style={{ color: "#666" }}>
              Ticket: <strong>{selectedItem}</strong>
            </p>

            {selectedEvent.form_fields && selectedEvent.form_fields.length > 0 ? (
              <>
                {selectedEvent.form_fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <div key={field.id} style={{ marginBottom: "15px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontWeight: 600,
                          color: "#333",
                        }}
                      >
                        {field.field_label}
                        {field.is_required && (
                          <span style={{ color: "#e74c3c" }}>*</span>
                        )}
                      </label>

                      {field.field_type === "textarea" ? (
                        <textarea
                          value={formData[field.field_name] || ""}
                          onChange={(e) =>
                            handleFormFieldChange(field.field_name, e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontFamily: "inherit",
                            minHeight: "100px",
                            boxSizing: "border-box",
                          }}
                          placeholder={`Entrez ${field.field_label.toLowerCase()}`}
                        />
                      ) : field.field_type === "select" ? (
                        <select
                          value={formData[field.field_name] || ""}
                          onChange={(e) =>
                            handleFormFieldChange(field.field_name, e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                        >
                          <option value="">-- Sélectionner --</option>
                          {field.field_label.includes("Catégorie") && (
                            <>
                              <option value="option1">Option 1</option>
                              <option value="option2">Option 2</option>
                            </>
                          )}
                        </select>
                      ) : field.field_type === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={formData[field.field_name] === "true"}
                          onChange={(e) =>
                            handleFormFieldChange(
                              field.field_name,
                              e.target.checked ? "true" : "false"
                            )
                          }
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <input
                          type={field.field_type === "email" ? "email" : "text"}
                          value={formData[field.field_name] || ""}
                          onChange={(e) =>
                            handleFormFieldChange(field.field_name, e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                          placeholder={`Entrez ${field.field_label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
              </>
            ) : (
              <p style={{ color: "#999" }}>
                Aucun champ supplémentaire requis pour cet événement
              </p>
            )}

            <button
              onClick={handlePayment}
              style={{
                width: "100%",
                padding: "15px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 800,
                cursor: "pointer",
                marginTop: "20px",
                marginBottom: "10px",
                fontSize: "1rem",
              }}
            >
              Payer ({getTotalPrice()} DA)
            </button>
            <button
              onClick={() => setShowReservationModal(false)}
              style={{
                width: "100%",
                padding: "15px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modal Réclamation */}
      {showComplaintModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              width: "90%",
              maxWidth: "500px",
              color: "#333",
            }}
          >
            <h3>Déposer une réclamation</h3>
            <textarea
              placeholder="Décrivez votre problème ici..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontFamily: "inherit",
                marginBottom: "15px",
                minHeight: "120px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => setShowComplaintModal(false)}
              style={{
                width: "100%",
                padding: "15px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 800,
                cursor: "pointer",
                marginBottom: "10px",
                fontSize: "1rem",
              }}
            >
              Envoyer
            </button>
            <button
              onClick={() => setShowComplaintModal(false)}
              style={{
                width: "100%",
                padding: "15px",
                background: "#7f8c8d",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* Tous les thèmes appliqués dynamiquement via useEffect avec fallback par défaut */

        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        * {
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        body {
          margin: 0;
          background: #f5f7fa;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
