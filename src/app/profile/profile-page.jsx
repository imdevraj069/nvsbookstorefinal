"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // Save initial copy
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const userId = session?.user?.id;

  // Fetch profile
  useEffect(() => {
    if (status === "authenticated" && userId) {
      axios
        .get(`/api/user/profile/${userId}`)
        .then((res) => {
          const prfdata =  res.data.data
          setProfileData(prfdata);
          setOriginalData(prfdata); // Save for revert
        })
        .catch((err) => {
          toast.error("Failed to load profile");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (status !== "loading" && !userId) {
      router.push("/");
    }
  }, [session, userId, status]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId || !profileData) return;

    try {
      await axios.put(`/api/user/profile/${userId}`, profileData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setProfileData({ ...originalData }); // Revert changes from in-memory copy
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="text-center py-10">No profile data found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Photo */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage
                src={profileData.image ?? "/placeholder.svg"}
                alt={profileData.name}
              />
              <AvatarFallback className="text-2xl">
                {profileData.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-2">{profileData.name}</h2>
            <p className="text-muted-foreground mb-4">{profileData.email}</p>
            {isEditing && (
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[ 
                { id: "name", icon: <User />, type: "text" },
                { id: "email", icon: <Mail />, type: "email" },
                { id: "phone", icon: <Phone />, type: "text" },
                { id: "dateOfBirth", icon: <Calendar />, type: "date" },
                { id: "address", icon: <MapPin />, type: "text" },
                { id: "education", type: "text" },
              ].map(({ id, icon, type }) => (
                <div
                  key={id}
                  className={
                    id === "address" || id === "education"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <Label htmlFor={id}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </Label>
                  {isEditing ? (
                    <Input
                      id={id}
                      type={type}
                      value={
                        type === "date"
                          ? profileData[id]?.split("T")[0] || ""
                          : profileData[id] || ""
                      }
                      onChange={(e) => handleInputChange(id, e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      {icon && icon}
                      <span>
                        {type === "date"
                          ? profileData[id]?.split("T")[0]
                          : profileData[id]}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                  />
                ) : (
                  <div className="mt-1">
                    <p className="text-muted-foreground">{profileData.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Interests</h3>
            {isEditing ? (
              <Input
                placeholder="Comma separated interests"
                value={profileData.interests?.join(", ") || ""}
                onChange={(e) =>
                  handleInputChange(
                    "interests",
                    e.target.value.split(",").map((i) => i.trim())
                  )
                }
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.interests?.length > 0 ? (
                  profileData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">No interests listed.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
