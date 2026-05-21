import { useState } from 'react'

function ItemList({ items, setItems, setEditingItem }) {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const formatRupiah = (number) => {
    return 'Rp ' + number.toLocaleString('id-ID')
  }

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id))
    setConfirmDeleteId(null)
    setPage(1)
  }

  const handleEditClick = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name))
  const filtered = sorted.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-400 text-sm">Belum ada barang. Tambah dulu yuk!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">
          📦 Daftar Barang ({items.length})
        </h2>
        <select
          value={perPage}
          onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {[5, 10, 15, 20].map(n => (
            <option key={n} value={n}>{n} / halaman</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Cari barang..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {paginated.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-4">Barang tidak ditemukan.</p>
      ) : (
        <div className="space-y-2">
          {paginated.map(item => (
            <div key={item.id}>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-green-600">{formatRupiah(item.price)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Konfirmasi hapus */}
              {confirmDeleteId === item.id && (
                <div className="flex items-center justify-between px-3 py-2 bg-red-50 rounded-lg border border-red-100 mt-1">
                  <p className="text-xs text-red-500">Yakin mau hapus <span className="font-semibold">{item.name}</span>?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-600 px-2 py-1 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default ItemList