-- Insert sample members
INSERT INTO members (name, age, gender, email, phone, role, address) VALUES
('John Smith', 35, 'Male', 'john.smith@email.com', '123-456-7890', 'Pastor', '123 Church St, City, State'),
('Sarah Johnson', 28, 'Female', 'sarah.johnson@email.com', '123-456-7891', 'Youth Leader', '456 Oak Ave, City, State'),
('Michael Chen', 42, 'Male', 'michael.chen@email.com', '123-456-7892', 'Member', '789 Pine Rd, City, State'),
('Emily Davis', 31, 'Female', 'emily.davis@email.com', '123-456-7893', 'Elder', '321 Elm St, City, State'),
('David Wilson', 45, 'Male', 'david.wilson@email.com', '123-456-7894', 'Member', '654 Maple Dr, City, State')
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, event_type, created_by) VALUES
('Sunday Worship Service', 'Weekly worship service with communion', CURRENT_DATE + INTERVAL '7 days', '10:00:00', 'Main Sanctuary', 'Service', 1),
('Youth Fellowship', 'Youth group meeting and activities', CURRENT_DATE + INTERVAL '5 days', '19:00:00', 'Youth Hall', 'Event', 1),
('Bible Study', 'Weekly Bible study session', CURRENT_DATE + INTERVAL '3 days', '19:30:00', 'Fellowship Hall', 'Study', 1),
('Prayer Meeting', 'Community prayer and intercession', CURRENT_DATE + INTERVAL '2 days', '18:30:00', 'Prayer Room', 'Meeting', 1)
ON CONFLICT DO NOTHING;

-- Insert sample registration requests
INSERT INTO registration_requests (name, email, phone, age, gender, address, ministry_interest, hear_about, status) VALUES
('Alice Brown', 'alice.brown@email.com', '123-456-7895', 29, 'Female', '987 Cedar Ln, City, State', 'Music Ministry', 'Friend', 'pending'),
('Robert Taylor', 'robert.taylor@email.com', '123-456-7896', 38, 'Male', '147 Birch Ave, City, State', 'Outreach Ministry', 'Website', 'approved'),
('Lisa Anderson', 'lisa.anderson@email.com', '123-456-7897', 33, 'Female', '258 Spruce St, City, State', 'Children Ministry', 'Social Media', 'contacted')
ON CONFLICT DO NOTHING;
