import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ConvertToBusinessButtonProps {
  currentUser: any;
  currentProfile: any;
}

export const ConvertToBusinessButton = ({ currentUser, currentProfile }: ConvertToBusinessButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [convertAccount, setConvertAccount] = useState(false);
  const navigate = useNavigate();

  // Don't show if already a business account
  if (currentProfile?.account_type === "business") {
    return null;
  }

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    website: "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate user authentication
    if (!currentUser || !currentUser.id) {
      toast.error("Authentication required", {
        description: "Please sign in to create a business"
      });
      navigate("/auth");
      return;
    }
    
    // Validate required fields
    if (!formData.name?.trim() || !formData.category?.trim()) {
      toast.error("Missing required fields", {
        description: "Business name and category are required"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('Creating business with owner_id:', currentUser.id);
      
      // Prepare business data
      const businessInsertData = {
        owner_id: currentUser.id,
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description?.trim() || null,
        website: formData.website?.trim() || null,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        country: formData.country?.trim() || null,
        is_active: true,
      };
      
      console.log('Business data to insert:', businessInsertData);
      
      // Create business profile
      const { data: businessData, error: businessError } = await supabase
        .from("businesses")
        .insert(businessInsertData)
        .select()
        .single();

      if (businessError) {
        console.error('Business creation error:', businessError);
        throw businessError;
      }
      
      console.log('Business created successfully:', businessData);

      // If user wants to convert their account, update profile
      if (convertAccount) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            account_type: "business",
            business_id: businessData.id,
          })
          .eq("id", currentUser.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't throw - business was created, just warn user
          toast.warning("Business created but profile update failed", {
            description: profileError.message
          });
        }
      }

      toast.success("Business created successfully! 🎉", {
        description: convertAccount 
          ? "Your account has been converted to a business account" 
          : "You can manage your business from the dashboard",
      });

      setShowDialog(false);
      
      // Small delay before navigation to ensure toast is visible
      setTimeout(() => {
        navigate(`/business/${businessData.id}`);
      }, 1000);
      
    } catch (error: any) {
      console.error("Error creating business:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error, null, 2)
      });
      
      // Better error messages based on error codes
      let errorMessage = "Failed to create business";
      let errorDescription = error.message || "An unexpected error occurred";
      
      if (error.code === 'PGRST301') {
        errorMessage = "Session expired";
        errorDescription = "Please sign in again";
      } else if (error.code === '42P01') {
        errorMessage = "System configuration error";
        errorDescription = "Database not initialized. Please contact support.";
      } else if (error.code === '42501') {
        errorMessage = "Permission denied";
        errorDescription = "You don't have permission to create businesses. Please contact support.";
      } else if (error.code === '23502') {
        errorMessage = "Missing required information";
        errorDescription = "Please fill in all required fields";
      } else if (error.code === '23503') {
        errorMessage = "Authentication error";
        errorDescription = "User account not found. Please sign in again.";
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={() => setShowDialog(true)}
            className="rounded-full shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold px-6 py-6 flex items-center gap-2 group"
          >
            <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Convert to Business</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600" />
              Create Your Business Profile
            </DialogTitle>
            <DialogDescription>
              Fill in your business details to get started. You can update this information anytime.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Restaurant, Salon, Retail"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell customers about your business..."
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="business@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.yourbusiness.com"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Location</h3>
              
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>

            {/* Convert Account Option */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <Checkbox
                  id="convertAccount"
                  checked={convertAccount}
                  onCheckedChange={(checked) => setConvertAccount(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="convertAccount"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Convert my personal account to a business account
                  </label>
                  <p className="text-sm text-gray-600">
                    Your profile will be linked to this business. You can switch back to personal anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name?.trim() || !formData.category?.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Create Business
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
