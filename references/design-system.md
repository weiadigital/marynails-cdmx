# Mixtli Design System — Reference

> Controla TODO lo visual: personalidad, colores, tipografía, composición, copy.
> Última actualización: 28 marzo 2026

---

## 1. INPUT Y DEFAULTS

Los datos del cliente llegan como texto libre o JSON:

```
nombre_negocio     → obligatorio
descripcion        → qué hace el negocio (1-2 oraciones)
sector             → uno de los 26 sectores
servicios          → lista de {nombre, precio} (puede venir como texto suelto)
direccion          → dirección física (puede no existir si es a domicilio)
horario            → días y horas
whatsapp           → 10 dígitos MX sin prefijo (tú agregas 521)
redes              → instagram, facebook, tiktok
fotos              → true/false
adjetivos          → 3 palabras que describen su negocio
especial           → promoción, mensaje, diferenciador, frase del dueño
```

### Defaults cuando falta un campo

| Campo faltante | Acción |
|---|---|
| sector | Inferir de la descripción. Fallback: servicios_profesionales |
| servicios | CTA directo sin lista. Headline: "Escríbenos para conocer nuestros servicios" |
| direccion | Omitir mapa. En footer solo ciudad/zona |
| horario | Omitir. NO inventar horarios |
| whatsapp | **ERROR CRÍTICO.** Responder: "Necesito el número de WhatsApp del cliente" |
| redes | Omitir íconos de redes |
| fotos | Asumir false |
| adjetivos | Usar defaults del sector (tabla §2) |
| especial | No generar sección de promoción |

---

## 2. SISTEMA DE PERSONALIDAD VISUAL

### Paso 1: Calcular personalidad

Tomar los 3 adjetivos del cliente y buscar en esta tabla:

| Palabra | Energía (1-5) | Formalidad (1-5) |
|---------|---------------|-----------------|
| artesanal | 2 | 2 |
| casero | 2 | 1 |
| premium | 3 | 5 |
| profesional | 3 | 3 |
| moderno | 4 | 3 |
| popular | 4 | 1 |
| elegante | 2 | 4 |
| trendy | 5 | 2 |
| confiable | 3 | 3 |
| rápido | 4 | 2 |
| limpio | 2 | 3 |
| exclusivo | 2 | 5 |
| divertido | 5 | 1 |
| natural | 2 | 2 |
| innovador | 4 | 4 |
| económico | 4 | 1 |
| familiar | 3 | 2 |
| especializado | 3 | 4 |
| acogedor | 2 | 2 |
| potente | 5 | 3 |
| puntual | 3 | 3 |
| creativo | 4 | 2 |
| tradicional | 2 | 3 |
| juvenil | 5 | 1 |
| serio | 2 | 4 |
| accesible | 3 | 1 |
| lujoso | 2 | 5 |
| relajado | 2 | 2 |
| enérgico | 5 | 2 |
| sobrio | 2 | 4 |
| fresco | 4 | 2 |
| cálido | 3 | 2 |
| minimalista | 2 | 4 |
| vibrante | 5 | 2 |
| sofisticado | 2 | 5 |
| dinámico | 5 | 3 |
| íntimo | 2 | 3 |
| experto | 3 | 4 |
| auténtico | 3 | 2 |
| discreto | 2 | 4 |

Si una palabra no está en la tabla, inferir valores por similitud semántica.
Promediar los 3 valores y redondear al entero más cercano.

### Defaults por sector (cuando no hay adjetivos)

| Sector | Energía | Formalidad |
|--------|---------|-----------|
| barberia_tradicional | 4 | 2 |
| barberia_moderna | 4 | 3 |
| belleza_spa | 2 | 4 |
| estetica_general | 3 | 3 |
| nail_salon | 3 | 3 |
| tatuajes_piercing | 5 | 2 |
| consultorio_dental | 2 | 4 |
| consultorio_medico | 2 | 5 |
| veterinaria | 3 | 3 |
| gym_fitness | 5 | 2 |
| educacion_capacitacion | 3 | 4 |
| restaurante_formal | 2 | 5 |
| comida_rapida | 5 | 1 |
| comida | 4 | 1 |
| panaderia_cafeteria | 3 | 3 |
| abogado | 2 | 5 |
| contador | 2 | 4 |
| arquitecto_disenador | 3 | 3 |
| agencia_digital | 4 | 4 |
| servicios_profesionales | 3 | 4 |
| tienda_ropa | 4 | 2 |
| vendedor_catalogo | 3 | 1 |
| fotografia | 4 | 2 |
| eventos_bodas | 3 | 4 |
| inmobiliaria | 2 | 5 |

### Paso 2: Traducir personalidad a CSS

**Energía** controla intensidad visual:

| Energía | Nombre | heading-weight | hero-size | shadow | --motion-profile |
|---------|--------|---------------|-----------|--------|-----------------|
| 1 | Zen | 300 | clamp(2rem, 6vw, 3.5rem) | ninguna | subtle |
| 2 | Serena | 400 | clamp(2rem, 6vw, 3.5rem) | 0 1px 2px oklch(0% 0 0 / 0.05) | subtle |
| 3 | Equilibrada | 600 | clamp(2rem, 7vw, 4rem) | 0 2px 8px oklch(0% 0 0 / 0.08) | fluid |
| 4 | Dinámica | 700 | clamp(2.25rem, 8vw, 4.5rem) | 0 3px 12px oklch(0% 0 0 / 0.10) | fluid |
| 5 | Eléctrica | 800 | clamp(2.5rem, 9vw, 5rem) | 0 4px 16px oklch(0% 0 0 / 0.15) | expressive |

**Formalidad** controla carácter y espacio:

| Formalidad | Nombre | border-radius | section-gap-mobile | section-gap-desktop | tono del copy |
|-----------|--------|--------------|-------------------|--------------------|----|
| 1 | Callejera | 16px | 32px | 48px | Directo, con modismos, precio al frente |
| 2 | Cercana | 10px | 40px | 56px | Amigable, cálido, tuteo |
| 3 | Profesional | 6px | 48px | 72px | Neutro, claro, informativo |
| 4 | Ejecutiva | 3px | 56px | 80px | Formal pero accesible, usted |
| 5 | Premium | 1px | 64px | 96px | Aspiracional, pocas palabras, mucho aire |

---

## 3. TOKENS OKLCH POR SECTOR

Copiar el bloque del sector a `src/styles/tokens.css`. Los 4 tokens mínimos son:
`primary`, `surface`, `text`, `cta`. Derivar los demás con la progresión estándar.

### Progresión estándar de tokens (basarse en `primary` H)

```css
:root {
  --color-primary:     oklch(L%  C   H);      /* definido por sector */
  --color-accent:      oklch(L2% C2  H2);     /* complementario o análogo */
  --color-surface:     oklch(98% 0.005 H);    /* fondo principal — casi blanco */
  --color-surface-alt: oklch(94% 0.010 H);    /* secciones alternas */
  --color-text:        oklch(18% 0.020 H);    /* texto principal */
  --color-muted:       oklch(52% 0.015 H);    /* texto secundario */
  --color-border:      oklch(84% 0.015 H);    /* bordes y separadores */
  --color-cta:         oklch(Lc% Cc  Hc);     /* definido por sector */
  --color-cta-hover:   oklch(from var(--color-cta) calc(l + 0.08) c h);
}
```

### Tokens por sector — 26 sectores

---

#### Belleza y cuidado personal

**barberia_tradicional** — Ámbar cálido, artesanal
```css
--color-primary: oklch(45% 0.12 30);
--color-accent:  oklch(65% 0.15 50);
--color-surface: oklch(97% 0.005 30);
--color-cta:     oklch(55% 0.20 25);
```

**barberia_moderna** — Carbón + menta, urbano
```css
--color-primary: oklch(20% 0.02 270);
--color-accent:  oklch(70% 0.15 145);
--color-surface: oklch(98% 0.005 0);
--color-cta:     oklch(70% 0.15 145);
```

**belleza_spa** — Rosa pálido, relajante
```css
--color-primary: oklch(70% 0.12 330);
--color-accent:  oklch(75% 0.08 80);
--color-surface: oklch(98% 0.005 330);
--color-cta:     oklch(65% 0.15 330);
```

**estetica_general** — Ciruela suave, cálido
```css
--color-primary: oklch(60% 0.14 340);
--color-accent:  oklch(75% 0.08 60);
--color-surface: oklch(98% 0.006 340);
--color-cta:     oklch(55% 0.16 340);
```

**nail_salon** — Rosa vibrante, expresivo
```css
--color-primary: oklch(65% 0.18 350);
--color-accent:  oklch(75% 0.10 80);
--color-surface: oklch(98% 0.005 350);
--color-cta:     oklch(65% 0.18 350);
```

**tatuajes_piercing** — Negro + naranja eléctrico, bold
```css
--color-primary: oklch(18% 0.02 0);
--color-accent:  oklch(68% 0.24 35);
--color-surface: oklch(96% 0.004 0);
--color-cta:     oklch(68% 0.24 35);
```

---

#### Salud y bienestar

**consultorio_dental** — Azul limpio, confianza
```css
--color-primary: oklch(55% 0.14 230);
--color-accent:  oklch(70% 0.10 185);
--color-surface: oklch(99% 0.003 230);
--color-cta:     oklch(55% 0.16 230);
```

**consultorio_medico** — Azul profundo, autoridad
```css
--color-primary: oklch(42% 0.12 240);
--color-accent:  oklch(68% 0.10 170);
--color-surface: oklch(99% 0.002 240);
--color-cta:     oklch(48% 0.14 240);
```

**veterinaria** — Verde cálido, cuidado
```css
--color-primary: oklch(52% 0.16 150);
--color-accent:  oklch(72% 0.12 85);
--color-surface: oklch(98% 0.005 150);
--color-cta:     oklch(52% 0.18 150);
```

**gym_fitness** — Naranja potente, energía máxima
```css
--color-primary: oklch(62% 0.24 35);
--color-accent:  oklch(50% 0.02 0);
--color-surface: oklch(97% 0.006 35);
--color-cta:     oklch(62% 0.26 35);
```

---

#### Educación

**educacion_capacitacion** — Azul marino, profesional
```css
--color-primary: oklch(42% 0.12 250);
--color-accent:  oklch(68% 0.14 200);
--color-surface: oklch(99% 0.003 250);
--color-cta:     oklch(55% 0.14 250);
```

---

#### Comida y bebida

**restaurante_formal** — Azul noche + dorado, premium
```css
--color-primary: oklch(28% 0.06 250);
--color-accent:  oklch(72% 0.18 82);
--color-surface: oklch(99% 0.002 250);
--color-cta:     oklch(72% 0.18 82);
```

**comida_rapida** — Rojo + amarillo, urgencia
```css
--color-primary: oklch(52% 0.26 20);
--color-accent:  oklch(78% 0.22 85);
--color-surface: oklch(98% 0.008 20);
--color-cta:     oklch(52% 0.28 20);
```

**comida** — Naranja cálido, apetito
```css
--color-primary: oklch(60% 0.22 30);
--color-accent:  oklch(70% 0.18 85);
--color-surface: oklch(98% 0.008 40);
--color-cta:     oklch(60% 0.22 30);
```

**panaderia_cafeteria** — Café tierra, acogedor
```css
--color-primary: oklch(48% 0.12 55);
--color-accent:  oklch(70% 0.10 85);
--color-surface: oklch(98% 0.008 55);
--color-cta:     oklch(48% 0.14 55);
```

---

#### Servicios profesionales

**abogado** — Azul oscuro + dorado, autoridad
```css
--color-primary: oklch(30% 0.05 250);
--color-accent:  oklch(68% 0.16 80);
--color-surface: oklch(99% 0.002 250);
--color-cta:     oklch(68% 0.16 80);
```

**contador** — Gris azulado, neutral técnico
```css
--color-primary: oklch(40% 0.06 240);
--color-accent:  oklch(60% 0.10 200);
--color-surface: oklch(99% 0.002 240);
--color-cta:     oklch(45% 0.08 240);
```

**arquitecto_disenador** — Gris cálido + terracota, estudio
```css
--color-primary: oklch(35% 0.04 50);
--color-accent:  oklch(62% 0.18 30);
--color-surface: oklch(98% 0.004 50);
--color-cta:     oklch(62% 0.18 30);
```

**agencia_digital** — Violeta + cyan, tech moderno
```css
--color-primary: oklch(52% 0.20 290);
--color-accent:  oklch(72% 0.18 195);
--color-surface: oklch(98% 0.005 290);
--color-cta:     oklch(62% 0.22 290);
```

**servicios_profesionales** — Azul índigo, sobrio
```css
--color-primary: oklch(45% 0.10 250);
--color-accent:  oklch(65% 0.08 200);
--color-surface: oklch(99% 0.003 250);
--color-cta:     oklch(50% 0.12 250);
```

---

#### Retail y comercio

**tienda_ropa** — Neutro cálido + acento moda, lookbook
```css
--color-primary: oklch(30% 0.04 40);
--color-accent:  oklch(65% 0.20 350);
--color-surface: oklch(98% 0.004 40);
--color-cta:     oklch(65% 0.20 350);
```

**vendedor_catalogo** — Verde accesible, precio al frente
```css
--color-primary: oklch(42% 0.16 145);
--color-accent:  oklch(68% 0.14 80);
--color-surface: oklch(98% 0.006 145);
--color-cta:     oklch(42% 0.18 145);
```

---

#### Creativos y eventos

**fotografia** — Negro + ámbar dorado, película
```css
--color-primary: oklch(16% 0.02 60);
--color-accent:  oklch(72% 0.20 75);
--color-surface: oklch(97% 0.004 60);
--color-cta:     oklch(72% 0.20 75);
```

**eventos_bodas** — Rosa polvos + dorado suave, aspiracional
```css
--color-primary: oklch(65% 0.10 355);
--color-accent:  oklch(78% 0.14 82);
--color-surface: oklch(99% 0.004 355);
--color-cta:     oklch(60% 0.12 355);
```

---

#### Inmuebles

**inmobiliaria** — Azul acero + dorado, confianza
```css
--color-primary: oklch(35% 0.05 250);
--color-accent:  oklch(65% 0.12 80);
--color-surface: oklch(99% 0.002 0);
--color-cta:     oklch(35% 0.05 250);
```

---

## 4. TIPOGRAFÍA POR SECTOR

Body es SIEMPRE **Inter**. Sin excepciones.

| Sector | Heading font | Carácter |
|--------|-------------|----------|
| barberia_tradicional | Bebas Neue | Bold, impacto, condensed |
| barberia_moderna | Space Grotesk | Geométrico, urbano |
| belleza_spa | Cormorant Garamond | Serif elegante, feminino suave |
| estetica_general | Cormorant Garamond | Serif elegante |
| nail_salon | Playfair Display | Serif expresivo |
| tatuajes_piercing | Bebas Neue | Bold, alto impacto |
| consultorio_dental | Source Sans 3 | Limpio, técnico, legible |
| consultorio_medico | Source Sans 3 | Limpio, autoridad clínica |
| veterinaria | Nunito | Amigable, redondeado |
| gym_fitness | Bebas Neue | Energético, condensed |
| educacion_capacitacion | Source Sans 3 | Profesional, claro |
| restaurante_formal | DM Serif Display | Serif elegante, premium |
| comida_rapida | Fredoka | Redondo, accesible, rápido |
| comida | Fredoka | Accesible, popular |
| panaderia_cafeteria | Playfair Display | Cálido, artesanal |
| abogado | DM Serif Display | Autoridad, sobriedad |
| contador | Space Grotesk | Preciso, técnico |
| arquitecto_disenador | Space Grotesk | Neutro, diseño |
| agencia_digital | Space Grotesk | Tech, moderno |
| servicios_profesionales | Space Grotesk | Profesional, neutro |
| tienda_ropa | Barlow | Condensed, lookbook |
| vendedor_catalogo | Inter | Neutro, legible |
| fotografia | Space Grotesk | Estudio, editorial |
| eventos_bodas | Cormorant Garamond | Aspiracional, fino |
| inmobiliaria | DM Serif Display | Confianza, proceso |

### Configuración Astro 6 Fonts API (top-level, no `experimental`)

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk', // ← cambiar según sector
      cssVariable: '--font-heading',
      weights: [700, 800, 900],
      subsets: ['latin', 'latin-ext'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      subsets: ['latin', 'latin-ext'],
    },
  ],
});
```

Usar `<Font cssVariable="--font-heading" />` y `<Font cssVariable="--font-body" />`
en el `<head>` del BaseLayout. NO usar `<link>` a Google Fonts CDN.

---

## 5. COMPOSICIÓN — DECISIONES AUTOMÁTICAS

### Tipo de hero

| Condición | Componente | Notas |
|-----------|-----------|-------|
| fotos == true Y sector visual (T1/T4) | HeroCinema | Foto como background, overlay, texto + CTA |
| fotos == true Y sector profesional (T2) | HeroSplit | Texto 55% izquierda, imagen 45% derecha |
| fotos == false (cualquier sector) | HeroMinimal | Sin imagen, headline grande con color, CTA |
| T5 Local Urgente (siempre) | HeroMinimal | Headline menciona ubicación o colonia |

### Layout de servicios

| Condición | Componente |
|-----------|-----------|
| servicios.length ≤ 6 | ServiciosList |
| servicios.length 7-12 | ServiciosGrid (columnas=3) |
| servicios agrupados por categoría (T4, T6) | ServiciosTabbed |

### Secuencia de secciones base (templates T1/T2)

```
SECCIÓN 1 → Hero
  fondo: surface | densidad: ligera

SECCIÓN 2 → Servicios + precios
  fondo: surface-alt | densidad: alta
  Si hay "especial": badge en servicio relevante

SECCIÓN 3 → BREAK VISUAL obligatorio (T1: BreakNumerico / T2: StatsCredenciales)
  Solo con dato REAL. Si no hay → OMITIR sección
  fondo: --color-primary con texto blanco | densidad: mínima

SECCIÓN 4 → Cómo funciona / Proceso (3 pasos)
  fondo: surface | densidad: media

SECCIÓN 5 → Social proof / Galería
  Sector visual → Gallery (mín. 5 fotos)
  Sector profesional → SocialProofResenas (SOLO si hay reales)
  Sin evidencia → OMITIR
  fondo: surface-alt | densidad: alta

SECCIÓN 6 → FAQ (salud, profesionales, inmobiliaria)
  Omitir en taquería, barbería básica
  fondo: surface

SECCIÓN 7 → CTA Final
  variante='color'
  fondo: surface-alt | densidad: mínima

SECCIÓN 8 → Footer
  NAP: nombre + dirección + teléfono (idéntico a schema.org)
```

---

## 6. REGLAS ANTI-GENÉRICO (obligatorias)

Antes de entregar, la composición DEBE incluir TODOS estos:

**6.1 Elemento inesperado (mínimo 1):**
Sección con fondo primary completo, headline 2x más grande, número en
`clamp(4rem, 12vw, 8rem)`, o imagen fuera de contenedor.

**6.2 Asimetría controlada (mínimo 1):**
Hero con texto alineado izquierda 55-60%, grid con 1 card más grande,
testimonial con max-width menor, o split 55/45.

**6.3 Escala dramática (mínimo 1):**
Dato numérico en 4-8rem, headline que ocupe 2-3 líneas en mobile,
precio destacado en 2-3x del tamaño base.

**6.4 Alternancia de densidad:**
Después de cada sección densa → sección ligera con mucho whitespace.

**6.5 Alternancia de fondos:**
NUNCA 3 secciones seguidas con el mismo fondo. Alternar entre
surface, surface-alt, y primary (máximo 1 vez por página).

---

## 7. COPY — REGLAS DE REDACCIÓN

- Español mexicano. Tuteo si Formalidad < 4, usted si ≥ 4.
- Sin buzzwords (disruptivo, innovador, sinergias, gamechanger).
- Sin inglés innecesario.
- Precios SIEMPRE visibles. El microemprendedor quiere saber cuánto cuesta ANTES de escribir.

**Headline del hero — 5 patrones (elegir según SKILL.md §5):**

| Patrón | Estructura | Ejemplo |
|--------|-----------|---------|
| A — Precio/Urgencia | [Servicio] desde $[precio] — [zona] | "Corte + barba desde $120 — Iztapalapa" |
| B — Beneficio+Lugar | [Beneficio] [en/para] [contexto] | "El mejor corte de Tláhuac, sin fila" |
| C — Credibilidad | [Especialidad] con [dato real] | "Odontología con 15 años de experiencia" |
| D — Aspiracional | [Experiencia] que mereces | "La relajación que mereces en Polanco" |
| E — Narrativo | [Frase/filosofía del dueño] | "Desde 2008 hacemos uñas que se sienten bien" |

**CTA buttons — verbos de acción:**
- "Agenda tu cita", "Pide tu presupuesto", "Escríbenos", "Reserva tu lugar"
- NUNCA: "Enviar", "Submit", "Contacto", "Más información"

**WhatsApp pre-llenado:**
- "Hola, vi tu página y quiero [acción del sector]"
- Sector salud: "quiero agendar una consulta"
- Sector comida: "quiero hacer un pedido"
- Sector belleza: "quiero agendar una cita"
- Sector servicios: "quiero más información"
