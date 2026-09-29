import { useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { NotificationsManager } from "./components/notifications/NotificationsManager";
import { TasksManager } from "./components/tasks/TasksManager";
import { UsersManager } from "./components/users/UsersManager";
import { NavigationTab } from "./types/common.types";

/**
 * Root application component managing active navigation tabs and routing between domain modules.
 *
 * @returns The rendered TaskFlow UI application structure.
 */
export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("users");
  const [notificationUserId, setNotificationUserId] = useState<string>("");

  const handleNavigateToNotifications = (userId: string) => {
    setNotificationUserId(userId);
    setActiveTab("notifications");
  };

  return (
    <MainLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === "users" ? (
        <UsersManager onNavigateToNotifications={handleNavigateToNotifications} />
      ) : null}
      {activeTab === "tasks" ? <TasksManager /> : null}
      {activeTab === "notifications" ? (
        <NotificationsManager initialUserId={notificationUserId} />
      ) : null}
    </MainLayout>
  );
}

export default App;
