-- Row Level Security Policies for Role-Based Access
-- Matches the JWT role-based permission system

-- Helper function to get user role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        auth.jwt() ->> 'role',
        auth.jwt() ->> 'user_metadata' ->> 'role',
        'regular'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user ID from JWT
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        auth.jwt() ->> 'userId',
        auth.jwt() ->> 'sub',
        auth.uid()::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CUSTOMERS RLS Policies
CREATE POLICY "Admin can access all customers" ON customers
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Manager can access all customers" ON customers
    FOR SELECT USING (get_user_role() = 'manager');

CREATE POLICY "Accounts can view customers for financial operations" ON customers
    FOR SELECT USING (get_user_role() = 'accounts');

CREATE POLICY "Regular users can view customers they work with" ON customers
    FOR SELECT USING (
        get_user_role() = 'regular' AND 
        id IN (
            SELECT DISTINCT customer_id FROM rfqs 
            WHERE assigned_to = get_user_id()
            UNION
            SELECT DISTINCT customer_id FROM quotations 
            WHERE created_by = get_user_id()
        )
    );

-- RFQs RLS Policies
CREATE POLICY "Admin can access all RFQs" ON rfqs
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Manager can access all RFQs" ON rfqs
    FOR ALL USING (get_user_role() = 'manager');

CREATE POLICY "Regular users can access their assigned RFQs" ON rfqs
    FOR ALL USING (
        get_user_role() = 'regular' AND 
        assigned_to = get_user_id()
    );

CREATE POLICY "Accounts can view completed RFQs for financial tracking" ON rfqs
    FOR SELECT USING (
        get_user_role() = 'accounts' AND 
        status IN ('completed', 'cancelled')
    );

-- QUOTATIONS RLS Policies
CREATE POLICY "Admin can access all quotations" ON quotations
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Manager can access all quotations" ON quotations
    FOR ALL USING (get_user_role() = 'manager');

CREATE POLICY "Regular users can access their quotations" ON quotations
    FOR ALL USING (
        get_user_role() = 'regular' AND 
        created_by = get_user_id()
    );

CREATE POLICY "Accounts can view all quotations for financial operations" ON quotations
    FOR SELECT USING (get_user_role() = 'accounts');

CREATE POLICY "Accounts can update payment-related fields in quotations" ON quotations
    FOR UPDATE USING (
        get_user_role() = 'accounts'
    ) WITH CHECK (
        get_user_role() = 'accounts'
    );

-- ORDERS RLS Policies
CREATE POLICY "Admin can access all orders" ON orders
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Manager can access all orders" ON orders
    FOR ALL USING (get_user_role() = 'manager');

CREATE POLICY "Accounts can access all orders for financial operations" ON orders
    FOR ALL USING (get_user_role() = 'accounts');

CREATE POLICY "Regular users can view their orders" ON orders
    FOR SELECT USING (
        get_user_role() = 'regular' AND 
        created_by = get_user_id()
    );

-- SUPPLIERS RLS Policies
CREATE POLICY "Admin can access all suppliers" ON suppliers
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Manager can access all suppliers" ON suppliers
    FOR ALL USING (get_user_role() = 'manager');

CREATE POLICY "Accounts can view suppliers for payment operations" ON suppliers
    FOR SELECT USING (get_user_role() = 'accounts');

CREATE POLICY "Regular users can view active suppliers" ON suppliers
    FOR SELECT USING (
        get_user_role() = 'regular' AND 
        status = 'active'
    );

-- USER PROFILES RLS Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admin can access all user profiles" ON user_profiles
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Manager can view team member profiles" ON user_profiles
    FOR SELECT USING (
        get_user_role() = 'manager' AND 
        role IN ('regular')
    );

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        COALESCE(new.raw_user_meta_data->>'role', 'regular')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function for seeding test users with roles
CREATE OR REPLACE FUNCTION create_test_users()
RETURNS void AS $$
DECLARE
    admin_user_id UUID;
    manager_user_id UUID;
    accounts_user_id UUID;
    regular_user_id UUID;
BEGIN
    -- Create admin user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@phtrading.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        NOW(),
        '',
        NOW(),
        '',
        NOW(),
        '',
        '',
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"role": "admin", "full_name": "PH Trading Admin"}',
        false,
        NOW(),
        NOW(),
        null,
        null,
        '',
        '',
        NOW(),
        0,
        null,
        '',
        NOW()
    ) RETURNING id INTO admin_user_id;

    -- Insert corresponding user profile will be handled by trigger
    
    RAISE NOTICE 'Test users created successfully';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION get_user_role() IS 'Extract user role from JWT token for RLS policies';
COMMENT ON FUNCTION get_user_id() IS 'Extract user ID from JWT token for RLS policies';
COMMENT ON FUNCTION handle_new_user() IS 'Creates user profile when new auth user is created';