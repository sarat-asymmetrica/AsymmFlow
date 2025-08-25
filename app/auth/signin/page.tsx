// ⛳ code-map: auth-signin (docs/code-map/auth.md#auth-signin)
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [gateway]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [mature]
// 🔐 authentication: Microsoft Azure AD sign-in page
// last-sweep: Authentication-Integration-Sprint-001

'use client';

import * as NextAuthReact from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MicrosoftIcon } from '@/components/icons/microsoft';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await (NextAuthReact as any).getProviders();
        setProviders(res);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to PrismFlow ERP
          </CardTitle>
          <CardDescription className="text-center">
            Access your enterprise management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: any) => (
                <div key={provider.name}>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => (NextAuthReact as any).signIn(provider.id, { callbackUrl: '/dashboard' })}
                  >
                    <MicrosoftIcon className="mr-2 h-4 w-4" />
                    Sign in with {provider.name}
                  </Button>
                </div>
              ))}
            
            {!providers && (
              <div className="text-center text-sm text-gray-500">
                Authentication providers not configured
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
