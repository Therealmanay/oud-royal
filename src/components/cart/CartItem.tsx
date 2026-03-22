'use client'

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 border-b">
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold text-dark-brown">{name}</h3>
        <p className="text-gold font-bold">${price}</p>
        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm text-gray-600">Qty:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange?.(parseInt(e.target.value))}
            className="w-16 px-2 py-1 border rounded"
          />
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-red-600 hover:text-red-800 h-fit"
      >
        ✕
      </button>
    </div>
  )
}
