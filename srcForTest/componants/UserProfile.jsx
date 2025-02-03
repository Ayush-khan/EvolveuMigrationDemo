import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Retrieve combined session data from sessionStorage
    const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));

    if (sessionData) {
      // Update state with retrieved data
      setUser(sessionData.user);
      setSettings(sessionData.settings);
    }
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {user && (
        <div>
          <h3>Name: {user.name}</h3>
          <p>Email: {user.user_id}</p>
          <p>Reg ID: {user.reg_id}</p>
          <p>Role ID: {user.role_id}</p>
        </div>
      )}
      {settings && (
        <div>
          <h3>Settings</h3>
          {settings.map((setting) => (
            <div key={setting.id}>
              <h4>Name: {setting.institute_name}</h4>
              {/* Render other settings data if necessary */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
