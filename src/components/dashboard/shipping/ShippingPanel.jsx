import { useState, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { updateShippingSettings } from "../../../features/admin/state/thunks";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

export function ShippingPanel({ shippingSettings, mutationStatus }) {
  const dispatch = useAppDispatch();

  const [globalFreeShipping, setGlobalFreeShipping] = useState(false);
  const [defaultShippingCost, setDefaultShippingCost] = useState(50);
  const [governorates, setGovernorates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGov, setNewGov] = useState({
    name_ar: "",
    name_en: "",
    shippingCost: 50,
    isFreeShipping: false,
    isActive: true,
  });

  useEffect(() => {
    if (shippingSettings) {
      setGlobalFreeShipping(Boolean(shippingSettings.globalFreeShipping));
      setDefaultShippingCost(
        Number.isFinite(shippingSettings.defaultShippingCost)
          ? shippingSettings.defaultShippingCost
          : 50
      );
      setGovernorates(
        Array.isArray(shippingSettings.governorates)
          ? shippingSettings.governorates.map((g) => ({ ...g }))
          : []
      );
    }
  }, [shippingSettings]);

  const filteredGovernorates = useMemo(() => {
    if (!searchTerm.trim()) return governorates;
    const term = searchTerm.toLowerCase().trim();
    return governorates.filter(
      (g) =>
        (g.name_ar && g.name_ar.toLowerCase().includes(term)) ||
        (g.name_en && g.name_en.toLowerCase().includes(term))
    );
  }, [governorates, searchTerm]);

  const totalFreeGovs = governorates.filter((g) => g.isFreeShipping || g.shippingCost === 0).length;
  const totalActiveGovs = governorates.filter((g) => g.isActive).length;

  const handleGovFieldChange = (index, field, value) => {
    setGovernorates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleGovFree = (index) => {
    setGovernorates((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isFreeShipping: !updated[index].isFreeShipping,
      };
      return updated;
    });
  };

  const handleToggleGovActive = (index) => {
    setGovernorates((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isActive: !updated[index].isActive,
      };
      return updated;
    });
  };

  const handleDeleteGov = (index) => {
    setGovernorates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddNewGovernorate = (e) => {
    e.preventDefault();
    if (!newGov.name_ar.trim() || !newGov.name_en.trim()) return;

    setGovernorates((prev) => [
      ...prev,
      {
        name_ar: newGov.name_ar.trim(),
        name_en: newGov.name_en.trim(),
        shippingCost: Number(newGov.shippingCost) || 0,
        isFreeShipping: Boolean(newGov.isFreeShipping),
        isActive: true,
      },
    ]);

    setNewGov({
      name_ar: "",
      name_en: "",
      shippingCost: 50,
      isFreeShipping: false,
      isActive: true,
    });
    setIsAddingNew(false);
  };

  const handleSaveAll = () => {
    dispatch(
      updateShippingSettings({
        globalFreeShipping,
        defaultShippingCost: Number(defaultShippingCost) || 50,
        governorates,
      })
    );
  };

  const isSaving = mutationStatus === "loading";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <LocalShippingRoundedIcon fontSize="small" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Shipping & Governorate Control
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            إدارة أسعار الشحن وتحديد الشحن المجاني لكل محافظة أو لكافة المحافظات
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
        >
          <SaveRoundedIcon fontSize="small" />
          {isSaving ? "Saving..." : "Save All Changes (حفظ التعديلات)"}
        </button>
      </div>

      {/* Global Free Shipping Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 transition-all shadow-sm ${
          globalFreeShipping
            ? "border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-white"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                globalFreeShipping
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <StarsRoundedIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Global Free Shipping (توصيل مجاني شامل لجميع المحافظات)
                </h3>
                {globalFreeShipping ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    Active (نشط)
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                    Disabled (معطل)
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                عند تفعيل هذا الخيار، سيتم تطبيق الشحن المجاني (0 ج.م) تلقائياً على كل الطلبات في صفحة الدفع لكافة أنحاء الجمهورية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={globalFreeShipping}
                onChange={(e) => setGlobalFreeShipping(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-14 h-7 rounded-full transition-colors relative duration-300 ${
                  globalFreeShipping ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${
                    globalFreeShipping ? "translate-x-[28px]" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700">
              Default Shipping Cost (سعر الشحن الافتراضي للمناطق غير المحددة):
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={defaultShippingCost}
                onChange={(e) => setDefaultShippingCost(Number(e.target.value) || 0)}
                className="w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-900"
              />
              <span className="text-xs font-medium text-slate-500">EGP</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">
              إجمالي المحافظات: <strong className="text-slate-900">{governorates.length}</strong>
            </span>
            <span className="text-slate-500">
              محافظات بشحن مجاني: <strong className="text-emerald-700">{totalFreeGovs}</strong>
            </span>
            <span className="text-slate-500">
              محافظات نشطة: <strong className="text-teal-700">{totalActiveGovs}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Governorates Table Container */}
      <div className="panel p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Governorates & Custom Delivery Rates
            </h3>
            <p className="text-xs text-slate-500">
              حدد سعر الشحن لكل محافظة أو قم بتفعيل "شحن مجاني" لمحافظات معينة فقط
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <SearchRoundedIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 !w-4 !h-4" />
              <input
                type="text"
                placeholder="Search governorate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-60 rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Add Governorate Button */}
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100 transition cursor-pointer"
            >
              <AddRoundedIcon fontSize="small" />
              {isAddingNew ? "Close Form" : "Add Governorate"}
            </button>
          </div>
        </div>

        {/* Add New Governorate Inline Form */}
        {isAddingNew ? (
          <form
            onSubmit={handleAddNewGovernorate}
            className="mb-5 rounded-2xl border border-teal-200 bg-teal-50/50 p-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-3">
              Add New Governorate or Delivery Zone (إضافة محافظة / منطقة جديدة)
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  اسم المحافظة (بالعربي) *
                </label>
                <input
                  type="text"
                  placeholder="مثال: الغردقة"
                  value={newGov.name_ar}
                  onChange={(e) => setNewGov({ ...newGov, name_ar: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Governorate Name (English) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hurghada"
                  value={newGov.name_en}
                  onChange={(e) => setNewGov({ ...newGov, name_en: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Shipping Cost (سعر الشحن بالجنيه)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="50"
                  value={newGov.shippingCost}
                  onChange={(e) =>
                    setNewGov({ ...newGov, shippingCost: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-end gap-2">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 h-9">
                  <input
                    type="checkbox"
                    checked={newGov.isFreeShipping}
                    onChange={(e) =>
                      setNewGov({ ...newGov, isFreeShipping: e.target.checked })
                    }
                  />
                  شحن مجاني
                </label>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-teal-700 py-2 text-xs font-bold text-white hover:bg-teal-800 transition"
                >
                  Save New
                </button>
              </div>
            </div>
          </form>
        ) : null}

        {/* Governorates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">المحافظة (Arabic)</th>
                <th className="py-3 px-3">Governorate (English)</th>
                <th className="py-3 px-3">سعر الشحن (Shipping Price)</th>
                <th className="py-3 px-3 text-center">شحن مجاني لهذه المحافظة</th>
                <th className="py-3 px-3 text-center">الحالة (Active)</th>
                <th className="py-3 px-3 text-right">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGovernorates.map((gov, idx) => {
                const actualIndex = governorates.findIndex(
                  (g) => g.name_ar === gov.name_ar && g.name_en === gov.name_en
                );
                const isFree = gov.isFreeShipping || globalFreeShipping;

                return (
                  <tr
                    key={gov._id || `${gov.name_en}-${idx}`}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      !gov.isActive ? "opacity-50 bg-slate-50/50" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={gov.name_ar}
                        onChange={(e) =>
                          handleGovFieldChange(
                            actualIndex >= 0 ? actualIndex : idx,
                            "name_ar",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 focus:border-teal-600 focus:outline-none"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={gov.name_en}
                        onChange={(e) =>
                          handleGovFieldChange(
                            actualIndex >= 0 ? actualIndex : idx,
                            "name_en",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 focus:border-teal-600 focus:outline-none"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          disabled={gov.isFreeShipping}
                          value={gov.isFreeShipping ? 0 : gov.shippingCost}
                          onChange={(e) =>
                            handleGovFieldChange(
                              actualIndex >= 0 ? actualIndex : idx,
                              "shippingCost",
                              Number(e.target.value) || 0
                            )
                          }
                          className={`w-20 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                            gov.isFreeShipping
                              ? "border-emerald-200 bg-emerald-50/60 text-emerald-800 cursor-not-allowed"
                              : "border-slate-200 bg-white text-slate-900 focus:border-teal-600"
                          }`}
                        />
                        <span className="text-[11px] font-semibold text-slate-400">
                          EGP
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={gov.isFreeShipping || false}
                          onChange={() =>
                            handleToggleGovFree(actualIndex >= 0 ? actualIndex : idx)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-5 rounded-full transition-colors relative duration-200 ${
                            gov.isFreeShipping ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] left-[2px] bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${
                              gov.isFreeShipping ? "translate-x-[20px]" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </label>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleGovActive(actualIndex >= 0 ? actualIndex : idx)
                        }
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                          gov.isActive
                            ? "bg-teal-100 text-teal-800 hover:bg-teal-200"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        }`}
                      >
                        {gov.isActive ? "مفعلة (Active)" : "معطلة (Inactive)"}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteGov(actualIndex >= 0 ? actualIndex : idx)
                        }
                        className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        title="Delete Governorate"
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredGovernorates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    No governorates match your search term.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShippingPanel;
