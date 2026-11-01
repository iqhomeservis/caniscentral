import { createServiceClient } from '@/lib/supabase/server'

/**
 * BEZPEČNOSŤ — prečo tento súbor existuje.
 *
 * Pokladňa aj Stripe predtým počítali sumu z cien, ktoré poslal prehliadač.
 * Ktokoľvek si vedel v prehliadači prepísať cenu na 0,01 € a objednávka by
 * prešla za tú sumu. Ceny preto NIKDY nepreberáme od návštevníka — z jeho
 * požiadavky berieme len id produktu a množstvo, zvyšok dopĺňame z databázy.
 *
 * Doprava: zadarmo od 50 €, inak 3,99 €. Prahová hodnota je tu na jednom
 * mieste, aby sa nerozchádzala medzi pokladňou, Stripe a košíkom.
 */

export const FREE_SHIPPING_FROM = 50
export const SHIPPING_FEE = 3.99
const MAX_QUANTITY_PER_ITEM = 50

export type PricedLine = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
  image: string | null
}

export type PricedCart = {
  lines: PricedLine[]
  subtotal: number
  shipping: number
  total: number
}

export class CartError extends Error {
  constructor(public code: string, message: string) {
    super(message)
  }
}

type IncomingItem = { product?: { id?: unknown }; quantity?: unknown }

/**
 * Overí košík proti databáze a vráti sumy, ktorým sa dá veriť.
 * Hodí CartError, ak je košík prázdny, produkt neexistuje, nie je aktívny
 * alebo nie je na sklade v požadovanom množstve.
 */
export async function priceCart(items: unknown): Promise<PricedCart> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CartError('empty_cart', 'Košík je prázdny.')
  }
  if (items.length > 50) {
    throw new CartError('too_many_items', 'Priveľa položiek v košíku.')
  }

  // Z požiadavky si berieme výhradne id a množstvo.
  const requested = new Map<string, number>()
  for (const raw of items as IncomingItem[]) {
    const id = raw?.product?.id
    const qty = Number(raw?.quantity)
    if (typeof id !== 'string' || id.length === 0) {
      throw new CartError('invalid_item', 'Neplatná položka v košíku.')
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY_PER_ITEM) {
      throw new CartError('invalid_quantity', 'Neplatné množstvo.')
    }
    requested.set(id, (requested.get(id) ?? 0) + qty)
  }

  const supabase = await createServiceClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, images, stock, is_active')
    .in('id', Array.from(requested.keys()))

  if (error) {
    throw new CartError('lookup_failed', 'Produkty sa nepodarilo načítať.')
  }

  const lines: PricedLine[] = []
  for (const [id, quantity] of Array.from(requested.entries())) {
    const product = products?.find((p) => p.id === id)
    if (!product || !product.is_active) {
      throw new CartError('product_unavailable', 'Produkt už nie je v ponuke.')
    }
    if (typeof product.stock === 'number' && product.stock < quantity) {
      throw new CartError('out_of_stock', `Produkt ${product.name} nie je skladom v požadovanom množstve.`)
    }

    const unitPrice = Number(product.price)
    lines.push({
      productId: product.id,
      name: product.name,
      unitPrice,
      quantity,
      lineTotal: round2(unitPrice * quantity),
      image: product.images?.[0] ?? null,
    })
  }

  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0))
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  return { lines, subtotal, shipping, total: round2(subtotal + shipping) }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}
