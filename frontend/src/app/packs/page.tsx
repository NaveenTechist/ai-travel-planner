// src/app/packs/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/components/navigation/DashboardLayout";
import DashboardLayout from "@/components/navigation/DashboardLayout";
import api from "@/utils/api";
import { getCountryFlag } from "@/utils/flag";
import { 
    Backpack, 
    Check, 
    FileText, 
    Laptop, 
    Shirt, 
    ShieldAlert, 
    ChevronDown,
    ListTodo
} from "lucide-react";

export default function PacksPage() {
    return (
        <DashboardLayout>
            <PacksContent />
        </DashboardLayout>
    );
}

function PacksContent() {
    const { 
        trips, 
        selectedTripId, 
        setSelectedTripId, 
        fetchTrips 
    } = useDashboard();

    // Default viewing trip to selectedTripId or first trip
    const [viewingTripId, setViewingTripId] = useState<string | null>(selectedTripId || (trips[0]?._id ?? null));

    // Handle case where global state changes selectedTripId
    useMemo(() => {
        if (selectedTripId && selectedTripId !== viewingTripId) {
            setViewingTripId(selectedTripId);
        }
    }, [selectedTripId]);

    const activeTrip = useMemo(() => {
        return trips.find(t => t._id === (viewingTripId || selectedTripId)) || trips[0] || null;
    }, [trips, viewingTripId, selectedTripId]);

    // Check if item is an electronic device based on keywords
    const isElectronic = (itemName: string) => {
        const keywords = /charger|power|bank|camera|laptop|phone|headphone|earbud|plug|adapter|cable|device|kindle|watch/i;
        return keywords.test(itemName);
    };

    // Extract categories
    const categorizedItems = useMemo(() => {
        if (!activeTrip || !activeTrip.packingList) {
            return { documents: [], electronics: [], clothing: [], essentials: [] };
        }

        const list: any = activeTrip.packingList;
        
        let documents: any[] = [];
        let electronics: any[] = [];
        let clothing: any[] = [];
        let essentials: any[] = [];

        // Check if DB packingList is an array or object
        if (Array.isArray(list)) {
            list.forEach((itemObj: any) => {
                const name = itemObj.item || "";
                if (isElectronic(name)) {
                    electronics.push(itemObj);
                } else if (itemObj.category?.toLowerCase() === "documents" || /passport|visa|ticket|document|booking/i.test(name)) {
                    documents.push(itemObj);
                } else if (itemObj.category?.toLowerCase() === "clothing" || /wear|shirt|shoes|pant|jacket|sock|hat/i.test(name)) {
                    clothing.push(itemObj);
                } else {
                    essentials.push(itemObj);
                }
            });
        } else {
            // Object structure: crucialDocuments, activityEquipment, climateWear
            documents = list.crucialDocuments || [];
            clothing = list.climateWear || [];
            
            const equip = list.activityEquipment || [];
            equip.forEach((itemObj: any) => {
                if (isElectronic(itemObj.item)) {
                    electronics.push(itemObj);
                } else {
                    essentials.push(itemObj);
                }
            });
        }

        return { documents, electronics, clothing, essentials };
    }, [activeTrip]);

    // Calculate Completion
    const stats = useMemo(() => {
        const allItems = [
            ...categorizedItems.documents,
            ...categorizedItems.electronics,
            ...categorizedItems.clothing,
            ...categorizedItems.essentials
        ];
        
        const total = allItems.length;
        const checked = allItems.filter(item => item.checked).length;
        const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

        return { total, checked, percent };
    }, [categorizedItems]);

    // Toggle packing checklist item
    const togglePackingItem = async (itemId: string, itemCategory: string) => {
        if (!activeTrip) return;

        const list: any = activeTrip.packingList;
        let updatedPackingList: any = {};

        if (Array.isArray(list)) {
            updatedPackingList = list.map((itemObj: any) => 
                itemObj._id === itemId ? { ...itemObj, checked: !itemObj.checked } : itemObj
            );
        } else {
            updatedPackingList = {
                crucialDocuments: (list.crucialDocuments || []).map((itemObj: any) => 
                    itemObj._id === itemId ? { ...itemObj, checked: !itemObj.checked } : itemObj
                ),
                activityEquipment: (list.activityEquipment || []).map((itemObj: any) => 
                    itemObj._id === itemId ? { ...itemObj, checked: !itemObj.checked } : itemObj
                ),
                climateWear: (list.climateWear || []).map((itemObj: any) => 
                    itemObj._id === itemId ? { ...itemObj, checked: !itemObj.checked } : itemObj
                ),
            };
        }

        try {
            await api.put(`/trips/${activeTrip._id}`, {
                packingList: updatedPackingList
            });
            await fetchTrips();
        } catch (error) {
            console.error("Failed to update packing item checked state", error);
        }
    };

    return (
        <div className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full space-y-8">
            
            {/* Header section with Trip Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white font-ravex">
                        Packing Assistant
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Select a trip and tick off packing items before you travel.
                    </p>
                </div>

                {/* Styled Trip Selector Dropdown */}
                {trips.length > 0 && (
                    <div className="relative min-w-[240px]">
                        <select
                            value={viewingTripId || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setViewingTripId(val);
                                setSelectedTripId(val); // Update selected active trip too
                            }}
                            className="
                                w-full appearance-none rounded-[20px] bg-[#111214] border border-white/10 px-5 py-3.5 text-sm text-white pr-10 focus:outline-none focus:border-[#5E7CFF] transition
                            "
                        >
                            {trips.map(trip => (
                                <option key={trip._id} value={trip._id}>
                                    {trip.destination} {getCountryFlag(trip.destination) ? `(${getCountryFlag(trip.destination)})` : ""}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                )}
            </div>

            {activeTrip ? (
                <div className="space-y-8">
                    
                    {/* Progress Card */}
                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-8 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">
                                    Packing Status
                                </span>
                                <h2 className="text-2xl font-bold mt-1 text-white">
                                    {activeTrip.destination} Checklist
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    You have packed <span className="text-white font-semibold">{stats.checked}</span> of <span className="text-white font-semibold">{stats.total}</span> items.
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="text-4xl md:text-5xl font-extrabold text-[#5E7CFF]">
                                    {stats.percent}%
                                </span>
                                <p className="text-xs text-slate-400 mt-1">Completion rate</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden mt-6 border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-[#5E7CFF] to-[#8B5CF6] rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${stats.percent}%` }}
                            />
                        </div>
                    </div>

                    {/* Categorized Checklists Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        
                        {/* Documents */}
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="h-8 w-8 rounded-lg bg-[#5E7CFF]/15 flex items-center justify-center text-[#5E7CFF]">
                                    <FileText size={16} />
                                </div>
                                <h3 className="font-semibold text-white">Documents</h3>
                                <span className="ml-auto text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                                    {categorizedItems.documents.filter(i => i.checked).length}/{categorizedItems.documents.length}
                                </span>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {categorizedItems.documents.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => togglePackingItem(item._id, "documents")}
                                        className="w-full flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 p-3 text-left hover:bg-white/[0.03] transition group"
                                    >
                                        <div className={`
                                            h-5 w-5 rounded-md border flex items-center justify-center transition
                                            ${item.checked 
                                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                                : "border-white/20 group-hover:border-white/40"
                                            }
                                        `}>
                                            {item.checked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm ${item.checked ? "line-through text-slate-500" : "text-slate-200"}`}>
                                            {item.item}
                                        </span>
                                    </button>
                                ))}
                                {categorizedItems.documents.length === 0 && (
                                    <p className="text-xs text-slate-500 italic py-2">No document items suggested.</p>
                                )}
                            </div>
                        </div>

                        {/* Electronics */}
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                                    <Laptop size={16} />
                                </div>
                                <h3 className="font-semibold text-white">Electronics</h3>
                                <span className="ml-auto text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                                    {categorizedItems.electronics.filter(i => i.checked).length}/{categorizedItems.electronics.length}
                                </span>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {categorizedItems.electronics.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => togglePackingItem(item._id, "electronics")}
                                        className="w-full flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 p-3 text-left hover:bg-white/[0.03] transition group"
                                    >
                                        <div className={`
                                            h-5 w-5 rounded-md border flex items-center justify-center transition
                                            ${item.checked 
                                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                                : "border-white/20 group-hover:border-white/40"
                                            }
                                        `}>
                                            {item.checked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm ${item.checked ? "line-through text-slate-500" : "text-slate-200"}`}>
                                            {item.item}
                                        </span>
                                    </button>
                                ))}
                                {categorizedItems.electronics.length === 0 && (
                                    <p className="text-xs text-slate-500 italic py-2">No electronic items suggested.</p>
                                )}
                            </div>
                        </div>

                        {/* Clothing */}
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                                    <Shirt size={16} />
                                </div>
                                <h3 className="font-semibold text-white">Clothing</h3>
                                <span className="ml-auto text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                                    {categorizedItems.clothing.filter(i => i.checked).length}/{categorizedItems.clothing.length}
                                </span>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {categorizedItems.clothing.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => togglePackingItem(item._id, "clothing")}
                                        className="w-full flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 p-3 text-left hover:bg-white/[0.03] transition group"
                                    >
                                        <div className={`
                                            h-5 w-5 rounded-md border flex items-center justify-center transition
                                            ${item.checked 
                                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                                : "border-white/20 group-hover:border-white/40"
                                            }
                                        `}>
                                            {item.checked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm ${item.checked ? "line-through text-slate-500" : "text-slate-200"}`}>
                                            {item.item}
                                        </span>
                                    </button>
                                ))}
                                {categorizedItems.clothing.length === 0 && (
                                    <p className="text-xs text-slate-500 italic py-2">No clothing items suggested.</p>
                                )}
                            </div>
                        </div>

                        {/* Essentials */}
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="h-8 w-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                                    <ListTodo size={16} />
                                </div>
                                <h3 className="font-semibold text-white">Essentials</h3>
                                <span className="ml-auto text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                                    {categorizedItems.essentials.filter(i => i.checked).length}/{categorizedItems.essentials.length}
                                </span>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {categorizedItems.essentials.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => togglePackingItem(item._id, "essentials")}
                                        className="w-full flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 p-3 text-left hover:bg-white/[0.03] transition group"
                                    >
                                        <div className={`
                                            h-5 w-5 rounded-md border flex items-center justify-center transition
                                            ${item.checked 
                                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                                : "border-white/20 group-hover:border-white/40"
                                            }
                                        `}>
                                            {item.checked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm ${item.checked ? "line-through text-slate-500" : "text-slate-200"}`}>
                                            {item.item}
                                        </span>
                                    </button>
                                ))}
                                {categorizedItems.essentials.length === 0 && (
                                    <p className="text-xs text-slate-500 italic py-2">No essential items suggested.</p>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 p-12 text-center">
                    <Backpack size={36} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 font-medium">No trips generated yet.</p>
                    <p className="text-xs text-slate-500 mt-1">Please create a trip layout first to organize packing.</p>
                </div>
            )}

        </div>
    );
}