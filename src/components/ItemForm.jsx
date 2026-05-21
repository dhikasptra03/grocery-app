import { useState, useRef } from 'react'

const formatRupiah = (value) => {
  const number = String(value).replace(/\D/g, '')
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function ItemForm({ items, setItems, editingItem, setEditingItem }) {
  const [name, setName] = useState(editingItem?.name ?? '')
  const [price, setPrice] = useState(editingItem ? formatRupiah(String(editingItem.price)) : '')
  const [suggestion, setSuggestion] = useState('')
  const inputRef = useRef(null)

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    if (value.trim()) {
      const match = items.find(
        item =>
          item.name.toLowerCase().startsWith(value.toLowerCase()) &&
          item.name.toLowerCase() !== value.toLowerCase() &&
          (!editingItem || item.id !== editingItem.id)
      )
      setSuggestion(match ? match.name : '')
    } else {
      setSuggestion('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault()
      setName(suggestion)
      setSuggestion('')
    }
  }

  const handlePriceChange = (e) => {
    setPrice(formatRupiah(e.target.value))
  }

  const handleSubmit = () => {
    if (!name.trim() || !price) return

    const isDuplicate = items.some(
      item =>
        item.name.toLowerCase() === name.trim().toLowerCase() &&
        (!editingItem || item.id !== editingItem.id)
    )
    if (isDuplicate) {
      alert(`"${name.trim()}" sudah ada di daftar!`)
      return
    }

    const priceNumber = parseInt(price.replace(/\./g, ''))

    if (editingItem) {
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, name: name.trim(), price: priceNumber }
          : item
      ))
      setEditingItem(null)
    } else {
      setItems([...items, { id: Date.now(), name: name.trim(), price: priceNumber }])
    }

    setName('')
    setPrice('')
    setSuggestion('')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setName('')
    setPrice('')
    setSuggestion('')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {editingItem ? '✏️ Edit Barang' : '➕ Tambah Barang'}
      </h2>
      <div className="space-y-2">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Nama barang"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-transparent relative z-10"
          />
          {suggestion && (
            <div className="absolute inset-0 px-3 py-2 text-sm pointer-events-none rounded-lg flex items-center">
              <span className="invisible">{name}</span>
              <span className="text-gray-300">{suggestion.slice(name.length)}</span>
            </div>
          )}
          {suggestion && (
            <span className="absolute right-3 top-2 text-xs text-gray-300 pointer-events-none">
              Tab ↹
            </span>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-2 text-sm text-gray-400">Rp</span>
          <input
            type="text"
            placeholder="0"
            value={price}
            onChange={handlePriceChange}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {editingItem ? 'Simpan' : 'Tambah'}
          </button>
          {editingItem && (
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemForm