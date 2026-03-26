import React, { useState } from 'react';
import { Plus, X, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTaskManager } from '../hooks/useTaskManager';
import type { Priority } from '../types/task';

interface TaskFormProps {
  onTaskAdd?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdd }) => {
  const { addTask, addCategory, categories } = useTaskManager();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (dueDate) {
      const selected = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        alert('A data de vencimento não pode ser no passado.');
        return;
      }
    }

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      completed: false,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory(categories[0]?.id || '');
    setDueDate('');
    setIsOpen(false);
    onTaskAdd?.();
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    const exists = categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      setNewCategoryName('');
      return;
    }

    const categoryColor = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500'][
      categories.length % 5
    ];

    const newCategoryId = Date.now().toString();
    addCategory({ id: newCategoryId, name: trimmedName, color: categoryColor });
    setCategory(newCategoryId);
    setNewCategoryName('');
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg"
        >
          <Plus size={20} />
          Nova Tarefa
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 p-6 space-y-4 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Criar Nova Tarefa
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título *
                <span title="Nome da tarefa, ex: Reunião com equipe">
                  <HelpCircle className="text-gray-400 cursor-help" size={14} />
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da tarefa..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
                <span title="Detalhes adicionais sobre a tarefa">
                  <HelpCircle className="text-gray-400 cursor-help" size={14} />
                </span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione detalhes (opcional)..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Grid: Prioridade e Categoria */}
            <div className="grid grid-cols-2 gap-4">
              {/* Prioridade */}
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridade
                  <span title="Prioridade influencia ordenação e visual">
                    <HelpCircle className="text-gray-400 cursor-help" size={14} />
                  </span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              {/* Categoria */}
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                  <span title="Escolha a categoria ou crie uma nova">
                    <HelpCircle className="text-gray-400 cursor-help" size={14} />
                  </span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="mt-2 w-full px-3 py-2 border border-dashed border-blue-500 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                >
                  + Adicionar nova categoria
                </button>
              </div>
          </div>

            {/* Data de Vencimento */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de Vencimento
                <span title="A data que a tarefa precisa ser concluída">
                  <HelpCircle className="text-gray-400 cursor-help" size={14} />
                </span>
              </label>
              <input
                type="date"
                value={dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Criar Tarefa
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Adicionar Categoria</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da nova categoria"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddCategory();
                    setIsCategoryModalOpen(false);
                  }}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
