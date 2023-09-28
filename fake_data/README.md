```
sudo -i -u postgres psql
# or just psql depends on which user have access to psql
psql

\copy public.users(name, email, password) FROM '{path_to_csv_file}'  WITH(FORMAT csv, HEADER true);
```