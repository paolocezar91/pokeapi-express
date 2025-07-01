CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    artwork_url VARCHAR(255),
    description_lang VARCHAR(50),
    list_table BOOLEAN,
    show_column VARCHAR(100),
    show_show_column BOOLEAN,
    show_thumb_table BOOLEAN,
    thumb_label_list VARCHAR(255),
    thumb_size_list VARCHAR(255),
    type_artwork_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);