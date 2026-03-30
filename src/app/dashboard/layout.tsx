import Sidebar from "@/components/dashboard/Sidebar";
import { AccessMessage } from "@/components/auth/AccessMessage";

export default async function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Check if there's an access error message
  const hasError = searchParams?.error;

  // If there's an error, show the access message instead of the dashboard content
  if (hasError) {
    return <AccessMessage />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
