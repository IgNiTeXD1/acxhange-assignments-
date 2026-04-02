SELECT 
    employee_id,
    COUNT(*) AS total_days,
    SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent_days,
    SUM(CASE WHEN status = 'Half-Day' THEN 1 ELSE 0 END) AS half_days
FROM attendance
WHERE MONTH(attendance_date) = 7 AND YEAR(attendance_date) = 2024
GROUP BY employee_id;