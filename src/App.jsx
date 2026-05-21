import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";
import ShoppingSession from "./components/ShoppingSession";

function App() {
  const [items, setItems] = useLocalStorage("grocery-items", []);
  const [activeTab, setActiveTab] = useState("items");
  const [editingItem, setEditingItem] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🛒 Grocery App</h1>
          <p className="text-sm text-gray-500">
            Catat belanjaan & estimasi budget
          </p>
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
  );
}

export default App;
