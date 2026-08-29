import React, { createContext, useContext, useState, useCallback } from 'react';
import { emptyPrivateProfile } from '../eligibility/codes';

const PrivateEligibilityContext = createContext(null);

/**
 * Ephemeral private eligibility state — browser memory only.
 * Not persisted to MongoDB, localStorage, or backend APIs.
 */
export function PrivateEligibilityProvider({ children }) {
  const [profile, setProfile] = useState(emptyPrivateProfile);
  const [isConfigured, setIsConfigured] = useState(false);

  const updateProfile = useCallback((partial) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    setIsConfigured(true);
  }, []);

  const replaceProfile = useCallback((next) => {
    setProfile({ ...emptyPrivateProfile(), ...next });
    setIsConfigured(true);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(emptyPrivateProfile());
    setIsConfigured(false);
  }, []);

  const value = {
    profile,
    isConfigured,
    updateProfile,
    replaceProfile,
    clearProfile,
  };

  return (
    <PrivateEligibilityContext.Provider value={value}>
      {children}
    </PrivateEligibilityContext.Provider>
  );
}

export function usePrivateEligibility() {
  const ctx = useContext(PrivateEligibilityContext);
  if (!ctx) {
    throw new Error(
      'usePrivateEligibility must be used within PrivateEligibilityProvider'
    );
  }
  return ctx;
}
