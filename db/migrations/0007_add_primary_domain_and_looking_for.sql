-- Add primary domain and looking for fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS primary_domain VARCHAR(100),
ADD COLUMN IF NOT EXISTS looking_for JSONB DEFAULT '[]';
