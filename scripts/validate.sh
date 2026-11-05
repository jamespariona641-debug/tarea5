#!/bin/bash
set -e

for i in {1..10}; do
    if curl -fsS http://localhost/health; then
        echo "MercadoAndino funciona correctamente"
        exit 0
    fi
    sleep 5
done

echo "Error: MercadoAndino no responde"
exit 1
