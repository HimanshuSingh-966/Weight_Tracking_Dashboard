import React, { useState } from 'react';
import { useWeight } from '../../context/WeightContext';
import { format, parseISO } from 'date-fns';
import { X, Edit, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const WeightHistory: React.FC = () => {
  const { entries, removeEntry, updateEntry } = useWeight();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editNote, setEditNote] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Sort entries in reverse chronological order
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleEdit = (id: string, weight: number, note?: string) => {
    setIsEditing(id);
    setEditValue(weight.toString());
    setEditNote(note || '');
  };
  
  const handleUpdate = (id: string) => {
    const weight = parseFloat(editValue);
    if (!isNaN(weight) && weight > 0) {
      updateEntry(id, { 
        weight,
        note: editNote || undefined
      });
      setIsEditing(null);
    }
  };
  
  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      removeEntry(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-2" />
        <h3 className="text-lg font-medium">No weight entries found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Start by adding your first weight entry using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Weight (kg)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedEntries.map((entry) => (
            <tr 
              key={entry.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                {format(parseISO(entry.date), 'MMM d, yyyy')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {isEditing === entry.id ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-24 px-2 py-1 border rounded"
                    step="0.1"
                  />
                ) : (
                  <span className="font-medium">{entry.weight}</span>
                )}
              </td>
              <td className="px-4 py-3">
                {isEditing === entry.id ? (
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Add a note"
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-300">{entry.note || '-'}</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                {isEditing === entry.id ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleUpdate(entry.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(null)}
                      className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(entry.id, entry.weight, entry.note)}
                      className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className={`${
                        deleteConfirm === entry.id
                          ? 'text-red-600 animate-pulse'
                          : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeightHistory;