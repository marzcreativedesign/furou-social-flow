import { Separator } from "@/components/ui/separator";
import NavigationMenu from "./NavigationMenu";
import UserProfileSection from "./UserProfileSection";
import SidebarActions from "./sidebar/SidebarActions";

interface DesktopSidebarProps {
  userProfile: {
    name: string;
    email: string;
    avatarUrl: string;
    initials: string;
  };
  darkMode: boolean;
  toggleDarkMode: () => void;
  isActive: (path: string) => boolean;
}

const DesktopSidebar = ({ 
  userProfile, 
  darkMode, 
  toggleDarkMode, 
  isActive 
}: DesktopSidebarProps) => {
  // Placeholder logout (adjust if you use a context/provider for logout)
  const handleLogout = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="hidden lg:block lg:w-64 p-4 border-r border-border dark:border-gray-800 min-h-[calc(100vh-64px)] fixed">
      <div className="sticky top-20 space-y-4 flex flex-col h-[calc(100vh-100px)]">
        <UserProfileSection {...userProfile} />
        <Separator className="my-2" />
        <NavigationMenu isActive={isActive} />
        <SidebarActions
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default DesktopSidebar;
