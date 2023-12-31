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

    2.1. Адрес оcновной БД
    ```docker inspect db_cluster | grep IPAddress```

    2.2. Адрес первого шарда
    ```docker inspect db_shard01 | grep IPAddress```

    2.3. Адрес второго шарда
    ```docker inspect db_shard02 | grep IPAddress```

3. Инициализировать базы:

    Пароль для пользователя johndoe - secret

    3.1. Внести изменени в конфигурацию серверов для каждого шарда в файле ./schema.sql:
    ```
    OPTIONS (dbname 'sharding_test', host <ip адрес шарда>, port '5432')
    ```

    3.1. Инициализировать основную БД
    Перед инициализацией необходимо корректно проставить адреса шардов в schema.sql
    ```psql -h <адрес основной БД> -p 5432 -U johndoe -d sharding_test -a -f ./schema.sql```

    3.2. Инициализировать первый шард
    ```psql -h <адрес первого шарда> -p 5432 -U johndoe -d sharding_test -a -f ./shard_schema.sql```

    3.3. Инициализировать второй шард
    ```psql -h <адрес второго шарда> -p 5432 -U johndoe -d sharding_test -a -f ./shard_schema.sql```

4. Запустить клиент

    4.1. Внести изменения в конфигурационный файл ./client/dev.env:

    ```
    DB_HOST=<ip адрес основной БД>
    ```

    4.2. Запустить приложение:

    ```
    cd ./client
    npm i
    node ./index.js
    ```

## Работа с клиентом

1. Получение списка товаров
```
curl http://localhost:8080/api/v1/goods
```
    
2. Создание нового товара
```
curl http://localhost:8080/api/v1/goods -X POST -H 'Content-Type: application/json' -d '{ "name": "dummy", "price": 111 }'
```

3. Получение списка заказов
```
curl http://localhost:8080/api/v1/orders
```

4. Создание нового заказа
```
curl http://localhost:8080/api/v1/orders -X POST -H 'Content-Type: application/json' -d '{ "shopId": 1 }'
```

