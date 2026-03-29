# Mixtli Technical Reference

> Stack, estructura, seguridad, imágenes, checklist.
> Última actualización: 22 marzo 2026

---

## 1. STACK TÉCNICO (no negociable)

```
Astro 6             → Node 22+ (obligatorio desde Astro 6)
Tailwind v4         → vía @tailwindcss/vite (NO @astrojs/tailwind — deprecado)
Zod v4              → importar desde astro/zod, NO desde zod directamente
TypeScript strict
Deploy: Cloudflare Pages → npx wrangler pages deploy dist/
Fonts: Astro Fonts API → fontProviders.google() — Google Fonts CDN PROHIBIDO
Imágenes: WebP/AVIF → Astro Image con Sharp
Vite 7              → incluido con Astro 6
```

### Cambios críticos de Astro 6 vs Astro 5

- `import.meta.env` se inlinea en build time. Para runtime usar `process.env`.
- Content Layer API es obligatorio. Legacy content collections eliminadas.
- CSP nativo: `security: { csp: true }` en astro.config.mjs.
- Fonts API: desde Astro 6.1.1 es top-level `fonts: [...]` — NO dentro de `experimental`.
- Zod 4 rompe compatibilidad con Zod 3. Importar siempre desde `astro/zod`.
- Cloudflare Pages: `output: 'static'` sin adapter — compatible nativo.

---

## 2. PRIORIDADES (orden estricto)

1. **Seguridad** — API keys en .env, CSP nativo habilitado, headers en public/_headers
2. **Legal LFPDPPP** — /aviso-de-privacidad existe, checkbox en formularios, cláusula IA
3. **Performance** — Lighthouse ≥ 95 mobile. LCP < 1.2s. CLS < 0.05. Zero JS salvo islands
4. **Accesibilidad WCAG 2.2 AA** — Contraste 4.5:1, alt text real, prefers-reduced-motion, focus visible
5. **UX** — CTA visible sin scroll, precios visibles, mobile-first
6. **Velocidad** — Imágenes < 200KB, hero < 400KB, lazy loading excepto hero

---

## 3. ESTRUCTURA DE ARCHIVOS

```
[proyecto]/
├── src/
│   ├── components/       ← componentes de weia-library + componentes custom
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── aviso-de-privacidad.astro   ← OBLIGATORIO (LFPDPPP)
│   └── styles/
│       └── tokens.css    ← tokens OKLCH del proyecto + @theme inline
├── public/
│   ├── images/           ← imágenes generadas o del cliente
│   ├── og-default.jpg    ← 1200x630px OBLIGATORIA
│   ├── favicon.svg
│   ├── _headers          ← headers de seguridad (Cloudflare Pages)
│   └── robots.txt
├── astro.config.mjs      ← con CSP, Fonts API (sin adapter)
├── IMAGES.md             ← registro: real vs stock vs IA
├── .env.example          ← variables de entorno requeridas
├── tsconfig.json
└── package.json
```

---

## 4. CONFIGURACIÓN DE ASTRO 6

### astro.config.mjs (template base)

```js
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Sin adapter — Cloudflare Pages es compatible con output: 'static' nativo

  security: {
    csp: true, // CSP nativo — Astro genera hashes automáticamente
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // fonts es top-level desde Astro 6.1.1 — NO dentro de experimental
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'HEADING_FONT_HERE', // ← reemplazar con fuente del sector (design-system.md §4)
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

### public/_headers (copiar literal)

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Deploy — Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist/
```

- Plan Emprende: subdominio `[nombre].weia.digital`
- Plan Anual/Propiedad: dominio propio del cliente (configurar en Cloudflare Dashboard)

---

## 5. GENERACIÓN DE IMÁGENES

Una landing SIN imágenes se ve vacía. Cada landing DEBE tener mínimo 4 imágenes
reales (no placeholders, no colores sólidos, no íconos SVG como sustituto).

### Regla de decisión

```
Si fotos == true  → usar las fotos del cliente, optimizar a WebP
Si fotos == false → GENERAR con Nano Banana Pro vía OpenRouter (SIEMPRE)
```

### Modelo recomendado

| Modelo | ID OpenRouter | Calidad |
|--------|--------------|---------|
| Nano Banana Pro (default) | google/gemini-3-pro-image-preview | Máxima |
| Nano Banana 2 (presupuesto bajo) | google/gemini-3.1-flash-image-preview | Alta |

### Imágenes mínimas por landing

| Imagen | Sección | Aspect ratio |
|--------|---------|-------------|
| hero.jpg | Hero | 16:9 |
| servicio-1.jpg | Servicios | 1:1 |
| servicio-2.jpg | Servicios | 1:1 |
| servicio-3.jpg | Servicios | 1:1 |
| galeria-1.jpg | Galería | 4:3 |
| galeria-2.jpg | Galería | 4:3 |
| og-default.jpg | Meta/OG | 16:9 |

### Script de generación (bash)

```bash
#!/bin/bash
# generate-image.sh — Genera 1 imagen vía OpenRouter
# Uso: ./generate-image.sh "prompt" "nombre-archivo" "16:9"
# Requiere: OPENROUTER_API_KEY, jq

PROMPT="$1"
FILENAME="$2"
ASPECT="${3:-4:3}"
MODEL="${4:-google/gemini-3-pro-image-preview}"

RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [{\"role\": \"user\", \"content\": \"$PROMPT\"}],
    \"modalities\": [\"image\", \"text\"],
    \"image_config\": {\"aspect_ratio\": \"$ASPECT\"}
  }")

IMAGE_DATA=$(echo "$RESPONSE" | jq -r '.choices[0].message.images[0].image_url.url // empty')

if [ -z "$IMAGE_DATA" ]; then
  echo "ERROR: No se generó imagen."
  echo "$RESPONSE" | jq '.error // .choices[0].message.content // "Sin detalle"'
  exit 1
fi

echo "$IMAGE_DATA" | sed 's/^data:image\/[^;]*;base64,//' | base64 -d > "public/images/$FILENAME.png"
echo "OK: public/images/$FILENAME.png"
```

### Prompts por sector (base hero)

| Sector | Prompt base |
|--------|------------|
| barberia_tradicional | "Traditional barbershop interior, warm wood tones, vintage barber chair, moody warm lighting, commercial photography" |
| barberia_moderna | "Modern minimalist barbershop, clean white and black interior, LED strip lighting, urban editorial photography" |
| belleza_spa | "Luxury beauty spa treatment room, soft ambient lighting, elegant minimalist decor, commercial photography" |
| estetica_general | "Modern beauty salon interior, styling stations, warm lighting, clean professional environment, commercial photography" |
| nail_salon | "Professional nail salon workspace, elegant manicure station, soft pink lighting, clean modern aesthetic, commercial photography" |
| tatuajes_piercing | "Professional tattoo studio interior, dark moody lighting, art on walls, clean workstation, editorial photography" |
| consultorio_dental | "Modern dental clinic treatment room, bright clean environment, professional dental equipment, healthcare photography" |
| consultorio_medico | "Clean modern medical consultation room, natural lighting, professional healthcare setting, corporate photography" |
| veterinaria | "Bright welcoming veterinary clinic, clean examination room, warm natural lighting, professional photography" |
| gym_fitness | "Modern fitness gym interior, weight equipment, dramatic side lighting, energy commercial photography" |
| educacion_capacitacion | "Professional classroom or training room, modern desk setup, clean bright environment, corporate photography" |
| restaurante_formal | "Elegant restaurant interior, candlelight atmosphere, white tablecloths, luxury dining photography" |
| comida_rapida | "Vibrant fast food counter, colorful menu display, bright lighting, food commercial photography" |
| comida | "Artisan Mexican food preparation, colorful fresh ingredients, rustic wooden surface, food photography" |
| panaderia_cafeteria | "Artisan bakery display, fresh bread and pastries, warm golden lighting, cozy atmosphere, food photography" |
| abogado | "Professional law office, wooden desk, legal books, natural light, corporate photography" |
| contador | "Modern accounting office, organized desk, laptop, documents, clean professional environment, corporate photography" |
| arquitecto_disenador | "Architecture studio workspace, blueprints and scale models, clean desk, natural daylight, editorial photography" |
| agencia_digital | "Modern creative agency office, open workspace, monitors with design work, natural light, editorial photography" |
| servicios_profesionales | "Modern professional office workspace, clean desk setup, natural window lighting, corporate photography" |
| tienda_ropa | "Modern fashion boutique interior, clothing racks, clean minimal display, natural light, editorial photography" |
| vendedor_catalogo | "Clean product catalog display, organized items on white surface, natural lighting, commercial photography" |
| fotografia | "Professional photography studio, camera equipment, backdrop, dramatic lighting setup, editorial photography" |
| eventos_bodas | "Elegant wedding venue decoration, floral arrangements, soft golden light, romantic atmosphere, event photography" |
| inmobiliaria | "Luxury modern apartment interior, open concept living space, large windows, architectural photography" |

### Reglas de prompts

- SIEMPRE en inglés (mejor calidad de generación)
- SIEMPRE incluir "commercial photography" o "professional photography"
- NUNCA pedir texto en la imagen
- NUNCA pedir logos o marcas
- SIEMPRE incluir tipo de iluminación
- Adaptar al negocio específico

### Especificaciones técnicas

- Convertir a WebP después: `cwebp input.png -o output.webp -q 80`
- width + height explícitos en TODOS los `<img>` y `<Image>`
- Hero: max 400KB después de optimización
- Resto: max 200KB
- Lazy loading en TODO excepto hero
- Alt text descriptivo y REAL en TODAS las imágenes

### IMAGES.md (generar SIEMPRE)

```markdown
# Imágenes — [Nombre Proyecto]
Generado: [fecha]
Método: Nano Banana Pro vía OpenRouter

| Archivo | Prompt usado | Tipo | Sección |
|---------|-------------|------|---------|
| public/images/hero.webp | "..." | IA generada | Hero |
| public/images/servicio-1.webp | "..." | IA generada | Servicios |

Nota: Reemplazar con fotos reales del cliente cuando estén disponibles.
```

---

## 6. CHECKLIST ANTES DE ENTREGAR

- [ ] Build exitoso (`npm run build` sin errores)
- [ ] TypeScript sin `any`
- [ ] /aviso-de-privacidad existe con contenido real (AvisoPrivacidad component)
- [ ] CTA visible sin scroll en mobile
- [ ] Precios visibles sin click extra
- [ ] WhatsApp button flotante funciona (CTAWhatsApp component)
- [ ] Alternancia de fondos cumplida (nunca 3 iguales seguidas)
- [ ] Al menos 1 elemento inesperado presente
- [ ] Al menos 1 sección asimétrica
- [ ] Al menos 1 elemento de escala dramática
- [ ] Todas las imágenes con alt text real
- [ ] Schema.org LocalBusiness en head (vía BaseLayout)
- [ ] OG Image 1200x630 en /public
- [ ] IMAGES.md generado
- [ ] Lighthouse Mobile ≥ 95 (las 4 categorías)
- [ ] public/_headers con headers de seguridad
- [ ] .env.example actualizado
- [ ] CSP habilitado en astro.config.mjs
- [ ] Fonts API configurada (NO CDN externo)
- [ ] CookieConsent incluido (LFPDPPP)
