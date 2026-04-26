-- capitalisation.keywords: upper
-- capitalisation.identifiers: lower
-- capitalisation.functions: upper
-- capitalisation.literals: upper
-- capitalisation.types: upper
-- convention.not_equal: c_style (!=)
-- aliasing.length: min 3 chars
-- indentation: implicit_indents allow
-- max_line_length: 80

-- basic select with keyword, identifier, function capitalisation
SELECT
  user_id,
  first_name,
  last_name,
  count(*) AS cnt,
  sum(order_total) AS ttl,
  coalesce(email, 'unknown') AS eml,
  lower(status) AS sts,
  cast(created_at AS TIMESTAMP) AS created_at
FROM orders
WHERE status != 'cancelled'
  AND order_total > 0
GROUP BY
  user_id,
  first_name,
  last_name,
  status
HAVING count(*) > 1
ORDER BY user_id ASC;

-- joins
SELECT
  ord.order_id,
  ord.user_id,
  usr.first_name,
  usr.last_name,
  prd.product_name
FROM orders AS ord
INNER JOIN users AS usr
  ON ord.user_id = usr.user_id
LEFT JOIN products AS prd
  ON ord.product_id = prd.product_id
WHERE ord.status != 'pending'
  AND usr.is_active = TRUE;

-- subquery
SELECT
  sub.user_id,
  sub.total_orders
FROM (
  SELECT
    user_id,
    count(*) AS total_orders
  FROM orders
  WHERE status != 'failed'
  GROUP BY user_id
) AS sub
WHERE sub.total_orders > 5;

-- cte
WITH ranked_orders AS (
  SELECT
    order_id,
    user_id,
    order_total,
    row_number() OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC
    ) AS row_num
  FROM orders
),

active_users AS (
  SELECT user_id
  FROM users
  WHERE is_active = TRUE
    AND email != ''
)

SELECT
  rko.order_id,
  rko.user_id,
  rko.order_total
FROM ranked_orders AS rko
INNER JOIN active_users AS acu
  ON rko.user_id = acu.user_id
WHERE rko.row_num = 1;

-- data types (capitalisation.types: upper)
CREATE OR REPLACE TABLE sample_table (
  id INTEGER,
  full_name VARCHAR(255),
  score FLOAT,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  metadata VARIANT,
  tags ARRAY,
  details OBJECT
);

-- snowflake-specific: flatten, qualify, semi-structured
SELECT
  usr.user_id,
  usr.email,
  flt.tag_item AS tag_str
FROM users AS usr,
  LATERAL flatten(input => usr.tags) AS flt
WHERE usr.is_active = TRUE
QUALIFY row_number() OVER (
    PARTITION BY usr.user_id
    ORDER BY usr.created_at DESC
  ) = 1;

-- window functions
SELECT
  order_id,
  user_id,
  order_total,
  sum(order_total) OVER (
    PARTITION BY user_id
    ORDER BY created_at
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total,
  lag(order_total, 1) OVER (
    PARTITION BY user_id
    ORDER BY created_at
  ) AS prev_total
FROM orders
WHERE status != 'refunded';

-- jinja templating (templater = jinja)
{% set start_date = '2024-01-01' %}
{% set end_date = '2024-12-31' %}
SELECT
  order_id,
  user_id,
  order_total
FROM orders
WHERE created_at >= '{{ start_date }}'
  AND created_at < '{{ end_date }}'
  AND status != 'draft';
