import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTopbar from "@/components/admin/AdminTopbar";
import SectionHeader from "@/components/admin/SectionHeader";
import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiClient } from "@/lib/api";

const initialForm = {
  page: "",
  section: "",
  content_key: "",
  content_value: "",
  sort_order: 0,
  published: true,
};

const AdminPageContentPage = () => {
  const [pageContent, setPageContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadPageContent();
  }, []);

  const safeData = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPageContent?.(null);
      setPageContent(safeData(response));
    } catch (error) {
      console.error("Failed to load page content:", error);
      setPageContent([]);
    } finally {
      setLoading(false);
    }
  };

  const getId = (item) => item.id || item._id;

  const getPage = (item) => item.page || "-";
  const getSection = (item) => item.section || "-";
  const getContentKey = (item) => item.content_key || "-";
  const getContentValue = (item) =>
    typeof item.content_value === "string" ? item.content_value : "";
  const getSortOrder = (item) =>
    typeof item.sort_order === "number" ? item.sort_order : 0;
  const getPublished = (item) =>
    typeof item.published === "boolean" ? item.published : true;

  const pageOptions = useMemo(() => {
    const uniquePages = [
      ...new Set(pageContent.map((item) => getPage(item)).filter(Boolean)),
    ];
    return uniquePages.sort();
  }, [pageContent]);

  const filteredPageContent = useMemo(() => {
    const term = search.trim().toLowerCase();

    return pageContent.filter((item) => {
      const matchesPage =
        !pageFilter || getPage(item).toLowerCase() === pageFilter.toLowerCase();

      const matchesSearch =
        !term ||
        getPage(item).toLowerCase().includes(term) ||
        getSection(item).toLowerCase().includes(term) ||
        getContentKey(item).toLowerCase().includes(term) ||
        getContentValue(item).toLowerCase().includes(term);

      return matchesPage && matchesSearch;
    });
  }, [pageContent, search, pageFilter]);

  const openAddModal = () => {
    setEditingContent(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingContent(item);
    setFormData({
      page: item.page || "",
      section: item.section || "",
      content_key: item.content_key || "",
      content_value: item.content_value || "",
      sort_order: typeof item.sort_order === "number" ? item.sort_order : 0,
      published: typeof item.published === "boolean" ? item.published : true,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingContent(null);
    setFormData(initialForm);
  };

  const openDeleteModal = (item) => {
    setSelectedContent(item);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setSelectedContent(null);
    setDeleteOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sort_order"
          ? Number(value)
          : value,
    }));
  };

  const buildPayload = () => ({
    page: formData.page.trim(),
    section: formData.section.trim(),
    content_key: formData.content_key.trim(),
    content_value: formData.content_value.trim(),
    sort_order: Number(formData.sort_order || 0),
    published: formData.published,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.page.trim()) {
      alert("Page name is required.");
      return;
    }

    if (!formData.section.trim()) {
      alert("Section name is required.");
      return;
    }

    if (!formData.content_key.trim()) {
      alert("Content key is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();

      if (editingContent) {
        await apiClient.updatePageContent?.(getId(editingContent), payload);
      } else {
        await apiClient.createPageContent?.(payload);
      }

      closeModal();
      await loadPageContent();
    } catch (error) {
      console.error("Failed to save page content:", error);
      alert("Failed to save page content. Check console/API response.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContent) return;

    if (!apiClient.deletePageContent) {
      alert("Delete page content API is not available yet.");
      return;
    }

    try {
      setDeleting(true);
      await apiClient.deletePageContent(getId(selectedContent));
      closeDeleteModal();
      await loadPageContent();
    } catch (error) {
      console.error("Failed to delete page content:", error);
      alert("Failed to delete page content. Check console/API response.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "page",
      title: "Page / Section",
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{getPage(row)}</p>
          <p className="mt-1 text-xs text-gray-500">{getSection(row)}</p>
        </div>
      ),
    },
    {
      key: "content_key",
      title: "Content Key",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{getContentKey(row)}</p>
          <p className="mt-1 max-w-[320px] truncate text-xs text-gray-500">
            {getContentValue(row) || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "sort_order",
      title: "Order",
      render: (row) => getSortOrder(row),
    },
    {
      key: "published",
      title: "Status",
      render: (row) => (
        <StatusBadge status={getPublished(row) ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => openDeleteModal(row)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminTopbar
        title="Page Content"
        subtitle="Manage dynamic content blocks across all website pages."
        rightContent={
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f3d31] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#183126]"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </button>
        }
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Page Content List"
            subtitle="Search, filter, edit, and manage all content records."
          />

          <div className="mb-5 grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              placeholder="Search by page, section, content key, or content value..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            />

            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            >
              <option value="">All Pages</option>
              {pageOptions.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>
          </div>

          <DataTable
            columns={columns}
            data={filteredPageContent}
            loading={loading}
            emptyTitle="No page content found"
            emptyDescription="Add your first page content record."
          />
        </div>
      </div>

      <FormModal
        open={modalOpen}
        title={editingContent ? "Edit Page Content" : "Add Page Content"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitText={editingContent ? "Update Content" : "Create Content"}
        loading={saving}
        width="max-w-3xl"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Page Name
            </label>
            <input
              type="text"
              name="page"
              value={formData.page}
              onChange={handleChange}
              placeholder="Example: home, about, contact"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Section Name
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Example: hero, stats, cta"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content Key
            </label>
            <input
              type="text"
              name="content_key"
              value={formData.content_key}
              onChange={handleChange}
              placeholder="Example: heading, description, button_text"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content Value
            </label>
            <textarea
              name="content_value"
              value={formData.content_value}
              onChange={handleChange}
              rows={8}
              placeholder="Enter content value"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleChange}
              placeholder="Enter sort order"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#c8a45d] focus:ring-2 focus:ring-[#c8a45d]/20"
            />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#1f3d31] focus:ring-[#1f3d31]"
              />
              Published Content
            </label>
          </div>
        </div>
      </FormModal>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete Page Content"
        message={`Are you sure you want to delete "${
          selectedContent
            ? `${getPage(selectedContent)} / ${getSection(selectedContent)} / ${getContentKey(selectedContent)}`
            : "this content block"
        }"? This action cannot be undone.`}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminPageContentPage;