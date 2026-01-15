import React from 'react';
import type { Session } from '@supabase/supabase-js';
interface AuthContextType {
    session: Session | null;
    loading: boolean;
}
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
