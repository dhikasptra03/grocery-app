import { useState } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

function ShoppingSession({ items }) {
  const [sessions, setSessions] = useLocalStorage("shopping-sessions", [])
  const [activeSession, setActiveSession] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [checkedItems, setCheckedItems] = useState({})
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState(null)

  const formatRupiah = (number) => {
    return "Rp " + number.toLocaleString("id-ID")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const startNewSession = () => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      cart: [],
      total: 0,
      finished: false,
    }
    setSessions([newSession, ...sessions])
    setActiveSession(newSession)
    setQuantities({})
    setCheckedItems({})
    setSearch("")
  }

  const handleCheck = (item) => {
    if (activeSession.finished) return
    const qty = parseInt(quantities[item.id]) || 1
    const alreadyChecked = checkedItems[item.id]

    if (alreadyChecked) {
      const newChecked = { ...checkedItems }
      delete newChecked[item.id]
      setCheckedItems(newChecked)
      const newCart = activeSession.cart.filter((c) => c.id !== item.id)
      const newTotal = newCart.reduce((sum, c) => sum + c.subtotal, 0)
      const updated = { ...activeSession, cart: newCart, total: newTotal }
      setActiveSession(updated)
      setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)))
    } else {
      setCheckedItems({ ...checkedItems, [item.id]: true })
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        qty,
        subtotal: item.price * qty,
      }
      const newCart = [
        ...activeSession.cart.filter((c) => c.id !== item.id),
        cartItem,
      ]
      const newTotal = newCart.reduce((sum, c) => sum + c.subtotal, 0)
      const updated = { ...activeSession, cart: newCart, total: newTotal }
      setActiveSession(updated)
      setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)))
    }
  }

  const handleQtyChange = (itemId, value) => {
    if (checkedItems[itemId]) return
    setQuantities({ ...quantities, [itemId]: value })
  }

  const saveSession = (finished) => {
    const updated = { ...activeSession, finished }
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)))
    setActiveSession(null)
    setQuantities({})
    setCheckedItems({})
    setSearch("")
  }

  const resumeSession = (session) => {
    if (session.finished) return
    const restoredChecked = {}
    session.cart.forEach((c) => {
      restoredChecked[c.id] = true
    })
    const restoredQty = {}
    session.cart.forEach((c) => {
      restoredQty[c.id] = c.qty
    })
    setActiveSession(session)
    setCheckedItems(restoredChecked)
    setQuantities(restoredQty)
    setSearch("")
  }

  const deleteSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  const filteredItems = [...items]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

  if (activeSession) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">
              🛍️ {formatDate(activeSession.date)}
            </h2>
            <button
              onClick={() => setActiveSession(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Tutup
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Belum ada barang. Tambah dulu di tab Daftar Barang.
            </p>
          ) : filteredItems.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Barang tidak ditemukan.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    checkedItems[item.id]
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.id]}
                    onChange={() => handleCheck(item)}
                    className="w-4 h-4 accent-green-500"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        checkedItems[item.id]
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleQtyChange(
                          item.id,
                          Math.max(1, (parseInt(quantities[item.id]) || 1) - 1),
                        )
                      }
                      disabled={!!checkedItems[item.id]}
                      className={`w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                        checkedItems[item.id]
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                      }`}
                    >
                      −
                    </button>
                    <span
                      className={`w-6 text-xs text-center font-medium ${
                        checkedItems[item.id]
                          ? "text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {quantities[item.id] || 1}
                    </span>
                    <button
                      onClick={() =>
                        handleQtyChange(
                          item.id,
                          (parseInt(quantities[item.id]) || 1) + 1,
                        )
                      }
                      disabled={!!checkedItems[item.id]}
                      className={`w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                        checkedItems[item.id]
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total & Actions */}
        <div className="bg-green-500 rounded-xl shadow-sm p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs opacity-80">Total Belanja</p>
              <p className="text-xl font-bold">
                {formatRupiah(activeSession.total)}
              </p>
            </div>
            <p className="text-xs opacity-80">
              {activeSession.cart.length} barang dipilih
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveSession(false)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              💾 Simpan Draft
            </button>
            <button
              onClick={() => saveSession(true)}
              className="flex-1 bg-white text-green-600 text-sm font-semibold py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              ✅ Selesai
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={startNewSession}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl shadow-sm transition-colors"
      >
        + Mulai Sesi Belanja
      </button>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-400 text-sm">Belum ada riwayat belanja.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            🗓️ Riwayat Belanja
          </h2>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-3">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() =>
                      setExpandedId(
                        expandedId === session.id ? null : session.id,
                      )
                    }
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">
                        {expandedId === session.id ? "▾" : "▸"}
                      </span>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(session.date)}
                      </p>
                    </div>
                    <p className="text-xs text-green-600 ml-4">
                      {formatRupiah(session.total)}
                    </p>
                    <p className="text-xs text-gray-400 ml-4">
                      {session.cart.length} barang
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!session.finished && (
                      <button
                        onClick={() => resumeSession(session)}
                        className="text-xs text-blue-400 hover:text-blue-600"
                      >
                        Lanjut
                      </button>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        session.finished
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {session.finished ? "Selesai" : "Draft"}
                    </span>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Detail barang */}
                {expandedId === session.id && (
                  <div className="border-t border-gray-200 px-3 pb-3">
                    {session.cart.length === 0 ? (
                      <p className="text-xs text-gray-400 py-2">
                        Belum ada barang dipilih.
                      </p>
                    ) : (
                      <div className="mt-2 space-y-1">
                        {session.cart.map((cartItem) => (
                          <div
                            key={cartItem.id}
                            className="flex justify-between text-xs text-gray-600"
                          >
                            <span>
                              {cartItem.name}{" "}
                              <span className="text-gray-400">
                                x{cartItem.qty}
                              </span>
                            </span>
                            <span className="text-green-600">
                              {formatRupiah(cartItem.subtotal)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs font-semibold text-gray-800 border-t border-gray-200 pt-1 mt-1">
                          <span>Total</span>
                          <span className="text-green-600">
                            {formatRupiah(session.total)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingSession
