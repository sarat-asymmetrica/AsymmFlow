// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
export const COMPANY_NAME = 'PH Trading WLL';

export const MSGRAPH_CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || 'a2bcca38-add8-41a5-b16f-af153f2bf3c1';
export const MSGRAPH_TENANT_ID = process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || '5cc61fe4-4619-4785-a3bd-ac302b96741f';
export const MSGRAPH_REDIRECT_URI = process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI || 'http://localhost:3002/auth/callback';
export const MSGRAPH_SCOPES = 'openid profile offline_access User.Read Files.Read.All Files.ReadWrite.All';

// --- Tally API Configuration (Conceptual/Mock) ---
export const TALLY_API_BASE_URL = process.env.NEXT_PUBLIC_TALLY_API_BASE_URL || 'https://mock-tally-api.vataro.ai/api'; // Example mock base URL
export const TALLY_API_KEY = process.env.NEXT_PUBLIC_TALLY_API_KEY || 'YOUR_MOCK_TALLY_API_KEY'; // Example mock API Key
// --- END Tally API Configuration ---
