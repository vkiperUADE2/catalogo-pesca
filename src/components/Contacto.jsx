function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 2C6.55 2 2.08 6.45 2.08 11.92c0 1.92.55 3.72 1.52 5.24L2 22l4.98-1.55a9.9 9.9 0 0 0 5.06 1.39c5.49 0 9.96-4.45 9.96-9.92S17.53 2 12.04 2Zm0 18.18c-1.63 0-3.15-.47-4.43-1.28l-.32-.2-2.7.84.87-2.61-.21-.34a8.12 8.12 0 0 1-1.5-4.67c0-4.56 3.72-8.26 8.29-8.26 4.58 0 8.3 3.7 8.3 8.26s-3.72 8.26-8.3 8.26Zm4.78-6.15c-.26-.13-1.55-.76-1.79-.85-.24-.09-.42-.13-.6.13-.17.26-.68.85-.83 1.02-.15.17-.31.19-.57.06-.26-.13-1.1-.4-2.1-1.29-.78-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.6-1.43-.82-1.96-.22-.51-.44-.44-.6-.45h-.51c-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.82 2.78 4.41 3.89.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.24-.06-.11-.24-.18-.5-.31Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.8A3.96 3.96 0 0 0 3.8 7.75v8.5a3.96 3.96 0 0 0 3.95 3.95h8.5a3.96 3.96 0 0 0 3.95-3.95v-8.5a3.96 3.96 0 0 0-3.95-3.95h-8.5ZM12 7.15A4.85 4.85 0 1 1 7.15 12 4.85 4.85 0 0 1 12 7.15Zm0 1.8A3.05 3.05 0 1 0 15.05 12 3.05 3.05 0 0 0 12 8.95Zm5.15-2.25a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.25A7.26 7.26 0 0 0 4.75 9.5c0 5.25 6.42 11.68 6.69 11.95a.8.8 0 0 0 1.12 0c.27-.27 6.69-6.7 6.69-11.95A7.26 7.26 0 0 0 12 2.25Zm0 17.45c-1.38-1.49-5.65-6.42-5.65-10.2A5.65 5.65 0 1 1 17.65 9.5c0 3.78-4.27 8.71-5.65 10.2Zm0-13.1a2.9 2.9 0 1 0 2.9 2.9A2.9 2.9 0 0 0 12 6.6Zm0 4.2a1.3 1.3 0 1 1 1.3-1.3 1.3 1.3 0 0 1-1.3 1.3Z" />
    </svg>
  )
}

function Contacto({ telefono }) {
  const mensajeWhatsApp = 'Hola, quiero hacer una consulta para Casa de Pesca Pierre Bandenay.'
  const instagramUrl = 'https://www.instagram.com/pierrebandenay?igsh=MWlqNjdxdWc2Zjlx'
  const mapsUrl = 'https://www.google.com/maps/place/Casa+de+pesca+Pierrebandenay/data=!4m2!3m1!1s0x0:0xcb7f9a973c82d031?sa=X&ved=1t:2428&ictx=111'

  return (
    <section id="contacto" className="contacto-section">
      <div className="contacto-contenido">
        <div>
          <span className="section-kicker">Atención y consultas</span>
          <h2>Contacto</h2>
          <p>
            Escribinos por WhatsApp, seguinos en Instagram o acercate al local.
          </p>
        </div>

        <div className="contacto-links">
          <a
            className="contacto-link"
            href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsApp)}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contacto-icon">
              <WhatsAppIcon />
            </span>
            <span>
              <strong>WhatsApp</strong>
              <small>Consultar disponibilidad</small>
            </span>
          </a>

          <a
            className="contacto-link"
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contacto-icon">
              <InstagramIcon />
            </span>
            <span>
              <strong>Instagram</strong>
              <small>@pierrebandenay</small>
            </span>
          </a>

          <a
            className="contacto-link contacto-direccion"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contacto-icon">
              <MapPinIcon />
            </span>
            <span>
              <strong>Avenida Cabildo 2280, Local 11</strong>
              <small>Buenos Aires, Argentina, 1426</small>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contacto
