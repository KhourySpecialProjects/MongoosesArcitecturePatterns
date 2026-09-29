import { STRINGS } from "../../constants/strings";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useUserDetail } from "../../hooks/useUserDetail";
import { useUsers } from "../../hooks/useUsers";
import { AlertBanner } from "../common/AlertBanner";
import { SectionHeader } from "../common/SectionHeader";
import { UserDetailCard } from "./UserDetailCard";
import { UserListTable } from "./UserListTable";
import { UserLookupForm } from "./UserLookupForm";
import { UserRegistrationForm } from "./UserRegistrationForm";

/**
 * Props for the UsersManager section component.
 */
export interface UsersManagerProps {
  /** Optional callback fired when the user wants to navigate to notifications for a specific user ID. */
  onNavigateToNotifications?: (userId: string) => void;
}

/**
 * High-level orchestration component for the User Management module.
 *
 * @param props - UsersManagerProps configuration.
 * @returns A rendered layout managing user registration, lookup, and listing.
 */
export function UsersManager({
  onNavigateToNotifications,
}: UsersManagerProps) {
  const usersHook = useUsers();
  const userDetailHook = useUserDetail();

  const createUserHook = useCreateUser({
    onSuccess: async () => {
      await usersHook.refetch();
    },
  });

  return (
    <div>
      <SectionHeader
        title={STRINGS.USERS.SECTION_TITLE}
        subtitle="Create user accounts and explore user directory records"
      />

      {usersHook.error ? (
        <AlertBanner variant="error">{usersHook.error}</AlertBanner>
      ) : null}

      {userDetailHook.error ? (
        <AlertBanner variant="error" onDismiss={userDetailHook.clearUser}>
          {userDetailHook.error}
        </AlertBanner>
      ) : null}

      <div className="grid-two-col">
        <UserRegistrationForm
          name={createUserHook.name}
          email={createUserHook.email}
          isSubmitting={createUserHook.isSubmitting}
          error={createUserHook.error}
          successMessage={createUserHook.successMessage}
          onNameChange={createUserHook.setName}
          onEmailChange={createUserHook.setEmail}
          onSubmit={createUserHook.handleSubmit}
          onReset={createUserHook.resetForm}
        />

        <div>
          <UserLookupForm
            searchId={userDetailHook.searchId}
            isLoading={userDetailHook.isLoading}
            onSearchIdChange={userDetailHook.setSearchId}
            onSubmit={userDetailHook.handleLookup}
          />

          {userDetailHook.user ? (
            <UserDetailCard
              user={userDetailHook.user}
              onClose={userDetailHook.clearUser}
              onViewNotifications={onNavigateToNotifications}
            />
          ) : null}
        </div>
      </div>

      <UserListTable
        users={usersHook.users}
        isLoading={usersHook.isLoading}
        onSelectUser={userDetailHook.loadUserById}
        onViewNotifications={onNavigateToNotifications}
        onRefresh={usersHook.refetch}
      />
    </div>
  );
}
