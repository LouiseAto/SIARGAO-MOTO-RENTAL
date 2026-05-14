-- Sample motorbikes data
INSERT INTO motorbikes (brand, model, year, plate_number, color, daily_rate, status, latitude, longitude) VALUES
('Honda', 'Click 150i', 2023, 'ABC-1234', 'Red', 500.00, 'available', 9.8601, 126.0489),
('Yamaha', 'NMAX', 2023, 'XYZ-5678', 'Blue', 600.00, 'available', 9.8615, 126.0502),
('Honda', 'Beat', 2022, 'DEF-9012', 'Black', 400.00, 'available', 9.8590, 126.0475),
('Suzuki', 'Raider 150', 2023, 'GHI-3456', 'White', 550.00, 'available', 9.8620, 126.0510),
('Kawasaki', 'Ninja 400', 2024, 'JKL-7890', 'Green', 1200.00, 'available', 9.8605, 126.0495);

-- Sample customers data
INSERT INTO customers (full_name, email, phone, id_number, address) VALUES
('John Doe', 'john.doe@email.com', '+63-912-345-6789', 'ID-001', 'General Luna, Siargao'),
('Jane Smith', 'jane.smith@email.com', '+63-923-456-7890', 'ID-002', 'Cloud 9, Siargao'),
('Mike Johnson', 'mike.j@email.com', '+63-934-567-8901', 'ID-003', 'Dapa, Siargao');

-- Sample employees data
INSERT INTO employees (full_name, email, phone, role, hire_date, monthly_salary, is_active) VALUES
('Maria Santos', 'maria.santos@siargao-moto.com', '+63-945-678-9012', 'staff', '2024-01-15', 18000.00, true),
('Pedro Cruz', 'pedro.cruz@siargao-moto.com', '+63-956-789-0123', 'mechanic', '2024-02-01', 20000.00, true),
('Ana Reyes', 'ana.reyes@siargao-moto.com', '+63-967-890-1234', 'staff', '2024-03-10', 18000.00, true);
