# 🚀 First-Time Deployment Checklist
## Supabase Pro + Vercel Pro + Real OneDrive Data

### **🎯 OVERVIEW**
This is your complete step-by-step guide for deploying the AsymmFlow ERP/CRM system with real OneDrive data integration. Perfect for first-time deployment!

---

## ✅ **PRE-DEPLOYMENT SETUP**

### **Phase 1: Supabase Pro Setup** 🗄️

#### **1.1 Create Supabase Project**
- [ ] Go to https://supabase.com and create new project
- [ ] Choose **Pro Plan** for production features
- [ ] Note down:
  - Project URL: `https://[project-id].supabase.co`
  - Service Key (service_role): `eyJ...` (for data seeding)
  - Anon Key (anon): `eyJ...` (for client connections)

#### **1.2 Run Database Migrations**
```bash
# In Supabase SQL Editor, run these files in order:
1. supabase/migrations/001_initial_schema.sql
2. supabase/migrations/002_rls_policies.sql
```

#### **1.3 Configure Authentication**
- [ ] Go to Authentication > Settings
- [ ] Enable Email auth provider
- [ ] Set Site URL to your Vercel domain: `https://your-app.vercel.app`
- [ ] Add Redirect URLs: `https://your-app.vercel.app/**`

### **Phase 2: Azure App Registration** ☁️

#### **2.1 Create App Registration**
- [ ] Go to https://portal.azure.com
- [ ] Navigate to Azure Active Directory > App registrations
- [ ] Click "New registration"
  - Name: `PH Trading ERP OneDrive Integration`
  - Account types: `Accounts in this organizational directory only`
  - Redirect URI: `https://your-app.vercel.app/api/onedrive-proxy`

#### **2.2 Configure API Permissions**
- [ ] Go to API permissions > Add permission > Microsoft Graph
- [ ] Select **Application permissions** (not Delegated)
- [ ] Add these permissions:
  - ✅ `Files.Read.All`
  - ✅ `Files.ReadWrite.All`
  - ✅ `Sites.Read.All`
  - ✅ `Sites.ReadWrite.All`
  - ✅ `User.Read.All`

#### **2.3 Grant Admin Consent**
- [ ] Click "Grant admin consent for [Organization]"
- [ ] Verify all permissions show green checkmarks

#### **2.4 Create Client Secret**
- [ ] Go to Certificates & secrets > New client secret
- [ ] Description: `PH Trading ERP Production`
- [ ] Expires: `24 months`
- [ ] **COPY THE SECRET VALUE** - you won't see it again!

### **Phase 3: Vercel Pro Setup** ⚡

#### **3.1 Connect Repository**
- [ ] Go to https://vercel.com and import your GitHub repository
- [ ] Choose **Pro Plan** for production features
- [ ] Set Framework Preset: `Next.js`
- [ ] Root Directory: `./` (keep default)

#### **3.2 Configure Environment Variables**
In Vercel Dashboard > Your Project > Settings > Environment Variables:

```env
# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJ... (your anon key)
SUPABASE_SERVICE_KEY=eyJ... (your service role key)

# Authentication
JWT_SECRET=your-super-secure-production-jwt-secret-32-chars-minimum
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://your-app.vercel.app

# Microsoft Graph (from Azure)
MICROSOFT_CLIENT_ID=your-azure-client-id
MICROSOFT_CLIENT_SECRET=your-azure-client-secret
MICROSOFT_TENANT_ID=common

# Production
NODE_ENV=production
```

#### **3.3 Deploy**
- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for build to complete
- [ ] Note your Vercel domain: `https://your-app.vercel.app`

---

## 🌱 **DATA SEEDING**

### **Phase 4: Real OneDrive Data Import** 📊

#### **4.1 Analyze Their OneDrive Structure**
First, explore their OneDrive to understand the folder structure:

- [ ] Log into their OneDrive with provided credentials
- [ ] Document folder structure (screenshot/notes):
  ```
  Example structure to look for:
  ├── Customers/
  ├── Quotations/
  ├── Orders/
  ├── Suppliers/
  ├── RFQs/
  └── Archive/
  ```

#### **4.2 Prepare Seeding Environment**
```bash
# Install dependencies for seeding script
npm install @supabase/supabase-js @microsoft/microsoft-graph-client xlsx

# Set environment variables for seeding
export SUPABASE_URL="https://[project-id].supabase.co"
export SUPABASE_SERVICE_KEY="eyJ..." # Service role key
export MICROSOFT_CLIENT_ID="your-client-id"
export MICROSOFT_CLIENT_SECRET="your-client-secret"
export MICROSOFT_TENANT_ID="common"
```

#### **4.3 Run Data Seeding Script**
```bash
# Run the production data seeding
npx ts-node scripts/seed-production-data.ts

# Expected output:
# 🏢 Seeding customers from OneDrive...
# ✅ Successfully seeded 15 customers!
# 📋 Seeding quotations from OneDrive...
# ✅ Successfully seeded 42 quotations!
# 🎉 Production data seeding completed!
```

#### **4.4 Verify Seeded Data**
- [ ] Log into Supabase dashboard
- [ ] Go to Table Editor
- [ ] Verify data in:
  - [ ] `customers` table - should show real customer names
  - [ ] `quotations` table - should show real quotation numbers
  - [ ] `rfqs` table - should show real RFQ data

---

## 🧪 **TESTING**

### **Phase 5: Complete System Testing** ✅

#### **5.1 Authentication Testing**
- [ ] Visit `https://your-app.vercel.app/login`
- [ ] Test login with: `admin@phtrading.com` / `admin123`
- [ ] Verify JWT token includes cloud access capabilities
- [ ] Check `/api/health` endpoint shows all green

#### **5.2 OneDrive Integration Testing**
- [ ] Visit `https://your-app.vercel.app/onedrive-demo`
- [ ] Test each user role:
  - [ ] **Admin**: Should see all folders, 1TB quota
  - [ ] **Manager**: Should see team folders, 100GB quota  
  - [ ] **Accounts**: Should see finance folders only, 50GB quota
  - [ ] **Regular**: Should see public folders only, 10GB quota

#### **5.3 Real Data Testing**
- [ ] Navigate to actual business pages
- [ ] Verify real customer names appear
- [ ] Check quotation numbers match their system
- [ ] Test file operations (download, share)

#### **5.4 Performance Testing**
- [ ] Check page load times < 2 seconds
- [ ] Test with multiple users simultaneously  
- [ ] Verify OneDrive API responses < 5 seconds
- [ ] Check database connection pool handling

---

## 🎯 **PRODUCTION READINESS**

### **Phase 6: Final Configuration** 🔧

#### **6.1 Security Hardening**
- [ ] Verify all environment variables use production values
- [ ] Check JWT_SECRET is properly randomized (not default)
- [ ] Ensure HTTPS is enforced (Vercel handles this)
- [ ] Test rate limiting on authentication endpoints

#### **6.2 Monitoring Setup**
- [ ] Configure Vercel analytics
- [ ] Set up Supabase logging
- [ ] Test health check endpoint
- [ ] Create alerts for system failures

#### **6.3 Backup Strategy**
- [ ] Enable Supabase daily backups
- [ ] Document OneDrive folder access credentials
- [ ] Create rollback procedure documentation
- [ ] Test database restore process

---

## 👥 **USER ONBOARDING**

### **Phase 7: SPOC Demo & Training** 🎓

#### **7.1 SPOC Demo Session**
- [ ] Schedule demo with SPOC
- [ ] Show real customer data in system
- [ ] Demonstrate OneDrive file access
- [ ] Walk through role-based permissions
- [ ] Get feedback and approval

#### **7.2 User Account Creation**
```sql
-- Create real user accounts in Supabase
-- Replace with actual employee details

-- Manager account
INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
VALUES (
    'manager@phtrading.com',
    crypt('secure_password_123', gen_salt('bf')),
    '{"role": "manager", "full_name": "Sales Manager Name"}'
);

-- Accounts account  
INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
VALUES (
    'accounts@phtrading.com', 
    crypt('secure_password_123', gen_salt('bf')),
    '{"role": "accounts", "full_name": "Finance Officer Name"}'
);

-- Regular user accounts
INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
VALUES (
    'sales1@phtrading.com',
    crypt('secure_password_123', gen_salt('bf')),
    '{"role": "regular", "full_name": "Sales Executive 1"}'
);
```

#### **7.3 Training Materials**
- [ ] Create user manual with screenshots
- [ ] Record demo videos for each role
- [ ] Prepare FAQ document
- [ ] Set up support channel

---

## 📊 **SUCCESS METRICS**

### **Key Performance Indicators** 📈

#### **Technical Success:**
- [ ] System uptime > 99.9%
- [ ] Page load times < 2 seconds
- [ ] OneDrive API success rate > 99%
- [ ] Zero data loss during migration
- [ ] All user roles working correctly

#### **Business Success:**
- [ ] SPOC approval and sign-off
- [ ] Users can access their familiar data immediately
- [ ] OneDrive files load without Microsoft auth screens
- [ ] Real customers and quotations visible
- [ ] Business workflow feels natural

#### **User Adoption:**
- [ ] > 80% of users successfully log in on first attempt
- [ ] > 90% of users can access their files without help
- [ ] < 5% support tickets in first week
- [ ] Positive feedback from SPOC
- [ ] Request for additional features/roles

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions** 🔧

#### **"Microsoft Graph auth failed"**
- Check MICROSOFT_CLIENT_SECRET is correct
- Verify admin consent was granted
- Check tenant ID is correct

#### **"No customer data showing"**
- Verify seeding script completed successfully
- Check Supabase RLS policies allow access
- Confirm user role in JWT token

#### **"OneDrive files not loading"**
- Check Azure app permissions are granted
- Verify folder paths in cloud access matrix
- Test Microsoft Graph API connectivity

#### **"Database connection failed"**
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Confirm connection string format

---

## 🎉 **GO-LIVE CHECKLIST**

### **Final Pre-Launch Steps** ✅

- [ ] All tests passing
- [ ] SPOC approval received
- [ ] Real user accounts created
- [ ] Backup taken
- [ ] Monitoring active
- [ ] Support documentation ready
- [ ] Emergency contacts defined
- [ ] Rollback plan tested

### **Launch Day** 🚀

- [ ] Final data sync from OneDrive
- [ ] Send user credentials to team
- [ ] Monitor system for first 4 hours
- [ ] Be available for immediate support
- [ ] Collect initial user feedback
- [ ] Document any issues for improvement

### **Post-Launch (First Week)** 📈

- [ ] Daily system health checks
- [ ] User feedback collection
- [ ] Performance optimization based on usage
- [ ] Additional training if needed
- [ ] Plan phase 2 features

---

## 🎯 **YOU'VE GOT THIS!**

This comprehensive checklist ensures your first deployment will be:
- ✅ **Technically solid** - All systems properly configured
- ✅ **Business ready** - Real data from day one
- ✅ **User friendly** - Seamless OneDrive integration
- ✅ **Production grade** - Monitoring, security, and backups

**Remember**: Take it step by step, test each phase thoroughly, and don't hesitate to reach out if you need clarification on any step!

**🚀 Ready to deploy and make the SPOC incredibly happy!** ✨