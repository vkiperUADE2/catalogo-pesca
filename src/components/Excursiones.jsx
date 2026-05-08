function Excursiones({ excursiones, telefono }) {
  return (
    <section id="excursiones">
      <h2>Excursiones</h2>

      <div className="productos-grid excursiones-grid">
        {excursiones.map((excursion) => (
          <div className="producto-card excursion-card" key={excursion.id}>
            <img
              className="excursion-imagen"
              src={excursion.imagen}
              alt={excursion.titulo}
            />

            <a
              href={`https://wa.me/${telefono}?text=${encodeURIComponent(`Hola, quiero consultar por la excursión: ${excursion.titulo}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <button>Consultar por WhatsApp</button>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Excursiones
