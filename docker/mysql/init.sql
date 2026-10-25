-- 開発用：prisma migrate dev が一時的なデータベース（shadow database）を作れるように権限を与える
GRANT ALL PRIVILEGES ON *.* TO 'app'@'%';
FLUSH PRIVILEGES;
