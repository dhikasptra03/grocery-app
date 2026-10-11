import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function PriceHistory({ items, priceHistory }) {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  const formatRupiah = (number) => {
    return "Rp " + number.toLocaleString("id-ID");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  const itemsWithHistory = items.filter(
    (item) => priceHistory[item.id]?.length > 0,
  );
  const filtered = itemsWithHistory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedItem = items.find((i) => i.id === selectedId);
  const history = selectedId ? priceHistory[selectedId] || [] : [];

  const chartData = history.map((entry) => ({
    date: formatDate(entry.date),
    "Harga Aktual": entry.actualPrice,
    "Harga Normal": entry.price,
  }));

  const prices = history.map((e) => e.actualPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const latestPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const trend =
    latestPrice > firstPrice ? "📈" : latestPrice < firstPrice ? "📉" : "➡️";

  if (selectedItem) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedId(null)}
          className="text-sm text-green-500 hover:text-green-600 flex items-center gap-1"
        >
          ← Kembali
        </button>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                {selectedItem.name}
              </h2>
              <p className="text-xs text-gray-400">
                {history.length} data belanja
              </p>
            </div>
            <span className="text-xl">{trend}</span>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 my-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Terendah</p>
              <p className="text-xs font-semibold text-blue-500">
                {formatRupiah(minPrice)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Tertinggi</p>
              <p className="text-xs font-semibold text-red-400">
                {formatRupiah(maxPrice)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Terakhir</p>
              <p className="text-xs font-semibold text-green-500">
                {formatRupiah(latestPrice)}
              </p>
            </div>
          </div>

          {/* Chart */}
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis
                  tick={{ fontSize: 9 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={32}
                />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  labelStyle={{ fontSize: 10 }}
                  contentStyle={{ fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="Harga Aktual"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Harga Normal"
                  stroke="#d1d5db"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">
              Butuh minimal 2 data belanja untuk tampilkan grafik.
            </p>
          )}

          <div className="flex gap-3 mt-2 justify-center">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-4 h-0.5 bg-green-500 inline-block"></span>{" "}
              Harga Aktual
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-4 h-0.5 bg-gray-300 inline-block border-dashed"></span>{" "}
              Harga Normal
            </span>
          </div>
        </div>

        {/* Tabel history */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📋 Riwayat Harga
          </h3>
          <div className="space-y-2">
            {[...history].reverse().map((entry, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs text-gray-600 py-1 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-400">{formatDate(entry.date)}</span>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {formatRupiah(entry.actualPrice)}
                  </p>
                  {entry.actualPrice !== entry.price && (
                    <p className="text-orange-400 line-through">
                      {formatRupiah(entry.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          📊 Tracking Harga
        </h2>

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
              ? "Belum ada data. Selesaikan sesi belanja dulu!"
              : "Barang tidak ditemukan."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => {
                const h = priceHistory[item.id];
                const latest = h[h.length - 1];
                const prev = h[h.length - 2];
                const diff = prev ? latest.actualPrice - prev.actualPrice : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {h.length} data · terakhir {formatDate(latest.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {formatRupiah(latest.actualPrice)}
                      </p>
                      {diff !== 0 && (
                        <p
                          className={`text-xs ${diff > 0 ? "text-red-400" : "text-blue-400"}`}
                        >
                          {diff > 0 ? "▲" : "▼"} {formatRupiah(Math.abs(diff))}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PriceHistory;
