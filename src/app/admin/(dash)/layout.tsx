import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getEnquiries, getTestimonials } from "@/lib/data";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const [enquiries, reviews] = await Promise.all([getEnquiries(), getTestimonials()]);
  const unread = enquiries.filter((e) => !e.read && !e.archived).length;
  const pendingReviews = reviews.filter((t) => !t.approved).length;
  return (
    <div className="min-h-[100svh] bg-surface">
      <AdminNav unread={unread} pendingReviews={pendingReviews} />
      <main id="main" className="mx-auto max-w-container px-4 pb-24 pt-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
