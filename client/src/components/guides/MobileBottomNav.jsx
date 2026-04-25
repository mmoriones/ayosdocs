import { Home, List, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileBottomNav = ({ onOpenTOC, onOpenChecklist }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center py-2">

        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center text-gray-600 text-xs"
        >
          <Home size={20} />
          Home
        </button>

        <button
          onClick={onOpenTOC}
          className="flex flex-col items-center text-gray-600 text-xs"
        >
          <List size={20} />
          TOC
        </button>

        <button
          onClick={onOpenChecklist}
          className="flex flex-col items-center text-gray-600 text-xs"
        >
          <CheckSquare size={20} />
          Checklist
        </button>

      </div>
    </div>
  );
};

export default MobileBottomNav;
