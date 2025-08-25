/**
 * Simplified Authentication Configuration
 * Uses Microsoft SSO with persistent sessions
 */

import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email offline_access Files.ReadWrite.All',
          prompt: 'select_account', // Only prompt once
        },
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    
    async session({ session, token }: any) {
      // Send properties to the client
      (session as any).accessToken = token.accessToken as string;
      (session as any).refreshToken = token.refreshToken as string;
      return session;
    },
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Helper to check if user is authenticated with Microsoft
 */
export async function getMicrosoftToken(session: any): Promise<string | null> {
  if (!session?.accessToken) return null;
  
  // Check if token is expired
  const now = Date.now() / 1000;
  if (session.expiresAt && session.expiresAt < now) {
    // Token expired, would need refresh logic here
    // For now, return null to trigger re-auth
    return null;
  }
  
  return session.accessToken;
}

/**
 * Use existing Microsoft session for OneDrive
 * This allows us to use the user's existing Microsoft auth
 */
export function useExistingMicrosoftAuth(): boolean {
  // Check if user is already signed into Microsoft in their browser
  // This is a simplified approach - in production you'd want more robust checking
  return typeof window !== 'undefined' && 
         (document.cookie.includes('ms_auth') || 
          window.location.hostname.includes('microsoft') ||
          window.location.hostname.includes('office'));
}