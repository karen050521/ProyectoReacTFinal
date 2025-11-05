import { useThemeStyle } from '../context/ThemeStyleContext';

const StyleSwitcher = () => {
  const { styleMode, setStyleMode } = useThemeStyle();

  return (
    <div className="flex items-center gap-2">
      {/* Botón Tailwind CSS (Azul) */}
      <button
        onClick={() => setStyleMode('tailwind')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all duration-200 ${
          styleMode === 'tailwind'
            ? 'bg-[#2563EB] text-white shadow-lg scale-105'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
        title="Cambiar a Tailwind CSS"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span className="hidden sm:inline">Tailwind</span>
      </button>

      {/* Botón Material UI (Amarillo) */}
      <button
        onClick={() => setStyleMode('materialui')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all duration-200 ${
          styleMode === 'materialui'
            ? 'bg-[#FFC107] text-black shadow-lg scale-105'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
        title="Cambiar a Material UI"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span className="hidden sm:inline">Material UI</span>
      </button>
    </div>
  );
};

export default StyleSwitcher;
