import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PermissionsGroup = ({ values, permissionKey, setFieldValue }) => {
  const isEnabled = values.permissions[permissionKey];
  const actions = values.permissions[`${permissionKey}Actions`] || {};

  const allChecked = Object.values(actions).every(Boolean);

  const handleAllPermissionToggle = () => {
    const newState = !allChecked;
    const updatedActions = {};
    Object.keys(actions).forEach((action) => {
      updatedActions[action] = newState;
    });
    setFieldValue(`permissions.${permissionKey}Actions`, updatedActions);
  };

  const toggleGroup = (value, permissionKey, setFieldValue, actions) => {
    setFieldValue(`permissions.${permissionKey}`, value);

    if (!value) {
      setFieldValue(
        `permissions.${permissionKey}Actions`,
        Object.keys(actions).reduce((acc, curr) => {
          acc[curr] = false;
          return acc;
        }, {})
      );
    }
  };

  return (
    <div className=" bg-white dark:bg-white/5 rounded-lg shadow-xs dark:shadow-xl border capitalize">
      <div className="flex items-center justify-between bg-black/[2%] p-2 [--primary:var(--color-blue-800)] [--ring:var(--color-blue-300)] in-[.dark]:[--primary:var(--color-blue-800)] in-[.dark]:[--ring:var(--color-blue-900)] dark:bg-white/5 px-3">
        <Label
          htmlFor={permissionKey}
          className="flex-grow text-sm font-semibold uppercase"
        >
          {permissionKey.replace(/_/g, " ")}
        </Label>

        <Switch
          id={permissionKey}
          checked={isEnabled}
          onCheckedChange={(value) =>
            toggleGroup(value, permissionKey, setFieldValue, actions)
          }
        />
      </div>

      {isEnabled && (
        <PermissionActions
          allChecked={allChecked}
          permissionKey={permissionKey}
          actions={actions}
          handleAllPermissionToggle={handleAllPermissionToggle}
          setFieldValue={setFieldValue}
        />
      )}
    </div>
  );
};

export default PermissionsGroup;

const PermissionActions = ({
  allChecked,
  permissionKey,
  actions,
  handleAllPermissionToggle,
  setFieldValue,
}) => {
  return (
    <div className="border-t p-2.5">
      {/* All Permissions */}
      <div className="border-primary/50 flex w-full justify-between rounded-md border px-2 py-1.5 shadow-xs">
        <Label htmlFor={`${permissionKey}-all`} className="flex-grow">
          All Permissions
        </Label>
        <Switch
          id={`${permissionKey}-all`}
          checked={allChecked}
          onCheckedChange={handleAllPermissionToggle}
        />
      </div>

      {/* Individual Permissions */}
      <div className="mt-2 grid grid-cols-2 gap-1">
        {Object.keys(actions).map((action) => (
          <div
            key={action}
            className="flex w-full items-center justify-between rounded-md border px-2 py-1.5 shadow-xs"
          >
            <Label htmlFor={`${permissionKey}-${action}`} className="flex-grow">
              {action.replace(/_/g, " ")}
            </Label>
            <Switch
              className="scale-90"
              id={`${permissionKey}-${action}`}
              checked={actions[action]}
              onCheckedChange={(value) =>
                setFieldValue(
                  `permissions.${permissionKey}Actions.${action}`,
                  value
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
