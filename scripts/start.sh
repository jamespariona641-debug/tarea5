#!/bin/bash
set -e

cat > /etc/systemd/system/mercadoandino.service <<'EOF'
[Unit]
Description=Aplicacion MercadoAndino
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/mercadoandino
ExecStart=/usr/bin/node /opt/mercadoandino/server.js
Restart=always
RestartSec=5
Environment=PORT=80

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mercadoandino
systemctl restart mercadoandino

echo "Servicio MercadoAndino iniciado correctamente"
