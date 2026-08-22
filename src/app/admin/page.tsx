import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/session";
import AdminPanel from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAdminSession();
  return (
    <main className="wrap" style={{ padding: "40px 20px 60px" }}>
      <AdminPanel initialAuthenticated={authenticated} />
    </main>
  );
}
