import { TaskProvider } from './contexts/TaskContext';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { WeatherWidget } from './components/WeatherWidget';
import { DueDateCalendar } from './components/DueDateCalendar';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo e Título */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <CheckSquare size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                  Task Mate
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Seu gerenciador de tarefas moderno
                </p>
              </div>
            </motion.div>


          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Sidebar - Formulário */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-4">
                <WeatherWidget />
                <DueDateCalendar />
              </div>
            </motion.div>

            {/* Main Content - Task List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3 space-y-6"
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Minhas Tarefas</h2>
                <TaskForm />
              </div>
              <TaskList />
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>
              ✨ Task Mate • Construído com React, Vite, TypeScript e Tailwind CSS
            </p>
            <p className="mt-1">
              Seus dados são salvos automaticamente no seu navegador
            </p>
          </div>
        </motion.footer>
      </div>
    </TaskProvider>
  );
}

export default App;
