# Пример реализации шардинга в PostgreSQL (Postgres FDW)

## Описание

Пример настройки шардинга в PostgreSQL при помощи расширения Postgres FDW.

Для работы с БД будет использоваться psql, для запуска клиента - nodejs.

## Запуск

1. Запустить докер-контейнеры:

```
docker-compose up -d
```

2. Дождаться инициализации контейнеров и получить их IP-адреса:

2.1 Адрес оновной БД
```docker inspect db_cluster | grep IPAddress```
2.2 Адрес первого шарда
```docker inspect db_shard01 | grep IPAddress```
2.3 Адрес второго шарда
```docker inspect db_shard02 | grep IPAddress```

3. Инициализировать базы:

Пароль для пользователя johndoe - secret

3.1 Инициализировать основную БД
```psql -h <адрес основной БД> -p 5432 -U johndoe -d sharding_test -a -f ./schema.sql```
3.2 Инициализировать первый шард
```psql -h <адрес первого шарда> -p 5432 -U johndoe -d sharding_test -a -f ./shard_schema.sql```
3.3 Инициализировать второй шард
```psql -h <адрес второго шарда> -p 5432 -U johndoe -d sharding_test -a -f ./shard_schema.sql```

4. Запустить клиент
```
node client/index.js
```

