function Categorias({ categorias }) {
  return (
    <section id="catalogo">
      <span className="section-kicker">{'Cat\u00e1logo'}</span>
      <h2>{'Categor\u00edas'}</h2>

      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <a className="categoria-card" href="#productos" key={categoria.nombre}>
            {categoria.imagen ? (
              <img src={categoria.imagen} alt={categoria.nombre} />
            ) : (
              <div className="categoria-placeholder" aria-hidden="true">
                <span>{categoria.inicial}</span>
              </div>
            )}
            <h3>{categoria.nombre}</h3>
            <small>{categoria.textoImagen}</small>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Categorias
