// components/editpofile.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, Award, User as UserIcon } from "lucide-react";
import { HeroHeader2 } from "./hero8-head2";
import { useAuth } from "@/app/context/AuthContext";
import type { UserProfile } from "@/types/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type FormState = {
  firstname: string;
  lastname: string;
  email: string; // fixed (read-only)
  phone: string;
  aboutme: string;
  imageFile: File | null;
  imagePreview: string | null;
};

export default function EditProfilePage() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [original, setOriginal] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    aboutme: "",
    imageFile: null,
    imagePreview: null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // โหลดโปรไฟล์เดิมมาเติมในฟอร์ม
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const abort = new AbortController();
    (async () => {
      try {
        setErr(null);
        const res = await fetch(`${API}/api/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(await res.text());
        const data: UserProfile = await res.json();

        const normalized: UserProfile = {
          user_id: data.user_id,
          firstname: data.firstname ?? "",
          lastname: data.lastname ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          aboutme: data.aboutme ?? "",
          image_url: data.image_url ?? "",
        };

        setOriginal(normalized);
        setForm((f) => ({
          ...f,
          firstname: normalized.firstname,
          lastname: normalized.lastname,
          email: normalized.email, // fixed
          phone: normalized.phone,
          aboutme: normalized.aboutme,
          imageFile: null,
          imagePreview: normalized.image_url || null,
        }));
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setErr(e instanceof Error ? e.message : "Load profile failed");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => abort.abort();
  }, [API, token]);

  // ค่าที่เปลี่ยนไปจาก original (ไม่รวม email และ image จัดการต่างหาก)
  const dirtyFields = useMemo(() => {
    if (!original) return {};
    const d: Record<string, string> = {};
    if (form.firstname !== original.firstname) d.firstname = form.firstname;
    if (form.lastname !== original.lastname) d.lastname = form.lastname;
    // email fixed: ไม่ส่งไปแก้
    if (form.phone !== original.phone) d.phone = form.phone;
    if (form.aboutme !== original.aboutme) d.aboutme = form.aboutme;
    return d;
  }, [form.firstname, form.lastname, form.phone, form.aboutme, original]);

  const onPickImage = () => fileInputRef.current?.click();

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    // พรีวิว
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageFile: file, imagePreview: url }));
  };

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setForm((f) => ({ ...f, [key]: v }));
    };

  const onClear = () => {
    if (!original) return;
    setForm({
      firstname: original.firstname ?? "",
      lastname: original.lastname ?? "",
      email: original.email ?? "",
      phone: original.phone ?? "",
      aboutme: original.aboutme ?? "",
      imageFile: null,
      imagePreview: original.image_url || null,
    });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      setErr(null);

      // ส่งเฉพาะคีย์ที่ "เปลี่ยนจริง" เท่านั้น + ไฟล์ถ้าเปลี่ยนรูป
      const fd = new FormData();

      Object.entries(dirtyFields).forEach(([k, v]) => {
        // ส่งแม้ v==="" ถ้ามันต่างจากเดิม (เพื่อเคลียร์ค่า)
        fd.append(k, v);
      });

      if (form.imageFile) {
        fd.append("image", form.imageFile, form.imageFile.name);
      }

      // ถ้าไม่มีอะไรเปลี่ยนเลย ก็ไม่ต้องยิง
      if ([...fd.keys()].length === 0) {
        toast.info("No changes to update.");
        return;
      }

      const res = await fetch(`${API}/api/userprofile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd, // อย่าตั้ง Content-Type เอง ให้ browser ใส่ boundary ให้
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Update failed (${res.status})`);
      }

      toast.success("Profile updated 🎉");

      // อัปเดต original ในหน้าให้ตรงกับของใหม่ (เพื่อให้ dirtyFields รีเซ็ต)
      const newOriginal: UserProfile = {
        user_id: original?.user_id,
        firstname: form.firstname,
        lastname: form.lastname,
        email: original?.email ?? form.email, // email fixed
        phone: form.phone,
        aboutme: form.aboutme,
        image_url: form.imageFile
          ? form.imagePreview ?? ""
          : original?.image_url ?? "",
      };
      setOriginal(newOriginal);
      setForm((f) => ({ ...f, imageFile: null }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    }
  };

  if (loading)
    return (
      <>
        <HeroHeader2 />
        <div className="pt-24 p-6">Loading…</div>
      </>
    );
  if (err)
    return (
      <>
        <HeroHeader2 />
        <div className="pt-24 p-6 text-red-600">{err}</div>
      </>
    );

  return (
    <>
      <HeroHeader2 />
      <div className="flex justify-center items-start min-h-screen  px-4 pt-24 pb-10">
        <Card className="w-full max-w-2xl rounded-2xl shadow-lg p-6 bg-white">
          {/* Header */}
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <button
              type="button"
              className="text-gray-500 hover:text-black cursor-pointer text-2xl "
              onClick={() => router.back()} 
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <p className="text-sm text-gray-500">
                Update your personal information
              </p>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 ml-10 rounded-full bg-yellow-400 flex items-center justify-center text-4xl overflow-hidden">
                {form.imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-14 w-14 text-black/80" />
                )}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700">
                <span className="inline-block h-2 w-24 overflow-hidden rounded-full bg-neutral-400/60">
                  <span className="block h-full w-[85%] bg-neutral-700" />
                </span>
                Level 10
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPickImage}
              >
                <Camera className="mr-2 h-4 w-4" /> Change Photo
              </Button>
              <Button type="button" variant="outline" size="sm" disabled>
                <Award className="mr-2 h-4 w-4" /> Change Badge
              </Button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit} onReset={onClear}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Firstname</label>
                <Input
                  placeholder="Enter firstname"
                  value={form.firstname}
                  onChange={onChange("firstname")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Lastname</label>
                <Input
                  placeholder="Enter lastname"
                  value={form.lastname}
                  onChange={onChange("lastname")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  readOnly
                  disabled
                  aria-readonly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">About Me</label>
              <Textarea
                value={form.aboutme}
                onChange={onChange("aboutme")}
                placeholder="Write something about yourself..."
                maxLength={200}
              />
              <p className="text-xs text-gray-500 text-right mt-1">
                {form.aboutme.length}/200 Characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Submit
              </Button>
              <Button type="reset" variant="outline">
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
