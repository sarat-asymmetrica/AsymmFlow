// Simple gatekeeper page - minimal approach
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/api/auth/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">PrismFlow</h1>
          <p className="text-gray-600 mb-6">Enterprise ERP/CRM Platform</p>
          
          <Button 
            onClick={handleSignIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            Sign in with Microsoft
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            🔐 Secured by Microsoft Azure AD
          </p>
        </div>
      </div>
    </div>
  );
}
