# An Express Server Template

should the correct sql command to set up the db be like this??

-- Create new database (run this outside if needed)
-- CREATE DATABASE your_new_database_name;

-- Switch to the new database
-- \c your_new_database_name

-- 1. Create the questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL -- 💥 category must have a value
);

-- 2. Create the answers table
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

-- 3. Create the question_votes table
CREATE TABLE IF NOT EXISTS question_votes (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    vote INTEGER CHECK (vote = 1 OR vote = -1)
);

-- 4. Create the answer_votes table
CREATE TABLE IF NOT EXISTS answer_votes (
    id SERIAL PRIMARY KEY,
    answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
    vote INTEGER CHECK (vote = 1 OR vote = -1)
);

-- 5. Insert sample questions (title, description, category)
DO $$
DECLARE
    categories TEXT[] := ARRAY[
        'technology', 'cuisine', 'travelling', 'science', 
        'literature', 'music', 'sports', 'movies', 
        'history', 'miscellaneous'
    ];
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO questions (title, description, category)
        VALUES (
            'Question Title ' || i || ' about ' || categories[(i % array_length(categories, 1)) + 1],
            'This is a detailed description for question ' || i || '. It covers various aspects of ' || categories[(i % array_length(categories, 1)) + 1] || '.',
            categories[(i % array_length(categories, 1)) + 1]
        );
    END LOOP;
END
$$;

-- 6. Insert sample answers
DO $$
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO answers (question_id, content)
        VALUES (
            (SELECT id FROM questions ORDER BY RANDOM() LIMIT 1),
            'Answer ' || i || ' content goes here. It provides an in-depth explanation about ' || CASE
                WHEN i % 10 = 0 THEN 'the latest advancements in technology.'
                WHEN i % 10 = 1 THEN 'the unique flavors of different cuisines.'
                WHEN i % 10 = 2 THEN 'the best travel destinations and tips.'
                WHEN i % 10 = 3 THEN 'recent scientific studies and their implications.'
                WHEN i % 10 = 4 THEN 'famous literary works and authors.'
                WHEN i % 10 = 5 THEN 'different genres of music and popular artists.'
                WHEN i % 10 = 6 THEN 'various sports and famous athletes.'
                WHEN i % 10 = 7 THEN 'popular movies and their reviews.'
                WHEN i % 10 = 8 THEN 'significant historical events and figures.'
                ELSE 'various interesting topics.'
            END
        );
    END LOOP;
END
$$;

-- 7. Insert sample question_votes
DO $$
BEGIN
    FOR i IN 1..200 LOOP
        INSERT INTO question_votes (question_id, vote)
        VALUES (
            (SELECT id FROM questions ORDER BY RANDOM() LIMIT 1),
            CASE WHEN RANDOM() > 0.5 THEN 1 ELSE -1 END
        );
    END LOOP;
END
$$;

-- 8. Insert sample answer_votes
DO $$
BEGIN
    FOR i IN 1..200 LOOP
        INSERT INTO answer_votes (answer_id, vote)
        VALUES (
            (SELECT id FROM answers ORDER BY RANDOM() LIMIT 1),
            CASE WHEN RANDOM() > 0.5 THEN 1 ELSE -1 END
        );
    END LOOP;
END
$$;
