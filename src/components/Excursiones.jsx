function Excursiones({ excursiones, verExcursion }) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')

  return (
    <section id="excursiones">
      <h2>Excursiones</h2>

      {excursiones.length === 0 ? (
        <p className="sin-resultados">No encontramos excursiones con esa busqueda.</p>
      ) : (
        <div className="productos-grid excursiones-grid">
          {excursiones.map((excursion) => (
            <article
              className="excursion-card"
              key={excursion.id}
              onClick={() => verExcursion?.(excursion)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  verExcursion?.(excursion)
                }
              }}
              role="button"
              tabIndex="0"
              aria-label={`Ver excursion ${excursion.titulo}`}
            >
              {excursion.imagen ? (
                <img
                  className="excursion-imagen"
                  src={excursion.imagen}
                  alt={excursion.titulo}
                />
              ) : (
                <div className="excursion-imagen excursion-placeholder" />
              )}

              <div className="excursion-info">
                <h3>{excursion.titulo}</h3>

                <div className="excursion-meta">
                  <span>Salida: {excursion.lugarSalida}</span>
                  {excursion.lugarExcursion && (
                    <span>Excursion: {excursion.lugarExcursion}</span>
                  )}
                  <span>Duracion: {excursion.duracion}</span>
                </div>

                <h4>${formatoPrecio.format(excursion.precio)}</h4>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    verExcursion?.(excursion)
                  }}
                >
                  Ver excursion
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Excursiones
