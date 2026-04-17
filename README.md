# Aurum

Aurum es un bot de economia para Discord pensado para servidores que quieren una base simple: trabajar, ver saldo y administrar dinero sin comandos complicados.

## Que puede hacer hoy

- `/work`: te deja ganar dinero aleatorio cada vez que el tiempo de espera lo permita.
- `/wallet_balance`: muestra el dinero que tienes en tu cartera.
- `/add_balance`: permite a administradores dar saldo a un usuario.
- `/ping`: sirve para comprobar si el bot esta respondiendo.

## Como se usa

- Todos los comandos funcionan con slash commands.
- Algunas respuestas pueden enviarse en privado para no llenar el chat.
- El saldo se guarda por servidor, asi que cada comunidad puede tener su propia economia.

## Bugs conocidos

- El tiempo de espera de `/work` puede verse como un numero poco claro en vez de mostrarse como segundos o minutos.
- El banco ya puede recibir saldo por administracion, pero todavia no hay un comando publico para revisar ese dinero.
- La configuracion del cooldown ya existe por dentro, pero aun no tiene un comando visible para cambiarla desde Discord.

## En desarrollo

- Ajustar el cooldown de trabajo desde un comando para administradores.
- Personalizar el simbolo de la economia por servidor.
- Completar la parte de banco con mas comandos para usuarios.

## Resumen rapido

Aurum ya sirve como base de economia para empezar a usarlo en un servidor, pero todavia esta en una etapa temprana y varias funciones ya preparadas por dentro aun no estan expuestas como comandos para el usuario final.
