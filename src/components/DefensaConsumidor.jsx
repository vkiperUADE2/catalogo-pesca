function DefensaConsumidor() {
  return (
    <section className="defensa-section">
      <div className="defensa-contenido">
        <div className="defensa-header">
          <span className="section-kicker">Información al consumidor</span>
          <h2>Defensa del consumidor</h2>
        </div>

        <div className="defensa-items">

          <div className="defensa-item">
            <h3>Consultas y reclamos</h3>
            <p>
              Ante cualquier consulta o reclamo escribinos a nuestro correo electrónico.
            </p>
            <a
              href="mailto:kayaksaccesoriosymas@gmail.com"
              className="defensa-link"
            >
              kayaksaccesoriosymas@gmail.com
            </a>
          </div>

          <div className="defensa-item">
            <h3>Redondeo del vuelto</h3>
            <p>
              En cumplimiento de la normativa vigente, el vuelto se redondea al múltiplo de $1 más cercano.
            </p>
          </div>

          <div className="defensa-item">
            <h3>Cambios y devoluciones — 30 días</h3>
            <p>
              Aceptamos cambios y devoluciones dentro de los 30 días de efectuada la compra, conforme a la Ley 24.240 de Defensa del Consumidor.
            </p>
          </div>

          <div className="defensa-item">
            <h3>Libro de quejas</h3>
            <p>
              Podés registrar tu queja enviando un correo electrónico a:
            </p>
            <a
              href="mailto:kayaksaccesoriosymas@gmail.com"
              className="defensa-link"
            >
              kayaksaccesoriosymas@gmail.com
            </a>
          </div>

          <div className="defensa-item">
            <h3>Diferencia de precios y medios de pago</h3>
            <p>
              En caso de diferencia entre el precio exhibido y el cobrado, prevalece el precio más favorable para el consumidor. Los precios incluyen IVA. Aceptamos efectivo y transferencia bancaria.
            </p>
          </div>

          <div className="defensa-item">
            <h3>Página de Defensa del Consumidor</h3>
            <p>
              Podés realizar denuncias y consultas en el sitio oficial del gobierno nacional.
            </p>
            <a
              href="https://www.argentina.gob.ar/produccion/defensadelconsumidor"
              target="_blank"
              rel="noreferrer"
              className="defensa-link"
            >
              consumidor.gob.ar
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

export default DefensaConsumidor
