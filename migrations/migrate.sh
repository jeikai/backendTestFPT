
DB_HOST="localhost"
DB_USER="root"
DB_PASS=""
DB_NAME="funbug"

echo "Running DB migrations..."

for sql_file in ./migrations/*.sql
do
  echo "Running $sql_file"
  mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < $sql_file
done

echo "Migrations done!"
