"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DeleteAccountDialog() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Please enter your password to confirm");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete(`/api/user/auth/${session?.user?.id}`, {
        data: { password },
      });

      toast.success(res.data?.message || "Account deleted");
      setOpen(false);
      signOut();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete account");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete My Account</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <h3 className="text-lg font-semibold text-destructive">
            Confirm Account Deletion
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            This will permanently delete your account and all data.
            <strong> This action cannot be undone.</strong>
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <Label htmlFor="password">Confirm with Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
            {loading ? "Deleting..." : "Confirm & Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
