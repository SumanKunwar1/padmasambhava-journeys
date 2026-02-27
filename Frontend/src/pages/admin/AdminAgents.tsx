// src/pages/admin/AdminAgents.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle, XCircle, Clock, Phone, Mail, MapPin,
  Trash2, Key, Eye, X, UserCheck, UserX, Loader2, Building2, Globe, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

interface Agent {
  _id: string;
  agentId?: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  website?: string;
  experience: string;
  status: "Pending" | "Approved" | "Rejected";
  commissionRate?: number;
  totalBookings?: number;
  totalRevenue?: number;
  isActive?: boolean;
  notes?: string;
  createdAt?: string;
}

interface Stats {
  totalAgents: number;
  approvedAgents: number;
  pendingAgents: number;
  rejectedAgents: number;
}

type ModalMode = "approve" | "settings" | "reject" | "view" | null;

export default function AdminAgents() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Approve form — no password, agent already set theirs at signup
  const [approveForm, setApproveForm] = useState({ commissionRate: 10, notes: "" });

  // Settings form (for already approved agents)
  const [settingsForm, setSettingsForm] = useState({ commissionRate: 10, notes: "", isActive: true });

  // Reject form
  const [rejectNotes, setRejectNotes] = useState("");

  useEffect(() => {
    fetchAgents();
    fetchStats();
  }, [statusFilter]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      const response = await axiosInstance.get("/agents", { params });
      if (response.data.status === "success") {
        setAgents(response.data.data.agents || []);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to fetch agents", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/agents/stats");
      if (response.data.status === "success") setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const openApproveModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setApproveForm({ commissionRate: 10, notes: "" });
    setModalMode("approve");
  };

  const openRejectModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setRejectNotes("");
    setModalMode("reject");
  };

  const openSettingsModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setSettingsForm({
      commissionRate: agent.commissionRate ?? 10,
      notes: agent.notes || "",
      isActive: agent.isActive !== false,
    });
    setModalMode("settings");
  };

  const openViewModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAgent(null);
  };

  const handleApprove = async () => {
    if (!selectedAgent) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/agents/${selectedAgent._id}/approve`, {
        commissionRate: approveForm.commissionRate,
        notes: approveForm.notes,
      });
      toast({
        title: "Agent Approved!",
        description: `${selectedAgent.fullName} can now login with their registered email and password.`,
      });
      fetchAgents();
      fetchStats();
      closeModal();
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to approve agent", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAgent) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/agents/${selectedAgent._id}/reject`, { notes: rejectNotes });
      toast({ title: "Agent Rejected", description: `${selectedAgent.fullName} has been rejected.` });
      fetchAgents();
      fetchStats();
      closeModal();
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to reject agent", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!selectedAgent) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/agents/${selectedAgent._id}/credentials`, {
        commissionRate: settingsForm.commissionRate,
        notes: settingsForm.notes,
        isActive: settingsForm.isActive,
      });
      toast({ title: "Updated!", description: "Agent settings updated successfully." });
      fetchAgents();
      closeModal();
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to update settings", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/agents/${id}`);
      toast({ title: "Deleted", description: "Agent deleted successfully." });
      fetchAgents();
      fetchStats();
    } catch {
      toast({ title: "Error", description: "Failed to delete agent", variant: "destructive" });
    }
  };

  const filteredAgents = agents.filter(
    (a) =>
      a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Agents Management</h1>
          <p className="text-muted-foreground mt-1">
            Review applications and approve agents — agents use the password they set during signup
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total", value: stats.totalAgents, color: "text-foreground" },
              { label: "Approved", value: stats.approvedAgents, color: "text-green-600" },
              { label: "Pending", value: stats.pendingAgents, color: "text-amber-600" },
              { label: "Rejected", value: stats.rejectedAgents, color: "text-red-600" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email or company..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchAgents()}
              className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "Pending", "Approved", "Rejected"].map((s) => (
              <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm"
                onClick={() => setStatusFilter(s)}>
                {s === "all" ? "All" : s}
              </Button>
            ))}
          </div>
        </div>

        {/* Agent Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No agents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent, index) => (
              <motion.div key={agent._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow flex flex-col">

                {/* Name + Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{agent.fullName || "Unknown"}</h3>
                    {agent.agentId && (
                      <span className="text-xs text-muted-foreground font-mono">{agent.agentId}</span>
                    )}
                  </div>
                  <span className={cn("ml-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0", getStatusColor(agent.status))}>
                    {getStatusIcon(agent.status)}{agent.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{agent.companyName || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{agent.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{agent.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{agent.city && agent.state ? `${agent.city}, ${agent.state}` : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span>{agent.experience ? `${agent.experience} yrs exp.` : "N/A"}</span>
                  </div>
                  {agent.commissionRate !== undefined && agent.status === "Approved" && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium inline-block">
                      {agent.commissionRate}% Commission
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-border space-y-2">
                  {agent.status === "Pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => openApproveModal(agent)}>
                        <UserCheck className="w-4 h-4 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1"
                        onClick={() => openRejectModal(agent)}>
                        <UserX className="w-4 h-4 mr-1" />Reject
                      </Button>
                    </div>
                  )}
                  {agent.status === "Approved" && (
                    <Button size="sm" variant="outline" className="w-full"
                      onClick={() => openSettingsModal(agent)}>
                      <Key className="w-4 h-4 mr-1" />Agent Settings
                    </Button>
                  )}
                  {agent.status === "Rejected" && (
                    <Button size="sm" variant="outline" className="w-full"
                      onClick={() => openApproveModal(agent)}>
                      <UserCheck className="w-4 h-4 mr-1" />Re-approve
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => openViewModal(agent)}>
                      <Eye className="w-4 h-4 mr-1" />View Details
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(agent._id, agent.fullName)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalMode && selectedAgent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="pointer-events-auto w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className={cn("p-6 text-white shrink-0",
                  modalMode === "approve" ? "bg-gradient-to-r from-green-600 to-emerald-600" :
                  modalMode === "settings" ? "bg-gradient-to-r from-blue-600 to-indigo-600" :
                  modalMode === "reject" ? "bg-gradient-to-r from-red-600 to-rose-600" :
                  "bg-gradient-to-r from-slate-600 to-slate-700")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">
                        {modalMode === "approve" && "Approve Agent Application"}
                        {modalMode === "settings" && "Agent Settings"}
                        {modalMode === "reject" && "Reject Application"}
                        {modalMode === "view" && "Agent Details"}
                      </h2>
                      <p className="text-white/80 text-sm mt-0.5">
                        {selectedAgent.fullName} · {selectedAgent.email}
                      </p>
                    </div>
                    <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                  {/* ── APPROVE ───────────────────────────────────────────── */}
                  {modalMode === "approve" && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                        <strong>No password needed.</strong> {selectedAgent.fullName} set their own password when they signed up. Once approved, they can immediately login with their email and that password.
                      </div>

                      {/* Agent summary */}
                      <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company</span>
                          <span className="font-medium">{selectedAgent.companyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span className="font-medium">{selectedAgent.city}, {selectedAgent.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Experience</span>
                          <span className="font-medium">{selectedAgent.experience} yrs</span>
                        </div>
                        {selectedAgent.website && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Website</span>
                            <a href={selectedAgent.website} target="_blank" rel="noopener noreferrer"
                              className="text-primary hover:underline truncate max-w-[180px]">
                              {selectedAgent.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Commission Rate */}
                      <div>
                        <Label className="text-sm font-medium">Commission Rate (%)</Label>
                        <p className="text-xs text-muted-foreground mb-1">How much the agent earns per booking</p>
                        <Input type="number" min={0} max={100} value={approveForm.commissionRate}
                          onChange={(e) => setApproveForm({ ...approveForm, commissionRate: Number(e.target.value) })}
                          className="mt-1" />
                      </div>

                      {/* Notes */}
                      <div>
                        <Label className="text-sm font-medium">Internal Notes (Optional)</Label>
                        <textarea value={approveForm.notes}
                          onChange={(e) => setApproveForm({ ...approveForm, notes: e.target.value })}
                          placeholder="Any notes about this agent..."
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </>
                  )}

                  {/* ── SETTINGS (approved agents) ────────────────────────── */}
                  {modalMode === "settings" && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        Agent ID: <strong>{selectedAgent.agentId || "N/A"}</strong> · Login: <strong>{selectedAgent.email}</strong>
                        <br />The agent manages their own password.
                      </div>

                      {/* Commission */}
                      <div>
                        <Label className="text-sm font-medium">Commission Rate (%)</Label>
                        <Input type="number" min={0} max={100} value={settingsForm.commissionRate}
                          onChange={(e) => setSettingsForm({ ...settingsForm, commissionRate: Number(e.target.value) })}
                          className="mt-1" />
                      </div>

                      {/* Active toggle */}
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <input type="checkbox" id="isActive" checked={settingsForm.isActive}
                          onChange={(e) => setSettingsForm({ ...settingsForm, isActive: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300" />
                        <div>
                          <Label htmlFor="isActive" className="cursor-pointer font-medium">Account Active</Label>
                          {!settingsForm.isActive && (
                            <p className="text-xs text-red-600 mt-0.5">Agent will not be able to login while inactive</p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label className="text-sm font-medium">Internal Notes</Label>
                        <textarea value={settingsForm.notes}
                          onChange={(e) => setSettingsForm({ ...settingsForm, notes: e.target.value })}
                          placeholder="Any notes..."
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </>
                  )}

                  {/* ── REJECT ────────────────────────────────────────────── */}
                  {modalMode === "reject" && (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                        You are about to <strong>reject</strong> the application from{" "}
                        <strong>{selectedAgent.fullName}</strong> ({selectedAgent.email}). They will not be able to login.
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Reason / Notes (Optional)</Label>
                        <textarea value={rejectNotes}
                          onChange={(e) => setRejectNotes(e.target.value)}
                          placeholder="Reason for rejection (internal only)..."
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </>
                  )}

                  {/* ── VIEW ──────────────────────────────────────────────── */}
                  {modalMode === "view" && (
                    <div className="space-y-4">
                      {[
                        { label: "Full Name", value: selectedAgent.fullName },
                        { label: "Company", value: selectedAgent.companyName },
                        { label: "Email", value: selectedAgent.email },
                        { label: "Phone", value: selectedAgent.phone },
                        { label: "City", value: selectedAgent.city },
                        { label: "State", value: selectedAgent.state },
                        { label: "Website", value: selectedAgent.website || "—" },
                        { label: "Experience", value: selectedAgent.experience },
                        { label: "Status", value: selectedAgent.status },
                        { label: "Agent ID", value: selectedAgent.agentId || "Not assigned yet" },
                        { label: "Commission Rate", value: selectedAgent.commissionRate ? `${selectedAgent.commissionRate}%` : "—" },
                        { label: "Account Active", value: selectedAgent.isActive !== false ? "Yes" : "No" },
                        { label: "Notes", value: selectedAgent.notes || "—" },
                        {
                          label: "Applied On",
                          value: selectedAgent.createdAt
                            ? new Date(selectedAgent.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                            : "—"
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5 border-b border-slate-100 pb-2 last:border-0">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
                          <span className="text-sm text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                {modalMode !== "view" && (
                  <div className="shrink-0 border-t border-slate-200 p-6 bg-white flex justify-end gap-3">
                    <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>

                    {modalMode === "approve" && (
                      <Button onClick={handleApprove} disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2">
                        {isSubmitting
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Approving...</>
                          : <><UserCheck className="w-4 h-4" />Approve Agent</>}
                      </Button>
                    )}

                    {modalMode === "settings" && (
                      <Button onClick={handleUpdateSettings} disabled={isSubmitting} className="gap-2">
                        {isSubmitting
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                          : <><Key className="w-4 h-4" />Save Settings</>}
                      </Button>
                    )}

                    {modalMode === "reject" && (
                      <Button onClick={handleReject} disabled={isSubmitting} variant="destructive" className="gap-2">
                        {isSubmitting
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Rejecting...</>
                          : <><UserX className="w-4 h-4" />Confirm Rejection</>}
                      </Button>
                    )}
                  </div>
                )}

                {modalMode === "view" && (
                  <div className="shrink-0 border-t border-slate-200 p-6 bg-white flex justify-between">
                    <div className="flex gap-2">
                      {selectedAgent.status === "Pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700"
                            onClick={() => { closeModal(); setTimeout(() => openApproveModal(selectedAgent), 100); }}>
                            <UserCheck className="w-4 h-4 mr-1" />Approve
                          </Button>
                          <Button size="sm" variant="destructive"
                            onClick={() => { closeModal(); setTimeout(() => openRejectModal(selectedAgent), 100); }}>
                            <UserX className="w-4 h-4 mr-1" />Reject
                          </Button>
                        </>
                      )}
                      {selectedAgent.status === "Approved" && (
                        <Button size="sm" variant="outline"
                          onClick={() => { closeModal(); setTimeout(() => openSettingsModal(selectedAgent), 100); }}>
                          <Key className="w-4 h-4 mr-1" />Settings
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" onClick={closeModal}>Close</Button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}