import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { logout } from "../state/authSlice";
import { showAlert } from "./AlertModal";
import {
  FileSignature,
  FileStack,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  UserCircle,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const sections = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/adminDashboard" },
    { name: "Category", icon: FolderTree, path: "/dashboard/category" },
    { name: "Products", icon: PackageSearch, path: "/dashboard/product" },
    { name: "Promotions", icon: FileSignature, path: "/dashboard/promotion" },
    // { name: "Apply Promotion ", icon: FileSignature , path: "/dashboard/applyPromotion/:promotionId" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    showAlert({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancel: true,
      confirmText: "Yes, log out",
      cancelText: "Cancel",
      onConfirm: () => {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        {sidebarOpen && <h1 className="font-bold text-lg">Capital</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <UserCircle size={40} />
        {sidebarOpen && (
          <div>
            <p className="font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "guest"}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto nav-scroll">
        {sections.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}>
              <Icon size={20} />
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition">
          <LogOut size={20} />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
