import { useState } from 'react';
import { useItems, useAddItem, useUpdateItem, useDeleteItem } from '@/integrations/supabase';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

const Index = () => {
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { data: items, isLoading, error } = useItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem.mutate({ name: newItemName.trim() });
      setNewItemName('');
    }
  };

  const handleUpdateItem = () => {
    if (editingItem && editingItem.name.trim()) {
      updateItem.mutate(editingItem);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id) => {
    deleteItem.mutate(id);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Supabase Item Manager</h1>
      <div className="max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="New item name..."
          className="mb-2"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button onClick={handleAddItem} className="w-full">
          Add Item
        </Button>
      </div>
      {isLoading && <p className="text-center">Loading items...</p>}
      {error && <p className="text-red-500 text-center">Error: {error.message}</p>}
      {items && (
        <div className="space-y-4 max-w-md mx-auto">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
              {editingItem && editingItem.id === item.id ? (
                <Input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="mr-2"
                />
              ) : (
                <span>{item.name}</span>
              )}
              <div>
                {editingItem && editingItem.id === item.id ? (
                  <Button onClick={handleUpdateItem} size="sm" className="mr-2">
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => setEditingItem(item)}
                    size="sm"
                    variant="outline"
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;