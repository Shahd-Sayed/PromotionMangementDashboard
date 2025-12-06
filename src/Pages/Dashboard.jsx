import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {  Package, Tag, Activity, RefreshCw, LayoutDashboard } from "lucide-react";
import axiosClient from "./../api/axiosClient";
import Loader from "../Components/Loader";
import ErrorContainer from "../Components/ErrorContainer";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [promotionsByCategory, setPromotionsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get("/admin/dashboard/stats");
      if (response.data?.data) setStats(response.data.data);

      const categoryResponse = await axiosClient.get("/admin/dashboard/promotions-by-category");
      if (categoryResponse.data?.data) setPromotionsByCategory(categoryResponse.data.data);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorContainer message={error} onRetry={fetchDashboardData} />;

  const summaryCards = [
    { title: "Total Categories", value: stats.total_categories, icon: LayoutDashboard, bgColor: "bg-orange-50", iconColor: "text-orange-600" },
    { title: "Total Products", value: stats.total_products, icon: Package, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Total Promotions", value: stats.total_promotions, icon: Tag, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Total Promotion Usage", value: stats.total_promotion_usage, icon: Activity, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  const dailyUsageData = stats.daily_usage_last_7_days.map(item => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    "Usage Count": item.count,
  }));

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of system statistics</p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-8 h-8 ${card.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Promotion Usage Last 7 Days</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Usage Count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Promotions by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={promotionsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="promotions" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
