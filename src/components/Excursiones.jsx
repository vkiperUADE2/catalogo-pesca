function Excursiones({ excursiones, telefono }) {
  return (
    <section id="excursiones">
      <h2>Excursiones</h2>

      <div className="productos-grid excursiones-grid">
        {excursiones.map((excursion) => (
          <div className="producto-card" key={excursion.id}>
            <div className="producto-imagen"></div>

            <h3>{excursion.titulo}</h3>

            <p>{excursion.descripcion}</p>

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
