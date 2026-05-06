function Categorias({ categorias }) {
  return (
    <section id="catalogo">
      <h2>Categorías</h2>

      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <div className="categoria-card" key={categoria}>
            <h3>{categoria}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categorias