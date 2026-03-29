/**
 * templates/index.ts — Registro de los 6 templates Mixtli
 *
 * El agente usa esta tabla para seleccionar el template correcto
 * según sector + Energía + Formalidad calculados del briefing.
 *
 * ALGORITMO DE SELECCIÓN:
 * 1. Calcular Energía (1-5) y Formalidad (1-5) desde los adjetivos del briefing
 * 2. Consultar defaultPorSector[sector]
 * 3. Aplicar overrides según energía y formalidad
 * 4. Si el sector no existe → fallback T3 + preguntar al cliente por su giro
 */

export const TEMPLATES = {
  T1: {
    archivo: 'T1-CinemaVisual.astro',
    nombre: 'Cinema Visual',
    intencion: 'Mi trabajo habla por las imágenes',
    componentes: [
      'HeroCinema',
      'BreakNumerico',       // dato real: años/clientes — omitir si no hay dato
      'ServiciosGrid',
      'Gallery',             // mín. 5 fotos reales o generadas con NanaBanana
      'SocialProofResenas',  // solo si hay reseñas reales
      'CTAPrincipal',
      'ContactoWhatsApp',
      'Footer',
    ],
    requiereImagenes: true,
    requiereDatoReal: true,   // para BreakNumerico
    requiereUbicacion: false,
  },
  T2: {
    archivo: 'T2-SplitProfesional.astro',
    nombre: 'Split Profesional',
    intencion: 'Credibilidad antes que ventas',
    componentes: [
      'HeroSplit',
      'StatsCredenciales',   // datos reales: años, pacientes, casos — nunca inventar
      'ServiciosList',
      'ProcesoPasos',
      'FAQAccordion',
      'ContactoFormulario',
      'Footer',
    ],
    requiereImagenes: true,
    requiereDatoReal: true,   // para StatsCredenciales
    requiereUbicacion: false,
  },
  T3: {
    archivo: 'T3-PrecioAlFrente.astro',
    nombre: 'Precio Al Frente',
    intencion: 'El cliente decide por precio — dárselo inmediato',
    componentes: [
      'HeroMinimal',
      'ServiciosList',       // INMEDIATAMENTE después del hero — regla central de T3
      'SocialProofResenas',  // solo si hay reseñas reales
      'ContactoWhatsApp',    // incluye mapa vía googleMapsEmbed si tiene ubicación
      'Footer',
    ],
    requiereImagenes: false,  // funciona sin fotos
    requiereDatoReal: false,
    requiereUbicacion: false, // opcional — si tiene, se muestra mapa en ContactoWhatsApp
  },
  T4: {
    archivo: 'T4-Narrativo.astro',
    nombre: 'Narrativo',
    intencion: 'Tenemos historia y personalidad',
    componentes: [
      'HeroCinema',
      'HistoriaFilosofia',   // solo si hay cita o historia real del dueño
      'ServiciosTabbed',     // servicios agrupados por categoría
      'Gallery',             // mín. 5 fotos
      'SocialProofResenas',  // solo si hay reseñas reales
      'CTAPrincipal',
      'ContactoWhatsApp',
      'Footer',
    ],
    requiereImagenes: true,
    requiereDatoReal: false,
    requiereUbicacion: false,
  },
  T5: {
    archivo: 'T5-LocalUrgente.astro',
    nombre: 'Local Urgente',
    intencion: 'Estoy cerca — el mapa es mi argumento',
    componentes: [
      'HeroMinimal',
      'MapaProminente',      // mapa ANTES que servicios — regla central de T5
      'ServiciosList',       // máx. 8 items
      'HorarioVisual',       // OBLIGATORIO — preguntar si el cliente no lo dio
      'CTAPrincipal',
      'Footer',
    ],
    requiereImagenes: false,
    requiereDatoReal: true,   // horario completo obligatorio
    requiereUbicacion: true,  // OBLIGATORIO — T5 sin dirección no tiene sentido
  },
  T6: {
    archivo: 'T6-MinimalPremium.astro',
    nombre: 'Minimal Premium',
    intencion: 'Menos palabras, más peso. Exclusividad.',
    componentes: [
      'HeroMinimal',          // sin badge — el headline corto es el único argumento
      'ServiciosGrid',        // máx. 6 servicios bien descritos
      'SocialProofLogos',     // logos de clientes/certs — omitir si no hay ninguno
      'ProcesoTimeline',      // con etiquetas de tiempo cuando sea posible
      'FAQAccordion',
      'ContactoFormulario',   // email obligatorio en T6
      'Footer',
    ],
    requiereImagenes: false,
    requiereDatoReal: false,
    requiereUbicacion: false,
  },
} as const;

// ─── ASIGNACIÓN POR SECTOR (26 sectores) ──────────────────────────────────────
//
// Lógica de asignación:
//   T1 Cinema Visual    → negocios donde el trabajo visual es el argumento
//   T2 Split Prof.      → negocios donde la credibilidad técnica es lo primero
//   T3 Precio Al Frente → negocios donde el precio es la decisión clave
//   T4 Narrativo        → negocios con historia, personalidad o experiencia sensorial
//   T5 Local Urgente    → negocios donde la ubicación/proximidad es el diferenciador
//   T6 Minimal Premium  → servicios de alto valor donde menos = más

export const defaultPorSector: Record<string, keyof typeof TEMPLATES> = {
  // ── Belleza y cuidado personal ──────────────────────────────────────────────
  barberia_tradicional:    'T1',  // trabajo visual, tradición de barrio
  barberia_moderna:        'T3',  // precio competitivo, decisión rápida
  belleza_spa:             'T4',  // experiencia sensorial, historia de la fundadora
  estetica_general:        'T4',  // salón de belleza: narrativo + galería de trabajos
  nail_salon:              'T3',  // precio al frente, portfolio rápido
  tatuajes_piercing:       'T1',  // portfolio visual obligatorio, el arte habla

  // ── Salud y bienestar ───────────────────────────────────────────────────────
  consultorio_dental:      'T2',  // credibilidad antes: cédula, años, tecnología
  consultorio_medico:      'T2',  // credibilidad y proceso clínico
  veterinaria:             'T2',  // confianza para mascotas = credenciales primero
  gym_fitness:             'T1',  // transformaciones visuales, energía alta

  // ── Educación ───────────────────────────────────────────────────────────────
  educacion_capacitacion:  'T2',  // credibilidad del instructor, proceso pedagógico

  // ── Comida y bebida ─────────────────────────────────────────────────────────
  restaurante_formal:      'T6',  // experiencia premium, menos es más
  comida_rapida:           'T5',  // ubicación + horario + precio = decisión inmediata
  comida:                  'T5',  // taquería, fonda, local físico
  panaderia_cafeteria:     'T4',  // historia del lugar, experiencia del producto

  // ── Servicios profesionales ─────────────────────────────────────────────────
  abogado:                 'T6',  // autoridad, proceso claro, sin ruido visual
  contador:                'T2',  // credenciales primero, proceso de trabajo
  arquitecto_disenador:    'T1',  // portfolio visual es el cv
  agencia_digital:         'T6',  // proceso + resultados, clientela exigente
  servicios_profesionales: 'T6',  // genérico: consultoría, asesoría

  // ── Retail y comercio ───────────────────────────────────────────────────────
  tienda_ropa:             'T1',  // lookbook, el producto habla
  vendedor_catalogo:       'T3',  // catálogo de precios, conversión por precio

  // ── Creativos y eventos ─────────────────────────────────────────────────────
  fotografia:              'T1',  // portfolio = el negocio entero
  eventos_bodas:           'T4',  // aspiracional, emocional, narrativo

  // ── Inmuebles ───────────────────────────────────────────────────────────────
  inmobiliaria:            'T6',  // proceso de compra, confianza y proceso
};

// ─── OVERRIDES POR PERSONALIDAD ───────────────────────────────────────────────
//
// Reglas de prioridad:
//   1. Formalidad ≥ 4 tiene prioridad sobre Energía
//   2. Si ningún override aplica → se usa el default del sector
//   3. Sectores no reconocidos → T3 (fallback seguro) + solicitar aclaración

export function seleccionarTemplate(
  sector: string,
  energia: number,
  formalidad: number
): keyof typeof TEMPLATES {
  const base = defaultPorSector[sector] ?? 'T3';

  // ── Override por Formalidad alta (≥4) ─────────────────────────────────────
  if (formalidad >= 4) {
    // Belleza / personal care premium
    if (sector === 'barberia_tradicional')   return 'T2'; // maestro barbero = credenciales
    if (sector === 'barberia_moderna')       return 'T6'; // barbería upscale
    if (sector === 'belleza_spa')            return 'T6'; // spa de lujo
    if (sector === 'estetica_general')       return 'T6'; // salón premium
    if (sector === 'nail_salon')             return 'T4'; // nail art de alta gama

    // Salud premium
    if (sector === 'consultorio_dental')     return 'T6'; // clínica de especialidad
    if (sector === 'consultorio_medico')     return 'T6'; // clínica privada premium
    if (sector === 'gym_fitness')            return 'T2'; // club deportivo formal

    // Comida formal
    if (sector === 'comida')                 return 'T2'; // restaurante establecido
    if (sector === 'restaurante_formal')     return 'T6'; // fine dining — ya es T6
    if (sector === 'panaderia_cafeteria')    return 'T6'; // cafetería artesanal premium

    // Profesionales premium
    if (sector === 'abogado')               return 'T6'; // despacho de élite — ya T6
    if (sector === 'agencia_digital')        return 'T6'; // agencia enterprise — ya T6
    if (sector === 'arquitecto_disenador')   return 'T6'; // despacho premium
    if (sector === 'eventos_bodas')          return 'T6'; // wedding planner premium

    // Retail formal
    if (sector === 'tienda_ropa')            return 'T6'; // boutique premium
  }

  // ── Override por Energía alta (≥4) ────────────────────────────────────────
  if (energia >= 4) {
    // Belleza energética
    if (sector === 'barberia_tradicional')   return 'T1'; // ya es T1
    if (sector === 'barberia_moderna')       return 'T1'; // barbería urbana dinámica
    if (sector === 'belleza_spa')            return 'T1'; // spa con fuerte identidad visual
    if (sector === 'estetica_general')       return 'T1'; // salón con galería de trabajos
    if (sector === 'nail_salon')             return 'T1'; // nail art expresivo

    // Salud energética
    if (sector === 'consultorio_dental')     return 'T1'; // clínica moderna con galería
    if (sector === 'gym_fitness')            return 'T1'; // ya es T1

    // Comida energética
    if (sector === 'comida')                 return 'T4'; // restaurante con historia
    if (sector === 'panaderia_cafeteria')    return 'T1'; // fotos del producto = ventas

    // Creativos energéticos
    if (sector === 'arquitecto_disenador')   return 'T1'; // portfolio expresivo
    if (sector === 'eventos_bodas')          return 'T1'; // galería de eventos
    if (sector === 'tienda_ropa')            return 'T1'; // lookbook dinámico
    if (sector === 'fotografia')             return 'T1'; // ya es T1

    // Servicios con energía
    if (sector === 'servicios_profesionales') return 'T2'; // más credenciales que proceso
    if (sector === 'inmobiliaria')            return 'T4'; // propiedades con narrativa
    if (sector === 'agencia_digital')         return 'T1'; // portfolio de proyectos
  }

  return base;
}

// ─── FALLBACK — Sector no reconocido ─────────────────────────────────────────
//
// Si el sector del briefing no existe en defaultPorSector, seleccionarTemplate
// retorna 'T3' automáticamente (via ?? 'T3').
//
// En ese caso el agente DEBE:
//   1. Usar T3 como punto de partida
//   2. Agregar una nota al cliente: "No reconocí tu sector exacto.
//      ¿Tu negocio se acerca más a [opción A] o [opción B]?"
//   3. Si el cliente confirma un sector existente, correr seleccionarTemplate
//      con el sector correcto y ajustar el template si es necesario

// ─── EJEMPLOS DE USO ──────────────────────────────────────────────────────────
//
// seleccionarTemplate('nail_salon', 4, 2)   → 'T1'  (energía alta → Cinema Visual)
// seleccionarTemplate('nail_salon', 2, 4)   → 'T4'  (formalidad alta → Narrativo)
// seleccionarTemplate('nail_salon', 2, 2)   → 'T3'  (default → Precio Al Frente)
//
// seleccionarTemplate('consultorio_dental', 3, 4) → 'T6'  (formalidad alta → Premium)
// seleccionarTemplate('consultorio_dental', 4, 2) → 'T1'  (energía alta → Cinema)
// seleccionarTemplate('consultorio_dental', 2, 2) → 'T2'  (default → Credibilidad)
//
// seleccionarTemplate('negocio_desconocido', 3, 3) → 'T3' (fallback seguro)
