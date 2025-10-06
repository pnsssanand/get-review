import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SOCIAL_PLATFORMS = [
  { name: "Instagram", icon: "instagram" },
  { name: "Facebook", icon: "facebook" },
  { name: "LinkedIn", icon: "linkedin" },
  { name: "YouTube", icon: "youtube" },
  { name: "Twitter/X", icon: "twitter" },
  { name: "Google Review", icon: "google" },
  { name: "Play Store", icon: "playstore" },
  { name: "TikTok", icon: "tiktok" },
];

interface ProfileSetupProps {
  userId: string;
  profile: any;
  onUpdate: (userId: string) => void;
}

const ProfileSetup = ({ userId, profile, onUpdate }: ProfileSetupProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [businessName, setBusinessName] = useState(profile?.business_name || "");
  const [uploading, setUploading] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [newLink, setNewLink] = useState({ platform: "", url: "", icon: "", isSmallTask: false });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "GetReview");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlvjvskje/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      await supabase
        .from("profiles")
        .update({ profile_image_url: data.secure_url })
        .eq("id", userId);

      toast.success("Profile image updated!");
      onUpdate(userId);
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, business_name: businessName })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      onUpdate(userId);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.platform || !newLink.url) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("social_links").insert({
      user_id: userId,
      platform: newLink.platform,
      url: newLink.url,
      icon: newLink.icon,
      is_small_task: newLink.isSmallTask,
    });

    if (error) {
      toast.error("Failed to add link");
    } else {
      toast.success("Link added!");
      setNewLink({ platform: "", url: "", icon: "", isSmallTask: false });
      fetchLinks();
    }
  };

  const fetchLinks = async () => {
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId)
      .order("order_index");
    if (data) setLinks(data);
  };

  // Fetch links on mount
  useEffect(() => {
    if (userId) {
      fetchLinks();
    }
  }, [userId]);

  const handleDeleteLink = async (linkId: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", linkId);
    if (error) {
      toast.error("Failed to delete link");
    } else {
      toast.success("Link deleted!");
      fetchLinks();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-luxury flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {fullName?.charAt(0) || "U"}
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:shadow-glow transition-all">
                <Upload className="h-4 w-4 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <Button
            onClick={handleUpdateProfile}
            className="bg-gradient-luxury hover:shadow-glow transition-all"
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={newLink.platform}
                onValueChange={(value) => {
                  const platform = SOCIAL_PLATFORMS.find((p) => p.name === value);
                  setNewLink({
                    ...newLink,
                    platform: value,
                    icon: platform?.icon || "",
                  });
                }}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <SelectItem key={platform.name} value={platform.name}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newLink.isSmallTask}
              onChange={(e) => setNewLink({ ...newLink, isSmallTask: e.target.checked })}
              className="rounded"
            />
            <Label>Mark as Small Task</Label>
          </div>

          <Button
            onClick={handleAddLink}
            className="bg-gradient-luxury hover:shadow-glow transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>

          <div className="mt-6 space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div>
                  <p className="font-medium">{link.platform}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {link.url}
                  </p>
                  {link.is_small_task && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Small Task
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteLink(link.id)}
                  className="hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
