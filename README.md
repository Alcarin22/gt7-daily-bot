# GT7 Daily Bot

Bot de Discord desarrollado para publicar y mantener actualizada la información de las **Carreras Diarias de Gran Turismo 7**.

> 🚧 Proyecto actualmente en desarrollo.

## Sobre el proyecto

GT7 Daily Bot nace como una herramienta para automatizar la publicación semanal de las Carreras Diarias de Gran Turismo 7 dentro de una comunidad de Discord.

El bot recopila información disponible públicamente sobre las carreras, procesa los datos obtenidos y genera publicaciones estructuradas para facilitar su consulta desde Discord.

## Funcionalidades

- Publicación de las Carreras Diarias A, B y C.
- Comando `/daily` para realizar una actualización manual.
- Publicaciones estructuradas mediante embeds de Discord.
- Información provisional cuando todavía existen datos pendientes de confirmación.
- Actualización de publicaciones existentes.
- Automatización semanal mediante tareas programadas.
- Recopilación y combinación de información procedente de distintas fuentes públicas.
- Persistencia del estado de las publicaciones para evitar duplicados.

Entre los datos procesados se encuentran información como circuito, categoría, vueltas, neumáticos, consumo de combustible, desgaste, BoP, configuración, daños o tipo de salida.

## Tecnologías

- Node.js
- JavaScript
- Discord.js
- Axios
- Cheerio
- Luxon
- node-cron
- dotenv

## Fuentes de información

Actualmente el proyecto utiliza información pública procedente de servicios relacionados con Gran Turismo 7, entre ellos:

- GTSH-Rank
- GT GridStats

El funcionamiento de determinadas partes del bot depende de la estructura y disponibilidad de estas fuentes externas.

## Automatización

El bot incluye un sistema de comprobación programada para detectar y publicar la información correspondiente a las nuevas carreras semanales.

Cuando todavía faltan datos, la publicación puede mostrarse de forma provisional hasta que la información esté disponible y pueda actualizarse.

## Discord

El bot dispone actualmente del comando:

```text
/daily
