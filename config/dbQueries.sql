CREATE TABLE envelopes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    budget integer,
    description VARCHAR(255)
);

INSERT INTO envelopes (name, budget, description) VALUES (
    'Gadget Plan',
    5000,
    'Buy gadgets'
);


CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    amount integer,
    date DATE,
    envelopeId integer REFERENCES envelopes(id)
);

INSERT INTO transactions (name, amount, date, envelopeId) VALUES (
    'Buy Macbook',
    700,
    '04-01-2023',
    1
);

INSERT INTO transactions (name, amount, date, envelopeId) VALUES (
    'Buy Juice',
    100,
    '04-01-2023',
    2
);