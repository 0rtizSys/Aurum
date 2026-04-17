# Changelog

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
