# Skill Builder v2

## Qué es
App web para crear archivos SKILL.md potentes con ayuda de IA. Formulario de 5 pasos que guía al usuario y botones que llaman a la IA para sugerir triggers, generar descripciones, pasos, reglas y hacer review final.

## Estado actual
Listo para deploy

## Stack
- Frontend: HTML + CSS + JS puro (sin frameworks)
- Backend: Node.js + Express (puerto 3001)
- DB: No usa base de datos
- Hosting: Hostinger Cloud Startup con PM2

## Estructura de carpetas
```
skill-builder-v2/
├── CLAUDE.md
├── .gitignore
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
└── frontend/
    └── public/
        └── index.html
```

## Variables de entorno necesarias
- PORT (default: 3001)
- AI_MODE (anthropic | n8n)
- ANTHROPIC_API_KEY (si AI_MODE=anthropic)
- ANTHROPIC_MODEL (default: claude-haiku-4-5-20251001)
- N8N_WEBHOOK_URL (si AI_MODE=n8n)
- N8N_SECRET (opcional, para n8n)

## Rutas del API principales
- POST /api/ai — Llama a la IA (Anthropic o n8n) con prompt y action
- GET /api/config — Devuelve modo activo y estado de configuración (sin exponer keys)

## Reglas específicas de este proyecto
- No usa base de datos
- Frontend servido como archivos estáticos desde ../frontend/public
- Soporta dos modos de IA: Anthropic directo o n8n webhook
- Las llamadas a IA se hacen desde el backend (nunca desde el frontend)

## Próximos pasos
- [ ] Deploy en Hostinger con PM2
