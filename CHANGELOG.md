# Changelog

## v1.2.0

- Se agrego `set_economy_symbol` para que los administradores cambien el icono de economia

## Cambios

- Refactorizacion de nombres de funciones, types,

## v1.1.2

- Fixeo de inconcistencias en anchura y altura de thumbails embeds
- Elimine texto de thumbnails nueva imagen

## v1.1.1

- Se optimizo la validacion de permisos usuario-admin
- Se agrego `success_icon.png` archivo

## v1.1.0

- Se agrego `set_cooldown_time` para que los administradores manejes los tiempos de cooldown de el comando `work`

### Patches

- Se agrego ['segundos'] a la alerta de cooldown de el comando `work`

### Cambios

- Renombre `setCooldowm` y `getCooldown` a snake_case
- Borre `s_stacker.ts` por falta de utilidad
- Borre `s_manager.ts` por falta de utilidad
- Borre `console.log()` debuger de `cd_manager.ts` y `work`

## v1.0.1

- Se corrigió el bug en el comando work donde se mostraban milisegundos en lugar de segundos en el cooldown.
- Se mejoró el manejo y consistencia del sistema de tiempo.

## Estado de esta version

- Comando work más estable y consistente.
- Sistema de cooldown más confiable y fácil de mantener.

## v1.0.0

- Se agrego `/work`, para que los usuarios puedan ganar dinero de forma simple.
- Se agrego `/wallet_balance`, para consultar el saldo de la cartera en publico o en privado.
- Se agrego `/add_balance`, para que la administracion pueda entregar saldo a usuarios.
- Se agrego soporte para enviar saldo a cartera o banco desde administracion.
- Se agrego un tiempo de espera en `/work`, para evitar el uso seguido del comando.
- Se dejo preparada la lectura de configuraciones por servidor, como cooldown y simbolo de economia.
- Se agrego `/ping`, para comprobar rapidamente si el bot esta activo.
- Se agrego sincronizacion interna de slash commands, para facilitar pruebas y despliegues.

## Estado de esta version

La base de economia ya funciona, pero algunas opciones todavia estan a medio camino: hay soporte interno para configuraciones y banco, aunque no todo cuenta aun con comandos visibles para el usuario.
