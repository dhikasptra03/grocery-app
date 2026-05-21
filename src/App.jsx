import { useState, useRef } from "react"
import useLocalStorage from "./hooks/useLocalStorage"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import ShoppingSession from "./components/ShoppingSession"

function App() {
  const [items, setItems] = useLocalStorage("grocery-items", [])
  const [activeTab, setActiveTab] = useState("items")
  const [editingItem, setEditingItem] = useState(null)
  const [sessions, setSessions] = useLocalStorage("shopping-sessions", [])
  const importRef = useRef(null)

  const handleExport = () => {
    const data = { items, sessions }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `grocery-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.items) setItems(data.items)
        if (data.sessions) setSessions(data.sessions)
        alert("Import berhasil!")
      } catch {
        alert("File tidak valid!")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🛒 Grocery App</h1>
            <p className="text-sm text-gray-500">
              Catat belanjaan & estimasi budget
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              ⬆️ Export
            </button>
            <button
              onClick={() => importRef.current.click()}
              className="text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              ⬇️ Import
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl shadow-sm mb-6 p-1">
          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "items"
                ? "bg-green-500 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Daftar Barang
          </button>
          <button
            onClick={() => setActiveTab("shopping")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "shopping"
                ? "bg-green-500 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Belanja
          </button>
        </div>

        {/* Content */}
        {activeTab === "items" ? (
          <div className="space-y-4">
            <ItemForm
              key={editingItem?.id ?? "new"}
              items={items}
              setItems={setItems}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
            <ItemList
              items={items}
              setItems={setItems}
              setEditingItem={setEditingItem}
            />
          </div>
        ) : (
          <ShoppingSession items={items} />
        )}
      </div>
    </div>
  )
}

export default App
