-- Load pgTAP for unit testing
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Start a transaction to ensure changes are rolled back
BEGIN;

-- Plan to run 1 test
SELECT plan(1);  

-- ✅ Test 1: Insert a User into auth.users
INSERT INTO auth.users (id, email)
VALUES (gen_random_uuid(), 'testuser@example.com');

-- Check that the user was inserted
SELECT results_eq(
    'SELECT COUNT(*)::integer FROM auth.users WHERE email = ''testuser@example.com''',
    ARRAY[1], 
    'User should be inserted successfully.'
);

-- Finish the test
SELECT * FROM finish();

-- Rollback the transaction to undo all changes made during the test
ROLLBACK;
