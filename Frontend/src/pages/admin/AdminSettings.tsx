// src/pages/admin/AdminSettings.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Bell, Shield, Database, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["General", "Notifications", "Security", "Email"];

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your admin panel settings
          </p>
        </div>

        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === index
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <Input placeholder="Padmasambhava Trips" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Support Email
                  </label>
                  <Input placeholder="support@padmasambhavatrip.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Phone
                  </label>
                  <Input placeholder="+91 8287636079" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    WhatsApp Number
                  </label>
                  <Input placeholder="+91 8287636079" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  "New booking notifications",
                  "Visa application updates",
                  "User registration alerts",
                  "Payment confirmations",
                  "Daily summary reports",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span>{item}</span>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span>Two-factor authentication</span>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Email Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SMTP Host
                  </label>
                  <Input placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SMTP Port
                    </label>
                    <Input placeholder="587" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Encryption
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border border-border bg-background">
                      <option>TLS</option>
                      <option>SSL</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SMTP Username
                  </label>
                  <Input placeholder="your-email@gmail.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SMTP Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-6 border-t border-border">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}