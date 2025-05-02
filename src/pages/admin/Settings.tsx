
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  Bell,
  Shield,
  UserCog,
  Database,
  Mail,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SystemSettingsForm {
  systemName: string;
  contactEmail: string;
  enableNotifications: boolean;
  dataRetentionDays: number;
  bloodRequestExpiry: number;
  maintenanceMode: boolean;
}

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);

  const systemSettingsForm = useForm<SystemSettingsForm>({
    defaultValues: {
      systemName: "Blood Bank Management System",
      contactEmail: "admin@bloodbank.org",
      enableNotifications: true,
      dataRetentionDays: 365,
      bloodRequestExpiry: 3,
      maintenanceMode: false
    }
  });

  const onSystemSettingsSave = (data: SystemSettingsForm) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("System settings saved:", data);
      toast.success("Settings saved successfully");
      setIsLoading(false);
    }, 1000);
  };

  const handleBackupData = () => {
    toast.success("Database backup initiated");
    // This would trigger a database backup in a real application
  };

  const handleExportData = (dataType: string) => {
    toast.success(`Exporting ${dataType} data`);
    // This would initiate a data export in a real application
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure system settings and manage data
            </p>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Data Management</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system settings and behaviors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...systemSettingsForm}>
                  <form onSubmit={systemSettingsForm.handleSubmit(onSystemSettingsSave)} className="space-y-6">
                    <FormField
                      control={systemSettingsForm.control}
                      name="systemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your blood bank system as displayed throughout the application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemSettingsForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            The primary contact email for system notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemSettingsForm.control}
                      name="bloodRequestExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Request Expiry (Days)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" max="30" />
                          </FormControl>
                          <FormDescription>
                            Number of days after which pending blood requests are automatically expired
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemSettingsForm.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Maintenance Mode</FormLabel>
                            <FormDescription>
                              When enabled, only administrators can access the system
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email and system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Templates</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border p-4 rounded-md">
                        <div>
                          <Label className="text-base">New Blood Request</Label>
                          <p className="text-sm text-gray-500">Sent when a new blood request is created</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>Preview</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileCode className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-md">
                        <div>
                          <Label className="text-base">Request Status Update</Label>
                          <p className="text-sm text-gray-500">Sent when a blood request status changes</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>Preview</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileCode className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-md">
                        <div>
                          <Label className="text-base">Donor Registration</Label>
                          <p className="text-sm text-gray-500">Sent when a new donor registers</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>Preview</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileCode className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notif1" defaultChecked />
                        <label
                          htmlFor="notif1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email notifications for new blood requests
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notif2" defaultChecked />
                        <label
                          htmlFor="notif2"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email notifications for critical blood levels
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notif3" defaultChecked />
                        <label
                          htmlFor="notif3"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          System notifications for new registrations
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notif4" />
                        <label
                          htmlFor="notif4"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Daily summary reports
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Notification Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security settings and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Authentication Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Password Policy</Label>
                          <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" defaultValue={30} className="w-24" />
                          <Button variant="outline">Apply</Button>
                        </div>
                        <p className="text-sm text-gray-500">Duration of inactivity before user is logged out</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Access Control</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="access1" defaultChecked />
                        <label
                          htmlFor="access1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Hospitals can view donor contact information
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="access2" />
                        <label
                          htmlFor="access2"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Allow public registration without approval
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="access3" defaultChecked />
                        <label
                          htmlFor="access3"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Require email verification for new accounts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Security Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Default User Roles</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Default Donor Role</Label>
                          <Select defaultValue="donor">
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="donor">Donor</SelectItem>
                              <SelectItem value="volunteer">Volunteer</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Default Hospital Role</Label>
                          <Select defaultValue="hospital">
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hospital">Hospital</SelectItem>
                              <SelectItem value="blood_bank">Blood Bank</SelectItem>
                              <SelectItem value="clinic">Clinic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-sm mb-4">Configure what each user role can access and modify in the system</p>
                      <Button variant="outline">Manage Role Permissions</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Bulk User Actions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Import Users
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Users
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save User Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage database operations and exports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Database Operations</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border p-4 rounded-md">
                        <div>
                          <p className="font-medium">Database Backup</p>
                          <p className="text-sm text-gray-500">Create a backup of all system data</p>
                        </div>
                        <Button variant="outline" onClick={handleBackupData}>
                          <Download className="h-4 w-4 mr-2" />
                          Backup Now
                        </Button>
                      </div>

                      <div>
                        <Label className="text-base mb-2 block">Data Retention</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" defaultValue={365} className="w-24" />
                          <span className="text-sm">days</span>
                          <Button variant="outline">Update</Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Period to keep historical data before archiving</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Data Exports</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Donor Records</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleExportData('donors')}>CSV</Button>
                          <Button variant="outline" size="sm" onClick={() => handleExportData('donors')}>JSON</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Blood Requests</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleExportData('requests')}>CSV</Button>
                          <Button variant="outline" size="sm" onClick={() => handleExportData('requests')}>JSON</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Inventory Records</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleExportData('inventory')}>CSV</Button>
                          <Button variant="outline" size="sm" onClick={() => handleExportData('inventory')}>JSON</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Hospital Records</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleExportData('hospitals')}>CSV</Button>
                          <Button variant="outline" size="sm" onClick={() => handleExportData('hospitals')}>JSON</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
