-- Seed data for Hotel Booking Management System

USE hotel_booking;

-- Insert admin user (password: admin123)
INSERT INTO users (full_name, email, password, phone, role) VALUES
('Admin User', 'admin@hotel.com', '$2b$10$3kW13AsDN2uC5wmNelVREuUG0iK10zVluz1B8p5SBs1HsOLOracOu', '1234567890', 'admin');

-- Insert sample customers (password: customer123)
INSERT INTO users (full_name, email, password, phone, role) VALUES
('John Doe', 'john@example.com', '$2b$10$GADnQPJyWaOpld2C8n1IwecQnbSZl3fHcB08uo4GK5Zlsdcr6yTNW', '1234567891', 'customer'),
('Jane Smith', 'jane@example.com', '$2b$10$GADnQPJyWaOpld2C8n1IwecQnbSZl3fHcB08uo4GK5Zlsdcr6yTNW', '1234567892', 'customer');

-- Insert sample rooms
INSERT INTO rooms (title, room_type, description, capacity, price_per_night, features, status) VALUES
('Deluxe Suite', 'deluxe', 'Spacious suite with king-size bed, living area, and city view. Perfect for couples or business travelers.', 2, 150.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true}', 'available'),
('Standard Double', 'standard', 'Comfortable double room with modern amenities. Ideal for solo travelers or couples.', 2, 80.00, '{"wifi": true, "tv": true, "ac": true, "minibar": false, "balcony": false}', 'available'),
('Family Room', 'family', 'Large family room with two queen beds. Perfect for families with children.', 4, 200.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "sofa": true}', 'available'),
('Executive Suite', 'executive', 'Luxurious suite with separate bedroom and living area. Premium amenities included.', 2, 300.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "jacuzzi": true, "room_service": true}', 'available'),
('Economy Single', 'economy', 'Affordable single room with essential amenities. Great for budget travelers.', 1, 50.00, '{"wifi": true, "tv": true, "ac": true, "minibar": false, "balcony": false}', 'available'),
('Penthouse Suite', 'penthouse', 'Ultimate luxury with panoramic views, private terrace, and premium services.', 4, 500.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "jacuzzi": true, "room_service": true, "concierge": true, "private_elevator": true}', 'available'),
('Ocean View Deluxe', 'deluxe', 'Beautiful deluxe room with stunning ocean views and private balcony. Perfect for a romantic getaway.', 2, 180.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "ocean_view": true}', 'available'),
('Business Class', 'standard', 'Modern room designed for business travelers with work desk and high-speed internet.', 2, 120.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": false, "work_desk": true, "printer": true}', 'available'),
('Junior Suite', 'suite', 'Elegant junior suite with separate living area and premium furnishings.', 2, 220.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "sofa": true, "dining_area": true}', 'available'),
('Twin Room', 'standard', 'Comfortable room with two single beds. Ideal for friends or colleagues traveling together.', 2, 90.00, '{"wifi": true, "tv": true, "ac": true, "minibar": false, "balcony": false}', 'available'),
('Presidential Suite', 'suite', 'The most luxurious accommodation with multiple bedrooms, private dining, and butler service.', 6, 800.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "jacuzzi": true, "room_service": true, "concierge": true, "butler": true, "private_dining": true, "gym": true}', 'available'),
('Honeymoon Suite', 'suite', 'Romantic suite with king bed, champagne service, and special romantic amenities.', 2, 350.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "jacuzzi": true, "room_service": true, "romantic_decor": true}', 'available'),
('Accessible Room', 'standard', 'Fully accessible room designed for guests with mobility needs. Spacious and well-equipped.', 2, 100.00, '{"wifi": true, "tv": true, "ac": true, "minibar": false, "balcony": false, "accessible": true, "roll_in_shower": true}', 'available'),
('Garden View Room', 'standard', 'Peaceful room overlooking the hotel gardens. Quiet and relaxing atmosphere.', 2, 95.00, '{"wifi": true, "tv": true, "ac": true, "minibar": false, "balcony": true, "garden_view": true}', 'available'),
('Triple Room', 'standard', 'Spacious room with three single beds. Perfect for groups of three travelers.', 3, 130.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": false}', 'available'),
('Studio Apartment', 'suite', 'Self-contained studio with kitchenette and living area. Extended stay friendly.', 2, 160.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "kitchenette": true, "microwave": true, "refrigerator": true}', 'available'),
('Corner Suite', 'suite', 'Unique corner suite with extra windows and natural light. Spacious and bright.', 2, 240.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "corner_view": true, "extra_windows": true}', 'available'),
('Pool View Room', 'standard', 'Room with direct view of the hotel pool. Great for families and leisure travelers.', 2, 110.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "pool_view": true}', 'available'),
('City View Double', 'standard', 'Modern double room with panoramic city views. Located on higher floors.', 2, 105.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "city_view": true}', 'available'),
('Luxury Villa', 'penthouse', 'Private villa with own entrance, pool, and garden. Ultimate privacy and luxury.', 4, 600.00, '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true, "jacuzzi": true, "room_service": true, "private_pool": true, "private_garden": true, "kitchen": true}', 'available');

-- Insert room images (using placeholder URLs - replace with actual image URLs)
INSERT INTO room_images (room_id, url) VALUES
(1, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
(1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
(2, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(2, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'),
(3, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
(3, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
(4, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'),
(4, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
(5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),
(6, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(6, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
(6, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
(7, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
(7, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'),
(8, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(8, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'),
(9, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
(9, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
(10, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
(10, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
(11, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'),
(11, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
(11, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
(12, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
(12, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'),
(13, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(13, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'),
(14, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
(14, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
(15, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
(15, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
(16, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'),
(16, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
(17, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
(17, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
(18, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(18, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'),
(19, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
(19, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
(20, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'),
(20, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
(20, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800');

-- Insert sample bookings
INSERT INTO bookings (user_id, room_id, from_date, to_date, guests, total_amount, reference, status) VALUES
(2, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY), 2, 300.00, CONCAT('BK', UNIX_TIMESTAMP(), 'A'), 'confirmed'),
(3, 3, DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 12 DAY), 4, 400.00, CONCAT('BK', UNIX_TIMESTAMP(), 'B'), 'confirmed');

-- Insert sample reviews
INSERT INTO reviews (user_id, room_id, rating, comment) VALUES
(2, 1, 5, 'Excellent room with great amenities. Highly recommended!'),
(3, 3, 4, 'Nice family room, spacious and clean. Would stay again.');

