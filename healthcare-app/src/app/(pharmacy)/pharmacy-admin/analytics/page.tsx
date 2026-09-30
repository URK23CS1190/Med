"use client";


import { 
    TrendingUp, DollarSign, Package, ShoppingCart, 
    Calendar, Download,
    BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon
} from "lucide-react";
import { Card, Button, Badge, StatCard } from "@/components/ui";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";

const salesData = [
    { day: "Mon", sales: 12400, orders: 45 },
    { day: "Tue", sales: 15600, orders: 52 },
    { day: "Wed", sales: 11200, orders: 38 },
    { day: "Thu", sales: 18900, orders: 61 },
    { day: "Fri", sales: 22400, orders: 74 },
    { day: "Sat", sales: 25800, orders: 82 },
    { day: "Sun", sales: 14200, orders: 48 },
];

const categoryData = [
    { name: "Antibiotics", value: 35, color: "#3B82F6" },
    { name: "Pain Relief", value: 25, color: "#10B981" },
    { name: "Cardiac", value: 20, color: "#F59E0B" },
    { name: "OTC", value: 15, color: "#8B5CF6" },
    { name: "Others", value: 5, color: "#9CA3AF" },
];

export default function PharmacyAnalytics() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Pharmacy Analytics</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Deep dive into sales performance, inventory turnover, and product trends.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>Last 7 Days</Button>
                    <Button size="sm" leftIcon={<Download className="w-4 h-4" />}>Export PDF</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value="₹1,24,500" icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20" trend={{ value: 15.4, label: "vs last week" }} />
                <StatCard label="Avg. Order Value" value="₹385" icon={<ShoppingCart className="w-5 h-5" />} color="text-primary-500" bgColor="bg-primary-50 dark:bg-primary-900/20" trend={{ value: 3.2, label: "stable" }} delay={0.1} />
                <StatCard label="Inventory Turnover" value="1.2x" icon={<Package className="w-5 h-5" />} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-900/20" trend={{ value: -2.1, label: "low stock risk" }} delay={0.2} />
                <StatCard label="Active Customers" value="482" icon={<TrendingUp className="w-5 h-5" />} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-900/20" trend={{ value: 8.5, label: "growing" }} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="md">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-body-lg font-semibold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-500" /> Daily Revenue Trend</h3>
                        <Badge variant="info">Total: ₹1.24L</Badge>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9CA3AF'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9CA3AF'}} tickFormatter={v => `₹${v/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
                                    formatter={(v) => [`₹${(v as number).toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-body-lg font-semibold flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-emerald-500" /> Sales by Category</h3>
                        <Button variant="ghost" size="sm">Product Mix</Button>
                    </div>
                    <div className="h-72 flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-3 pl-0 md:pl-6 mt-4 md:mt-0">
                            {categoryData.map((c, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                                        <span className="text-body-sm text-content-secondary group-hover:text-content-primary transition-colors">{c.name}</span>
                                    </div>
                                    <span className="text-body-sm font-bold">{c.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <Card padding="md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-body-lg font-semibold flex items-center gap-2"><LineChartIcon className="w-5 h-5 text-indigo-500" /> Order Fulfillment Efficiency</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /> <span className="text-xs">Processing Time</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-500" /> <span className="text-xs">Inventory Sync</span></div>
                    </div>
                </div>
                <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9CA3AF'}} />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9CA3AF'}} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="orders" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
