-- 0. ነባሩን ስኪማ ከነሙሉ ጥገኝቶቹ ሙሉ በሙሉ ማጥፋት (Clean Reset)
DROP SCHEMA IF EXISTS app CASCADE;

-- 1. ስኪማውን መፍጠር
CREATE SCHEMA app;

-- ሰኪማውን ነባሪ ማድረግ
SET search_path TO app, public;

-- 2. የ roles ሰንጠረዥ
CREATE TABLE app.roles (
    role_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- የመጀመሪያዎቹ ሮሎች መረጃ ማስገባት
INSERT INTO app.roles (name, description) VALUES
('Admin', 'System Administrator'),
('Farmer', 'Agricultural Producer'),
('Buyer', 'Produce Buyer or Trader'),
('Transporter', 'Logistics and Transportation Provider')
ON CONFLICT (name) DO NOTHING;

-- 3. የ users ሰንጠረዥ (በትክክለኛው ቅደም ተከተል: user_id -> full_name -> phone_number -> email)
CREATE TABLE app.users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash TEXT NOT NULL,
    role_id BIGINT REFERENCES app.roles(role_id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. የ product_categories ሰንጠረዥ
CREATE TABLE app.product_categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 5. የ products ሰንጠረዥ
CREATE TABLE app.products (
    product_id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES app.product_categories(category_id) ON DELETE CASCADE,
    farmer_id BIGINT,
    name VARCHAR(150) NOT NULL,
    unit VARCHAR(50),
    price_per_unit NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. የ farmers_profile ሰንጠረዥ
CREATE TABLE app.farmers_profile (
    farmer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES app.users(user_id) ON DELETE CASCADE,
    farm_location TEXT,
    farm_size NUMERIC(10, 2)
);

-- 7. የ buyers_profile ሰንጠረዥ
CREATE TABLE app.buyers_profile (
    buyer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES app.users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(150),
    business_address TEXT
);

-- 8. የ transporters_profile ሰንጠረዥ
CREATE TABLE app.transporters_profile (
    transporter_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES app.users(user_id) ON DELETE CASCADE,
    vehicle_type VARCHAR(100),
    license_plate VARCHAR(50)
);

-- 9. የ regions_and_markets ሰንጠረዥ
CREATE TABLE app.regions_and_markets (
    market_id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(100),
    market_name VARCHAR(100)
);

-- 10. የ market_prices ሰንጠረዥ
CREATE TABLE app.market_prices (
    price_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES app.products(product_id) ON DELETE CASCADE,
    market_id BIGINT REFERENCES app.regions_and_markets(market_id) ON DELETE CASCADE,
    current_price NUMERIC(10, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. የ supply_orders ሰንጠረዥ
CREATE TABLE app.supply_orders (
    order_id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT REFERENCES app.buyers_profile(buyer_id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES app.products(product_id) ON DELETE CASCADE,
    quantity NUMERIC(10, 2),
    total_price NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. የ order_status_history ሰንጠረዥ
CREATE TABLE app.order_status_history (
    history_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES app.supply_orders(order_id) ON DELETE CASCADE,
    status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. የ order_tracking_logs ሰንጠረዥ
CREATE TABLE app.order_tracking_logs (
    log_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES app.supply_orders(order_id) ON DELETE CASCADE,
    location_details TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. የ outbox_notifications ሰንጠረዥ
CREATE TABLE app.outbox_notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    recipient_phone VARCHAR(20),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Unsent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. የ ussd_sessions_log ሰንጠረዥ
CREATE TABLE app.ussd_sessions_log (
    session_id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20),
    session_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. የ spatial_layers ሰንጠረዥ (PostGIS የጂኦግራፊ መረጃዎችን ለመያዝ)
CREATE TABLE app.spatial_layers (
    layer_id BIGSERIAL PRIMARY KEY,
    layer_name VARCHAR(100) NOT NULL,
    description TEXT,
    geom_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);