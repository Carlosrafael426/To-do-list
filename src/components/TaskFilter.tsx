import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Priority, SortBy, FilterState } from '../types/task';
import { useTaskManager } from '../hooks/useTaskManager';

interface TaskFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filters,
  onFilterChange
}) => {
  const { categories } = useTaskManager();

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      selectedCategory: null,
      selectedPriority: null,
      showCompleted: true,
      sortBy: 'date'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 shadow-md"
    >
      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({ ...filters, searchQuery: e.target.value })
          }
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Grid de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Categoria */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Filter size={14} />
            Categoria
          </label>
          <select
            value={filters.selectedCategory || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                selectedCategory: e.target.value || null
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Prioridade
          </label>
          <select
            value={filters.selectedPriority || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                selectedPriority: (e.target.value as Priority) || null
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Todas as prioridades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as SortBy
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="date">Data de Criação</option>
            <option value="priority">Prioridade</option>
            <option value="title">Título</option>
          </select>
        </div>

        {/* Show Completed */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filters.showCompleted ? 'all' : 'pending'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                showCompleted: e.target.value === 'all'
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Botão de Reset */}
      {(filters.searchQuery ||
        filters.selectedCategory ||
        filters.selectedPriority ||
        !filters.showCompleted ||
        filters.sortBy !== 'date') && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={16} />
          Resetar Filtros
        </motion.button>
      )}
    </motion.div>
  );
};
