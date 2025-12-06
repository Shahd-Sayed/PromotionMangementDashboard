import { Save } from "lucide-react";

const SaveOrderButton = ({ saveOrder }) => {
  if (!saveOrder) return null;

  return (
    <button
      onClick={saveOrder}
      className="fixed bottom-8 right-8 bg-linear-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105">
      <Save size={20} />
      Save Order
    </button>
  );
};

export default SaveOrderButton;
