import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { Enquiry } from "@/models/Enquiry";

/** Every page under this layout requires a valid database-backed session. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  await connectDb();
  const newCount = await Enquiry.countDocuments({ status: "new" });
  return (
    <AdminShell name={admin.name} newCount={newCount}>
      {children}
    </AdminShell>
  );
}
