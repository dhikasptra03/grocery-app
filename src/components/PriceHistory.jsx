import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const formatRupiah = (number) => 'Rp ' + number.toLocaleString('id-ID')

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: '2-digit',
  })

function PriceHistory({ items, priceNormalHistory }) {
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  const itemsWithHistory = items.filter(item => priceNormalHistory[item.id]?.length > 1)
  const filtered = itemsWithHistory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedItem = items.find(i => i.id === selectedId)
  const history = selectedId ? (priceNormalHistory[selectedId] || []) : []

  if (selectedItem) {
    const chartData = history.map(entry => ({
      date: formatDate(entry.date),
      'Harga Normal': entry.newPrice,
    }))
    const prices = history.map(e => e.newPrice)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const latestPrice = prices[prices.length - 1]
    const firstPrice = prices[0]
    const trend = latestPrice > firstPrice ? '📈' : latestPrice < firstPrice ? '📉' : '➡️'

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedId(null)}
          className="text-sm text-green-500 hover:text-green-600"
        >
          ← Kembali
        </button>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">{selectedItem.name}</h2>
              <p className="text-xs text-gray-400">{history.length} perubahan harga</p>
            </div>
            <span className="text-xl">{trend}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Terendah</p>
              <p className="text-xs font-semibold text-blue-500">{formatRupiah(minPrice)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Tertinggi</p>
              <p className="text-xs font-semibold text-red-400">{formatRupiah(maxPrice)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Sekarang</p>
              <p className="text-xs font-semibold text-green-500">{formatRupiah(latestPrice)}</p>
            </div>
          </div>

          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis
                  tick={{ fontSize: 9 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={32}
                />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{ fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="Harga Normal"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">
              Butuh minimal 2 data untuk tampilkan grafik.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Riwayat Perubahan</h3>
          <div className="space-y-2">
            {[...history].reverse().map((entry, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-0">
                <span className="text-gray-400">{formatDate(entry.date)}</span>
                <div className="text-right flex items-center gap-2">
                  {entry.oldPrice && (
                    <span className="text-gray-300 line-through">{formatRupiah(entry.oldPrice)}</span>
                  )}
                  <span className="font-medium text-gray-800">{formatRupiah(entry.newPrice)}</span>
                  {entry.oldPrice && (
                    <span className={entry.newPrice > entry.oldPrice ? 'text-red-400' : 'text-blue-400'}>
                      {entry.newPrice > entry.oldPrice ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">📊 Tracking Harga Normal</h2>
        <input
          type="text"
          placeholder="🔍 Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            {itemsWithHistory.length === 0
              ? 'Belum ada data. Edit harga normal di sesi belanja dulu!'
              : 'Barang tidak ditemukan.'}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.sort((a, b) => a.name.localeCompare(b.name)).map(item => {
              const h = priceNormalHistory[item.id]
              const latest = h[h.length - 1]
              const prev = h[h.length - 2]
              const diff = prev ? latest.newPrice - prev.newPrice : 0
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{h.length} perubahan · {formatDate(latest.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-500">{formatRupiah(latest.newPrice)}</p>
                    {diff !== 0 && (
                      <p className={`text-xs ${diff > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {diff > 0 ? '▲' : '▼'} {formatRupiah(Math.abs(diff))}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceHistory