"use client";

interface BudgetCardProps {
    budget: {
        accommodation?: number;
        food?: number;
        activities?: number;
        transport?: number;
        total?: number;
    };
}

export default function BudgetCard({
    budget,
}: BudgetCardProps) {
    return (
        <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
            <h2 className="text-xl font-semibold text-white mb-5">
                Budget Breakdown
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between">
                    <span className="text-slate-400">
                        Accommodation
                    </span>
                    <span className="text-white font-medium">
                        ₹{budget?.accommodation || 0}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">
                        Food
                    </span>
                    <span className="text-white font-medium">
                        ₹{budget?.food || 0}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">
                        Activities
                    </span>
                    <span className="text-white font-medium">
                        ₹{budget?.activities || 0}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">
                        Transport
                    </span>
                    <span className="text-white font-medium">
                        ₹{budget?.transport || 0}
                    </span>
                </div>

                <hr className="border-white/10" />

                <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">
                        Total
                    </span>
                    <span className="text-green-400">
                        ₹{budget?.total || 0}
                    </span>
                </div>

            </div>
        </div>
    );
}