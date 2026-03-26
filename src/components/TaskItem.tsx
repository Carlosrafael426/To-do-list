import React, { useState } from 'react';
import { Trash2, Edit2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, Priority } from '../types/task';
import { useTaskManager } from '../hooks/useTaskManager';
import { getPriorityConfig } from '../utils/priorityUtils';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, toggleTaskComplete, categories } = useTaskManager();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPriority, setEditedPriority] = useState<Priority>(task.priority);

  const priorityConfig = getPriorityConfig(task.priority);
  const categoryName = categories.find(c => c.id === task.category)?.name || 'Sem categoria';
  const categoryColor = categories.find(c => c.id === task.category)?.color || 'bg-gray-500';

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('pt-BR')
    : null;

  const handlePriorityChange = (newPriority: Priority) => {
    updateTask(task.id, { priority: newPriority });
    setEditedPriority(newPriority);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`rounded-lg border-l-4 transition-all ${priorityConfig.borderColor} ${
        task.completed
          ? 'bg-gray-100 dark:bg-gray-800 opacity-60'
          : priorityConfig.bgColor
      }`}
    >
      <div
        className="p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      >
        {/* Checkbox */}
        <motion.input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className="mt-1 w-5 h-5 rounded border-2 cursor-pointer accent-blue-500"
        />

        {/* Conteúdo Principal */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-lg transition-all ${
              task.completed
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>

          {/* Tags em linha compacta */}
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            {/* Categoria */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${categoryColor}`}
            >
              {categoryName}
            </span>

            {/* Prioridade */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${priorityConfig.color}`}
            >
              {priorityConfig.label}
            </span>

            {/* Data de vencimento */}
            {formattedDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white">
                <Calendar size={14} />
                {formattedDate}
              </span>
            )}
          </div>
        </div>

        {/* Botões e Ícone de Expandir */}
        <div className="flex gap-2 items-center">
          {/* Botão Expandir */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>

          {/* Editar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 size={20} />
          </motion.button>

          {/* Deletar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Conteúdo Expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-300 dark:border-gray-600 px-4 py-3 space-y-3"
          >
            {/* Descrição */}
            {task.description && (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {task.description}
                </p>
              </div>
            )}

            {/* Editar Prioridade */}
            {isEditing && (
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <motion.button
                    key={p}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePriorityChange(p)}
                    className={`py-2 px-3 rounded font-medium text-sm transition-all ${
                      editedPriority === p
                        ? `${getPriorityConfig(p).color} text-white`
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {getPriorityConfig(p).label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Metadados */}
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                Criada em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p>{task.completed ? '✓ Concluída' : '○ Pendente'}</p>
            </div>

            {/* Fechar editor */}
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditing(false)}
                className="w-full py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded font-medium text-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar Editor
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
