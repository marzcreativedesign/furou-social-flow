
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";

const AdminPage = () => {
  return (
    <MainLayout title="Admin Dashboard">
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Welcome to the admin dashboard. This page is only accessible to administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Here you can manage your application's settings and users.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
