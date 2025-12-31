export default function ToggleButton({ showUpdated, setShowUpdated }) {
  return (
    <button
      onClick={() => setShowUpdated(!showUpdated)}
      className="px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      aria-label={showUpdated ? "Switch to original content" : "Switch to updated content"}
    >
      {showUpdated ? "Show Original" : "Show Updated"}
    </button>
  );
}  