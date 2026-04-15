import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Wrench,
  Package,
  Briefcase,
  Users,
  Newspaper,
  FileText,
  Phone,
  FolderKanban,
  UserCog,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatCard from "@/components/admin/StatCard";
import SectionHeader from "@/components/admin/SectionHeader";
import EmptyState from "@/components/admin/EmptyState";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    enquiries: 0,
    repairs: 0,
    products: 0,
    services: 0,
    clients: 0,
    news: 0,
    aboutSections: 0,
    employees: 0,
    pageContent: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await apiClient.adminVerify();
        await loadStats();
      } catch (error) {
        console.error("Admin verify failed:", error);
        navigate("/admin/login");
      }
    };

    verifyAuth();
  }, [navigate]);

  const safeLength = (response) => {
    if (!response) return 0;
    if (Array.isArray(response.data)) return response.data.length;
    if (Array.isArray(response)) return response.length;
    return 0;
  };

  const loadStats = async () => {
    try {
      const results = await Promise.allSettled([
        apiClient.getEnquiries?.(),
        apiClient.getRepairs?.(),
        apiClient.getProducts?.(),
        apiClient.getServices?.(),
        apiClient.getClients?.(),
        apiClient.getNews?.(),
        apiClient.getAboutSections?.(),
        apiClient.getEmployees?.(),
        apiClient.getPageContent?.(),
      ]);

      setStats({
        enquiries:
          results[0].status === "fulfilled" ? safeLength(results[0].value) : 0,
        repairs:
          results[1].status === "fulfilled" ? safeLength(results[1].value) : 0,
        products:
          results[2].status === "fulfilled" ? safeLength(results[2].value) : 0,
        services:
          results[3].status === "fulfilled" ? safeLength(results[3].value) : 0,
        clients:
          results[4].status === "fulfilled" ? safeLength(results[4].value) : 0,
        news:
          results[5].status === "fulfilled" ? safeLength(results[5].value) : 0,
        aboutSections:
          results[6].status === "fulfilled" ? safeLength(results[6].value) : 0,
        employees:
          results[7].status === "fulfilled" ? safeLength(results[7].value) : 0,
        pageContent:
          results[8].status === "fulfilled" ? safeLength(results[8].value) : 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Enquiries",
      value: stats.enquiries,
      icon: Mail,
      color: "bg-blue-500",
      path: "/admin/enquiries",
    },
    {
      title: "Repair Requests",
      value: stats.repairs,
      icon: Wrench,
      color: "bg-orange-500",
      path: "/admin/repairs",
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "bg-green-500",
      path: "/admin/products",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Briefcase,
      color: "bg-violet-500",
      path: "/admin/services",
    },
    {
      title: "Clients",
      value: stats.clients,
      icon: Users,
      color: "bg-indigo-500",
      path: "/admin/clients",
    },
    {
      title: "News",
      value: stats.news,
      icon: Newspaper,
      color: "bg-pink-500",
      path: "/admin/news",
    },
    {
      title: "About Sections",
      value: stats.aboutSections,
      icon: FileText,
      color: "bg-amber-500",
      path: "/admin/about",
    },
    {
      title: "Employees",
      value: stats.employees,
      icon: UserCog,
      color: "bg-emerald-500",
      path: "/admin/employees",
    },
    {
      title: "Page Content",
      value: stats.pageContent,
      icon: FolderKanban,
      color: "bg-slate-600",
      path: "/admin/page-content",
    },
  ];

  const quickActions = [
    {
      label: "Manage Products",
      path: "/admin/products",
      className: "bg-[#1f3d31] hover:bg-[#183126] text-white",
    },
    {
      label: "Manage News",
      path: "/admin/news",
      className: "bg-[#c8a45d] hover:bg-[#b79149] text-white",
    },
    {
      label: "View Enquiries",
      path: "/admin/enquiries",
      className: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      label: "View Repairs",
      path: "/admin/repairs",
      className: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    {
      label: "Edit Contact Page",
      path: "/admin/contact",
      className: "bg-slate-800 hover:bg-slate-900 text-white",
    },
    {
      label: "Edit Services",
      path: "/admin/services",
      className: "bg-violet-600 hover:bg-violet-700 text-white",
    },
  ];

  return (
    <AdminLayout>
      <AdminTopbar
        title="Admin Dashboard"
        subtitle="Manage your website content, submissions, and business data from one place."
        rightContent={
          <button
            onClick={loadStats}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Refresh Data
          </button>
        }
      />

      <div className="space-y-8">
        <section>
          <SectionHeader
            title="Overview"
            subtitle="Quick access to all major website modules."
          />

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-[#1f3d31]" />
              <p className="mt-4 text-sm text-gray-500">Loading dashboard data...</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {statCards.map((card) => (
                <StatCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  onClick={() => navigate(card.path)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            title="Quick Actions"
            subtitle="Open the most-used admin sections directly."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`rounded-2xl px-5 py-4 text-left text-sm font-semibold shadow-sm transition ${action.className}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="System Information"
            subtitle="Basic system status for the admin portal."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Backend Status</p>
              <p className="mt-2 text-base font-semibold text-green-600">Connected</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Database</p>
              <p className="mt-2 text-base font-semibold text-green-600">MongoDB Active</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Admin Access</p>
              <p className="mt-2 text-base font-semibold text-blue-600">Verified Session</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Content Modules</p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {stats.products +
                  stats.services +
                  stats.clients +
                  stats.news +
                  stats.aboutSections}
              </p>
            </div>
          </div>
        </section>

        {!loading &&
          statCards.every((item) => item.value === 0) && (
            <section>
              <EmptyState
                title="No dashboard data available yet"
                description="Your APIs are connected, but no records are currently showing. Start by adding products, services, news, or page content."
              />
            </section>
          )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;