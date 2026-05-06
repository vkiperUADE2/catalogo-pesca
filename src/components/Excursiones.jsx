function Excursiones({ excursiones }) {
  return (
    <section id="excursiones">
      <h2>Excursiones</h2>

      <div className="productos-grid">
        {excursiones.map((excursion) => (
          <div className="producto-card" key={excursion.id}>
            <div className="producto-imagen"></div>

            <h3>{excursion.titulo}</h3>

            <p>{excursion.descripcion}</p>

            <button>Consultar por WhatsApp</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Excursiones