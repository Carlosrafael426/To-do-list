import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check } from 'lucide-react';
import { useTaskManager } from '../hooks/useTaskManager';
import { TaskItem } from './TaskItem';
import { TaskFilter } from './TaskFilter';
import { TaskStats } from './TaskStats';
import type { FilterState } from '../types/task';
import { sortByPriority } from '../utils/priorityUtils';

export const TaskList: React.FC = () => {
  const { tasks, clearCompleted } = useTaskManager();
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    selectedPriority: null,
    showCompleted: true,
    sortBy: 'date'
  });

  // Filtrar e ordenar tarefas
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filtro por busca
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Filtro por categoria
    if (filters.selectedCategory) {
      result = result.filter(task => task.category === filters.selectedCategory);
    }

    // Filtro por prioridade
    if (filters.selectedPriority) {
      result = result.filter(task => task.priority === filters.selectedPriority);
    }

    // Filtro por status
    if (!filters.showCompleted) {
      result = result.filter(task => !task.completed);
    }

    // Ordenação
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority':
          return sortByPriority(a.priority, b.priority);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [tasks, filters]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <TaskStats tasks={tasks} />

      {/* Filtros */}
      <TaskFilter filters={filters} onFilterChange={setFilters} />

      {/* Contagem de resultados */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAndSortedTasks.length} de {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
        </p>

        {/* Botão Limpar Concluídas */}
        {completedCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCompleted}
            className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} />
            Limpar Concluídas ({completedCount})
          </motion.button>
        )}
      </div>

      {/* Lista de Tarefas */}
      {filteredAndSortedTasks.length > 0 ? (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Check size={32} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {tasks.length === 0
              ? 'Crie sua primeira tarefa para começar!'
              : 'Nenhuma tarefa corresponde aos filtros selecionados.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
