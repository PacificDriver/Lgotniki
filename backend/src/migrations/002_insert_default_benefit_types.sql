-- Insert default benefit types
INSERT INTO benefit_types (name, description, calculation_type, calculation_params, is_active) VALUES
('Школьник', 'Возраст 7-17 лет', 'discount_percent', '{"discountPercent": 50}', true),
('Студент', 'Возраст 18-23 лет', 'discount_percent', '{"discountPercent": 50}', true),
('Граждане 55+', 'Возраст 55-69 лет', 'discount_percent', '{"discountPercent": 30, "kilometers": 1000}', true),
('Граждане 70+', 'Возраст от 70 лет', 'free', '{}', true),
('Льготная категория', 'Ветераны, инвалиды, многодетные', 'free', '{}', true),
('Служебные', 'Сотрудники транспортных компаний', 'free', '{}', true),
('Больничные', 'По медицинским показаниям', 'discount_percent', '{"discountPercent": 100}', true),
('Соцталоны', 'Социально незащищенные', 'fixed_trips', '{"trips": 144}', true),
('Жители', 'Жители определенных территорий', 'discount_percent', '{"discountPercent": 20}', true);


