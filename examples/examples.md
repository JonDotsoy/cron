# Cron Expression Examples

This file is auto-generated from `examples/examples.ts`.

- `30,49 10-17,10 14-27 */4 2-3`
  - **en**: At minute 30 past hour 10-17 and 10 on every day-of-month from 14 through 27 on every day-of-week from Tuesday through Wednesday in every 4th month.
  - **es**: Al minuto 30 después de la hora 10-17 y 10 cada día del mes del 14 al 27 cada día de la semana del martes al miércoles de cada cuarto mes.
  - **es-CL-Flaite**: La weá corre al minuto 30 pasao' las 10-17 o 10 cada día del mes del 14 al 27, terrible específico del martes al miércoles en cada 4 mes.

- `19 * */4 * 0,2-6`
  - **en**: At minute 19 on day-of-month \*/4 and on Sunday and Tuesday.
  - **es**: Al minuto 19 los días \*/4 del mes y los domingos y martes.
  - **es-CL-Flaite**: La weá corre al minuto 19, sólo los días \*/4, y encima tiene que caer domingo o martes….

- `34 7-15 25,8-22,24 */2 2,0,2-5 2029`
  - **en**: At 07:34 on day-of-month 25 and 8-22 and 24 and on Tuesday and Sunday and Tuesday in every 2nd month in 2029.
  - **es**: A las 07:34 los días 25 y 8-22 y 24 del mes y los martes y domingos y martes de cada segundo mes en 2029.
  - **es-CL-Flaite**: La weá corre a las 07:34, sólo los días 25 y 8-22 o 24, y encima tiene que caer martes o domingo o martes… en cada 2 mes en 2029.

- `13 22 6-30,10 2 0-6/2 2024-2030/2`
  - **en**: At 22:13 on day-of-month 6-30 and 10 on every 2nd day-of-week from Sunday through Saturday in February in 2024-2030/2.
  - **es**: A las 22:13 los días 6-30 y 10 del mes cada segundo día de la semana del domingos al sábados de febrero en 2024-2030/2.
  - **es-CL-Flaite**: La weá corre a las 22:13, sólo los días 6-30 o 10 cada 2 día de la semana del domingo al sábado, terrible específico en febrero en 2024-2030/2.

- `39,24-49,8 19 25 11 0`
  - **en**: At every minute from 39,24 through 49,8 past hour 19 on day-of-month 25 and on Sunday in November.
  - **es**: Cada minuto del 39,24 al 49,8 después de la hora 19 los días 25 del mes y los domingos de noviembre.
  - **es-CL-Flaite**: La weá corre entre el minuto 39,24 y el 49,8 pasao' las 19 de la mañana, sólo los días 25, y encima tiene que caer domingo… en noviembre.

- `* 18-21 18 * 4`
  - **en**: At every minute past hour 18 on day-of-month 18 and on Thursday.
  - **es**: Cada minuto después de la hora 18 los días 18 del mes y los jueves.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 18, sólo los días 18, y encima tiene que caer jueves….

- `@reboot`
  - **en**: At reboot.
  - **es**: Al reiniciar.
  - **es-CL-Flaite**: La weá corre cuando reinicie el compu, ¿cachai?

- `36 0-14 14 1 * 2024-2030/3`
  - **en**: At 00:36 on day-of-month 14 in January in 2024-2030/3.
  - **es**: A las 00:36 los días 14 del mes de enero en 2024-2030/3.
  - **es-CL-Flaite**: La weá corre a las 00:36, sólo los días 14 en enero en 2024-2030/3.

- `*/2 11 */2 3-5,5,4-8 3`
  - **en**: At every 2nd minute past hour 11 on day-of-month \*/2 and on Wednesday in every month from March through May and May and every month from April through August.
  - **es**: At every segundo minute past hour 11 los días \*/2 del mes y los miércoles de cada mes desde marzo hasta mayo y mayo y cada mes desde abril hasta agosto.
  - **es-CL-Flaite**: At every 2 minute past hour 11, sólo los días \*/2, y encima tiene que caer miércoles… en desde marzo hasta mayo o mayo o desde abril hasta agosto.

- `22,7 * 6,12-31,13-15 11 3-4`
  - **en**: At minute 22 on day-of-month 6 and 12-31 and 13-15 on every day-of-week from Wednesday through Thursday in November.
  - **es**: Al minuto 22 los días 6 y 12-31 y 13-15 del mes cada día de la semana del miércoles al jueves de noviembre.
  - **es-CL-Flaite**: La weá corre al minuto 22, sólo los días 6 y 12-31 o 13-15 del miércoles al jueves en noviembre.

- `24 */4 9-13 3-6 1-4`
  - **en**: At minute 24 past every 4th hour on every day-of-month from 9 through 13 on every day-of-week from Monday through Thursday in every month from March through June.
  - **es**: At minute 24 past every cuarto hour cada día del mes del 9 al 13 cada día de la semana del lunes al jueves de cada mes desde marzo hasta junio.
  - **es-CL-Flaite**: At minute 24 past every 4 hour cada día del mes del 9 al 13, terrible específico del lunes al jueves en desde marzo hasta junio.

- `*/4 * */3 4 3-5`
  - **en**: At every 4th minute on day-of-month \*/3 on every day-of-week from Wednesday through Friday in April.
  - **es**: Cada cuarto minuto los días \*/3 del mes cada día de la semana del miércoles al viernes de abril.
  - **es-CL-Flaite**: La weá corre cada 4 minuto, sólo los días \*/3 del miércoles al viernes en abril.

- `48-49 13 */2 * 4-6`
  - **en**: At every minute from 48 through 49 past hour 13 on day-of-month \*/2 on every day-of-week from Thursday through Saturday.
  - **es**: Cada minuto del 48 al 49 después de la hora 13 los días \*/2 del mes cada día de la semana del jueves al sábados.
  - **es-CL-Flaite**: La weá corre entre el minuto 48 y el 49 pasao' las 13 de la mañana, sólo los días \*/2 del jueves al sábado.

- `* 11 13 1 0-6/4`
  - **en**: At every minute past hour 11 on day-of-month 13 on every 4th day-of-week from Sunday through Saturday in January.
  - **es**: Cada minuto después de la hora 11 los días 13 del mes cada cuarto día de la semana del domingos al sábados de enero.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 11, sólo los días 13 cada 4 día de la semana del domingo al sábado, terrible específico en enero.

- `24,46-47 10-20 11-29 */5 0-6/2`
  - **en**: At every minute from 24,46 through 47 past hour 10 on every day-of-month from 11 through 29 on every 2nd day-of-week from Sunday through Saturday in every 5th month.
  - **es**: Cada minuto del 24,46 al 47 después de la hora 10 cada día del mes del 11 al 29 cada segundo día de la semana del domingos al sábados de cada quinto mes.
  - **es-CL-Flaite**: La weá corre entre el minuto 24,46 y el 47 pasao' las 10 de la mañana cada día del mes del 11 al 29, terrible específico cada 2 día de la semana del domingo al sábado, terrible específico en cada 5 mes.

- `*/2 12 10,28-30 4 1-5,3`
  - **en**: At every 2nd minute past hour 12 on day-of-month 10 and 28-30 and on Monday and Wednesday in April.
  - **es**: At every segundo minute past hour 12 los días 10 y 28-30 del mes y los lunes y miércoles de abril.
  - **es-CL-Flaite**: At every 2 minute past hour 12, sólo los días 10 y 28-30, y encima tiene que caer lunes o miércoles… en abril.

- `13-50 */4 * 2-3,2,10 *`
  - **en**: At minute 13 past every 4th hour in every month from February through March and February and October.
  - **es**: At minute 13 past every cuarto hour de cada mes desde febrero hasta marzo y febrero y octubre.
  - **es-CL-Flaite**: At minute 13 past every 4 hour en desde febrero hasta marzo o febrero o octubre.

- `55 * */5 9-10 2-5`
  - **en**: At minute 55 on day-of-month \*/5 on every day-of-week from Tuesday through Friday in every month from September through October.
  - **es**: Al minuto 55 los días \*/5 del mes cada día de la semana del martes al viernes de cada mes desde septiembre hasta octubre.
  - **es-CL-Flaite**: La weá corre al minuto 55, sólo los días \*/5 del martes al viernes en desde septiembre hasta octubre.

- `45-55,13-53 */4 29-31 11,9-12,3-5 2,1-3,6`
  - **en**: At minute 45 past every 4th hour on every day-of-month from 29 through 31 and on Tuesday and Monday and Saturday in November and every month from September through December and every month from March through May.
  - **es**: At minute 45 past every cuarto hour cada día del mes del 29 al 31 y los martes y lunes y sábados de noviembre y cada mes desde septiembre hasta diciembre y cada mes desde marzo hasta mayo.
  - **es-CL-Flaite**: At minute 45 past every 4 hour cada día del mes del 29 al 31, terrible específico, y encima tiene que caer martes o lunes o sábado… en noviembre o desde septiembre hasta diciembre o desde marzo hasta mayo.

- `46-53 4-10 21 * *`
  - **en**: At every minute from 46 through 53 past hour 4 on day-of-month 21.
  - **es**: Cada minuto del 46 al 53 después de la hora 4 los días 21 del mes.
  - **es-CL-Flaite**: La weá corre entre el minuto 46 y el 53 pasao' las 4 de la mañana, sólo los días 21.

- `*/5 3-18,11,20-21 24 * *`
  - **en**: At every 5th minute past hour 3 on day-of-month 24.
  - **es**: At every quinto minute past hour 3 los días 24 del mes.
  - **es-CL-Flaite**: At every 5 minute past hour 3, sólo los días 24.

- `*/4 17-20 */3 5,7-10 0-6/2`
  - **en**: At every 4th minute past hour 17 on day-of-month \*/3 on every 2nd day-of-week from Sunday through Saturday in May and every month from July through October.
  - **es**: At every cuarto minute past hour 17 los días \*/3 del mes cada segundo día de la semana del domingos al sábados de mayo y cada mes desde julio hasta octubre.
  - **es-CL-Flaite**: At every 4 minute past hour 17, sólo los días \*/3 cada 2 día de la semana del domingo al sábado, terrible específico en mayo o desde julio hasta octubre.

- `43,59,42-56 9,14-21 */5 * 2`
  - **en**: At every minute from 43,59,42 through 56 past hour 9 on day-of-month \*/5 and on Tuesday.
  - **es**: Cada minuto del 43,59,42 al 56 después de la hora 9 los días \*/5 del mes y los martes.
  - **es-CL-Flaite**: La weá corre entre el minuto 43,59,42 y el 56 pasao' las 9 de la mañana, sólo los días \*/5, y encima tiene que caer martes….

- `* * */5 8,8-12 2-4`
  - **en**: At every minute on day-of-month \*/5 on every day-of-week from Tuesday through Thursday in August and every month from August through December.
  - **es**: Cada minuto los días \*/5 del mes cada día de la semana del martes al jueves de agosto y cada mes desde agosto hasta diciembre.
  - **es-CL-Flaite**: La weá corre cada minuto, sólo los días \*/5 del martes al jueves en agosto o desde agosto hasta diciembre.

- `22 */3 13-16,18-21,29-30 * 3-6`
  - **en**: At minute 22 past every 3rd hour on day-of-month 13-16 and 18-21 and 29-30 on every day-of-week from Wednesday through Saturday.
  - **es**: At minute 22 past every tercer hour los días 13-16 y 18-21 y 29-30 del mes cada día de la semana del miércoles al sábados.
  - **es-CL-Flaite**: At minute 22 past every 3 hour, sólo los días 13-16 o 18-21 o 29-30 del miércoles al sábado.

- `17 * 17-27,13-26 9-11 5-6,6,3-5`
  - **en**: At minute 17 on day-of-month 17-27 and 13-26 and on Friday and Saturday and Wednesday in every month from September through November.
  - **es**: Al minuto 17 los días 17-27 y 13-26 del mes y los viernes y sábados y miércoles de cada mes desde septiembre hasta noviembre.
  - **es-CL-Flaite**: La weá corre al minuto 17, sólo los días 17-27 o 13-26, y encima tiene que caer viernes o sábado o miércoles… en desde septiembre hasta noviembre.

- `*/2 13-21 19-29 12 0-6/2`
  - **en**: At every 2nd minute past hour 13 on every day-of-month from 19 through 29 on every 2nd day-of-week from Sunday through Saturday in December.
  - **es**: At every segundo minute past hour 13 cada día del mes del 19 al 29 cada segundo día de la semana del domingos al sábados de diciembre.
  - **es-CL-Flaite**: At every 2 minute past hour 13 cada día del mes del 19 al 29, terrible específico cada 2 día de la semana del domingo al sábado, terrible específico en diciembre.

- `* 15 23 5-12,9-11 *`
  - **en**: At every minute past hour 15 on day-of-month 23 in every month from May through December and every month from September through November.
  - **es**: Cada minuto después de la hora 15 los días 23 del mes de cada mes desde mayo hasta diciembre y cada mes desde septiembre hasta noviembre.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 15, sólo los días 23 en desde mayo hasta diciembre o desde septiembre hasta noviembre.

- `8 2 30-31 * 0-6 2029`
  - **en**: At 02:08 on every day-of-month from 30 through 31 on every day-of-week from Sunday through Saturday in 2029.
  - **es**: A las 02:08 cada día del mes del 30 al 31 cada día de la semana del domingos al sábados en 2029.
  - **es-CL-Flaite**: La weá corre a las 02:08 cada día del mes del 30 al 31, terrible específico del domingo al sábado en 2029.

- `* 12-15 * 9 0-6/3`
  - **en**: At every minute past hour 12 on every 3rd day-of-week from Sunday through Saturday in September.
  - **es**: Cada minuto después de la hora 12 cada tercer día de la semana del domingos al sábados de septiembre.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 12 cada 3 día de la semana del domingo al sábado, terrible específico en septiembre.

- `29,4-30,36-48 2-16 14 5-6 0`
  - **en**: At every minute from 29,4 through 30,36 past hour 2 on day-of-month 14 and on Sunday in every month from May through June.
  - **es**: Cada minuto del 29,4 al 30,36 después de la hora 2 los días 14 del mes y los domingos de cada mes desde mayo hasta junio.
  - **es-CL-Flaite**: La weá corre entre el minuto 29,4 y el 30,36 pasao' las 2 de la mañana, sólo los días 14, y encima tiene que caer domingo… en desde mayo hasta junio.

- `34-47 21-22,5,2-19 13-20 10-11 4-5,1-2`
  - **en**: At every minute from 34 through 47 past hour 21 on every day-of-month from 13 through 20 and on Thursday and Monday in every month from October through November.
  - **es**: Cada minuto del 34 al 47 después de la hora 21 cada día del mes del 13 al 20 y los jueves y lunes de cada mes desde octubre hasta noviembre.
  - **es-CL-Flaite**: La weá corre entre el minuto 34 y el 47 pasao' las 21 de la mañana cada día del mes del 13 al 20, terrible específico, y encima tiene que caer jueves o lunes… en desde octubre hasta noviembre.

- `6-39,28,23-49 */5 27-31 * 0-6/2`
  - **en**: At minute 6 past every 5th hour on every day-of-month from 27 through 31 on every 2nd day-of-week from Sunday through Saturday.
  - **es**: At minute 6 past every quinto hour cada día del mes del 27 al 31 cada segundo día de la semana del domingos al sábados.
  - **es-CL-Flaite**: At minute 6 past every 5 hour cada día del mes del 27 al 31, terrible específico cada 2 día de la semana del domingo al sábado, terrible específico.

- `* 20-22 6-26 9 5-6,0-3`
  - **en**: At every minute past hour 20 on every day-of-month from 6 through 26 and on Friday and Sunday in September.
  - **es**: Cada minuto después de la hora 20 cada día del mes del 6 al 26 y los viernes y domingos de septiembre.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 20 cada día del mes del 6 al 26, terrible específico, y encima tiene que caer viernes o domingo… en septiembre.

- `34-48,15-56,28 15-21 6-9 10 4`
  - **en**: At every minute from 34 through 48,15 past hour 15 on every day-of-month from 6 through 9 and on Thursday in October.
  - **es**: Cada minuto del 34 al 48,15 después de la hora 15 cada día del mes del 6 al 9 y los jueves de octubre.
  - **es-CL-Flaite**: La weá corre entre el minuto 34 y el 48,15 pasao' las 15 de la mañana cada día del mes del 6 al 9, terrible específico, y encima tiene que caer jueves… en octubre.

- `57 */5 */3 */3 *`
  - **en**: At minute 57 past every 5th hour on day-of-month \*/3 in every 3rd month.
  - **es**: At minute 57 past every quinto hour los días \*/3 del mes de cada tercer mes.
  - **es-CL-Flaite**: At minute 57 past every 5 hour, sólo los días \*/3 en cada 3 mes.

- `21,46-53,21-22 6-16,19-21 */4 5 0-6/4`
  - **en**: At every minute from 21,46 through 53,21 past hour 6 on day-of-month \*/4 on every 4th day-of-week from Sunday through Saturday in May.
  - **es**: Cada minuto del 21,46 al 53,21 después de la hora 6 los días \*/4 del mes cada cuarto día de la semana del domingos al sábados de mayo.
  - **es-CL-Flaite**: La weá corre entre el minuto 21,46 y el 53,21 pasao' las 6 de la mañana, sólo los días \*/4 cada 4 día de la semana del domingo al sábado, terrible específico en mayo.

- `* 5 * 4-12 2-6,2-5 2027-2030,2030`
  - **en**: At every minute past hour 5 and on Tuesday and Tuesday in every month from April through December in 2027-2030,2030.
  - **es**: Cada minuto después de la hora 5 y los martes y martes de cada mes desde abril hasta diciembre en 2027-2030,2030.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 5, y encima tiene que caer martes o martes… en desde abril hasta diciembre en 2027-2030,2030.

- `35 20-23 20-27,10-24,3 5-7 5-6,4-5`
  - **en**: At 20:35 on day-of-month 20-27 and 10-24 and 3 and on Friday and Thursday in every month from May through July.
  - **es**: A las 20:35 los días 20-27 y 10-24 y 3 del mes y los viernes y jueves de cada mes desde mayo hasta julio.
  - **es-CL-Flaite**: La weá corre a las 20:35, sólo los días 20-27 o 10-24 o 3, y encima tiene que caer viernes o jueves… en desde mayo hasta julio.

- `34 6-10 * */2 2-6,0-3`
  - **en**: At 06:34 and on Tuesday and Sunday in every 2nd month.
  - **es**: A las 06:34 y los martes y domingos de cada segundo mes.
  - **es-CL-Flaite**: La weá corre a las 06:34, y encima tiene que caer martes o domingo… en cada 2 mes.

- `5-34 0 17-23 */4 4-5`
  - **en**: At every minute from 5 through 34 past hour 0 on every day-of-month from 17 through 23 on every day-of-week from Thursday through Friday in every 4th month.
  - **es**: Cada minuto del 5 al 34 después de la hora 0 cada día del mes del 17 al 23 cada día de la semana del jueves al viernes de cada cuarto mes.
  - **es-CL-Flaite**: La weá corre entre el minuto 5 y el 34 pasao' las 0 de la mañana cada día del mes del 17 al 23, terrible específico del jueves al viernes en cada 4 mes.

- `2,23 */5 18-26 5-7 4-6`
  - **en**: At minute 2 past every 5th hour on every day-of-month from 18 through 26 on every day-of-week from Thursday through Saturday in every month from May through July.
  - **es**: At minute 2 past every quinto hour cada día del mes del 18 al 26 cada día de la semana del jueves al sábados de cada mes desde mayo hasta julio.
  - **es-CL-Flaite**: At minute 2 past every 5 hour cada día del mes del 18 al 26, terrible específico del jueves al sábado en desde mayo hasta julio.

- `54,46-56 */5 6 5-6 *`
  - **en**: At minute 54 past every 5th hour on day-of-month 6 in every month from May through June.
  - **es**: At minute 54 past every quinto hour los días 6 del mes de cada mes desde mayo hasta junio.
  - **es-CL-Flaite**: At minute 54 past every 5 hour, sólo los días 6 en desde mayo hasta junio.

- `* */5 * * 1,4,3`
  - **en**: At every minute past hour NaN and on Monday and Thursday and Wednesday.
  - **es**: Cada minuto después de la hora NaN y los lunes y jueves y miércoles.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las NaN, y encima tiene que caer lunes o jueves o miércoles….

- `*/4 12 * 10-11,6 0-6/4`
  - **en**: At every 4th minute past hour 12 on every 4th day-of-week from Sunday through Saturday in every month from October through November and June.
  - **es**: At every cuarto minute past hour 12 cada cuarto día de la semana del domingos al sábados de cada mes desde octubre hasta noviembre y junio.
  - **es-CL-Flaite**: At every 4 minute past hour 12 cada 4 día de la semana del domingo al sábado, terrible específico en desde octubre hasta noviembre o junio.

- `28,25,10 23,23 30 10 1`
  - **en**: At minute 28 past hour 23 and 23 on day-of-month 30 and on Monday in October.
  - **es**: Al minuto 28 después de la hora 23 y 23 los días 30 del mes y los lunes de octubre.
  - **es-CL-Flaite**: La weá corre al minuto 28 pasao' las 23 o 23, sólo los días 30, y encima tiene que caer lunes… en octubre.

- `13-22,34 17 16 8 5`
  - **en**: At every minute from 13 through 22,34 past hour 17 on day-of-month 16 and on Friday in August.
  - **es**: Cada minuto del 13 al 22,34 después de la hora 17 los días 16 del mes y los viernes de agosto.
  - **es-CL-Flaite**: La weá corre entre el minuto 13 y el 22,34 pasao' las 17 de la mañana, sólo los días 16, y encima tiene que caer viernes… en agosto.

- `8-30 0 5-23 */4 0-6/3`
  - **en**: At every minute from 8 through 30 past hour 0 on every day-of-month from 5 through 23 on every 3rd day-of-week from Sunday through Saturday in every 4th month.
  - **es**: Cada minuto del 8 al 30 después de la hora 0 cada día del mes del 5 al 23 cada tercer día de la semana del domingos al sábados de cada cuarto mes.
  - **es-CL-Flaite**: La weá corre entre el minuto 8 y el 30 pasao' las 0 de la mañana cada día del mes del 5 al 23, terrible específico cada 3 día de la semana del domingo al sábado, terrible específico en cada 4 mes.

- `* 18-23,13 */3 5 0-6/4`
  - **en**: At minute _ past hour 18-23 and 13 on day-of-month _/3 on every 4th day-of-week from Sunday through Saturday in May.
  - **es**: Al minuto _ después de la hora 18-23 y 13 los días _/3 del mes cada cuarto día de la semana del domingos al sábados de mayo.
  - **es-CL-Flaite**: La weá corre al minuto _ pasao' las 18-23 o 13, sólo los días _/3 cada 4 día de la semana del domingo al sábado, terrible específico en mayo.

- `36-38 * 29-31 7 0-3 2030`
  - **en**: At minute 36 on every day-of-month from 29 through 31 on every day-of-week from Sunday through Wednesday in July in 2030.
  - **es**: Al minuto 36 cada día del mes del 29 al 31 cada día de la semana del domingos al miércoles de julio en 2030.
  - **es-CL-Flaite**: La weá corre al minuto 36 cada día del mes del 29 al 31, terrible específico del domingo al miércoles en julio en 2030.

- `* * 18 6-12,11,3-5 0,5`
  - **en**: At every minute on day-of-month 18 and on Sunday and Friday in every month from June through December and November and every month from March through May.
  - **es**: Cada minuto los días 18 del mes y los domingos y viernes de cada mes desde junio hasta diciembre y noviembre y cada mes desde marzo hasta mayo.
  - **es-CL-Flaite**: La weá corre cada minuto, sólo los días 18, y encima tiene que caer domingo o viernes… en desde junio hasta diciembre o noviembre o desde marzo hasta mayo.

- `*/3 */2 */2 */3 5`
  - **en**: At every 3rd minute past hour NaN on day-of-month \*/2 and on Friday in every 3rd month.
  - **es**: At every tercer minute past hour NaN los días \*/2 del mes y los viernes de cada tercer mes.
  - **es-CL-Flaite**: At every 3 minute past hour NaN, sólo los días \*/2, y encima tiene que caer viernes… en cada 3 mes.

- `29-30,21-54 * */3 6 3-4`
  - **en**: At minute 29 on day-of-month \*/3 on every day-of-week from Wednesday through Thursday in June.
  - **es**: Al minuto 29 los días \*/3 del mes cada día de la semana del miércoles al jueves de junio.
  - **es-CL-Flaite**: La weá corre al minuto 29, sólo los días \*/3 del miércoles al jueves en junio.

- `41-44 */2 */4 7 3,5,4`
  - **en**: At minute 41 past every 2nd hour on day-of-month \*/4 and on Wednesday and Friday and Thursday in July.
  - **es**: At minute 41 past every segundo hour los días \*/4 del mes y los miércoles y viernes y jueves de julio.
  - **es-CL-Flaite**: At minute 41 past every 2 hour, sólo los días \*/4, y encima tiene que caer miércoles o viernes o jueves… en julio.

- `34 * 19-27 * 1`
  - **en**: At minute 34 on every day-of-month from 19 through 27 and on Monday.
  - **es**: Al minuto 34 cada día del mes del 19 al 27 y los lunes.
  - **es-CL-Flaite**: La weá corre al minuto 34 cada día del mes del 19 al 27, terrible específico, y encima tiene que caer lunes….

- `30,59,47-49 * * 2,3-8,11-12 3`
  - **en**: At minute 30 on Wednesday in February and every month from March through August and every month from November through December.
  - **es**: Al minuto 30 los miércoles de febrero y cada mes desde marzo hasta agosto y cada mes desde noviembre hasta diciembre.
  - **es-CL-Flaite**: La weá corre al minuto 30 los miércoles en febrero o desde marzo hasta agosto o desde noviembre hasta diciembre.

- `57 * 19 3-12,6-7,3 *`
  - **en**: At minute 57 on day-of-month 19 in every month from March through December and every month from June through July and March.
  - **es**: Al minuto 57 los días 19 del mes de cada mes desde marzo hasta diciembre y cada mes desde junio hasta julio y marzo.
  - **es-CL-Flaite**: La weá corre al minuto 57, sólo los días 19 en desde marzo hasta diciembre o desde junio hasta julio o marzo.

- `* 10,6 */4 */5 0-1,3-6,1-5`
  - **en**: At minute _ past hour 10 and 6 on day-of-month _/4 and on Sunday and Wednesday and Monday in every 5th month.
  - **es**: Al minuto _ después de la hora 10 y 6 los días _/4 del mes y los domingos y miércoles y lunes de cada quinto mes.
  - **es-CL-Flaite**: La weá corre al minuto _ pasao' las 10 o 6, sólo los días _/4, y encima tiene que caer domingo o miércoles o lunes… en cada 5 mes.

- `4,12-35 7-10 31 3-7 0-6/4`
  - **en**: At every minute from 4,12 through 35 past hour 7 on day-of-month 31 on every 4th day-of-week from Sunday through Saturday in every month from March through July.
  - **es**: Cada minuto del 4,12 al 35 después de la hora 7 los días 31 del mes cada cuarto día de la semana del domingos al sábados de cada mes desde marzo hasta julio.
  - **es-CL-Flaite**: La weá corre entre el minuto 4,12 y el 35 pasao' las 7 de la mañana, sólo los días 31 cada 4 día de la semana del domingo al sábado, terrible específico en desde marzo hasta julio.

- `* 10,3,20 2 * *`
  - **en**: At minute \* past hour 10 and 3 and 20 on day-of-month 2.
  - **es**: Al minuto \* después de la hora 10 y 3 y 20 los días 2 del mes.
  - **es-CL-Flaite**: La weá corre al minuto \* pasao' las 10 o 3 o 20, sólo los días 2.

- `16,39-40 11-20,23 24-29,19-28,7 8,7,6-11 2-5 2026`
  - **en**: At every minute from 16,39 through 40 past hour 11 on day-of-month 24-29 and 19-28 and 7 on every day-of-week from Tuesday through Friday in August and July and every month from June through November in 2026.
  - **es**: Cada minuto del 16,39 al 40 después de la hora 11 los días 24-29 y 19-28 y 7 del mes cada día de la semana del martes al viernes de agosto y julio y cada mes desde junio hasta noviembre en 2026.
  - **es-CL-Flaite**: La weá corre entre el minuto 16,39 y el 40 pasao' las 11 de la mañana, sólo los días 24-29 o 19-28 o 7 del martes al viernes en agosto, julio y desde, junio hasta noviembre en 2026.

- `51 * * */3 3,3-6`
  - **en**: At minute 51 and on Wednesday and Wednesday in every 3rd month.
  - **es**: Al minuto 51 y los miércoles y miércoles de cada tercer mes.
  - **es-CL-Flaite**: La weá corre al minuto 51, y encima tiene que caer miércoles o miércoles… en cada 3 mes.

- `43 13-14,12-16,18 * 5-6 0-6/4`
  - **en**: At minute 43 past hour 13-14 and 12-16 and 18 on every 4th day-of-week from Sunday through Saturday in every month from May through June.
  - **es**: Al minuto 43 después de la hora 13-14 y 12-16 y 18 cada cuarto día de la semana del domingos al sábados de cada mes desde mayo hasta junio.
  - **es-CL-Flaite**: La weá corre al minuto 43 pasao' las 13-14 o 12-16 o 18 cada 4 día de la semana del domingo al sábado, terrible específico en desde mayo hasta junio.

- `25-46,48,18 11-14 24,28-30 * *`
  - **en**: At every minute from 25 through 46,48,18 past hour 11 on day-of-month 24 and 28-30.
  - **es**: Cada minuto del 25 al 46,48,18 después de la hora 11 los días 24 y 28-30 del mes.
  - **es-CL-Flaite**: La weá corre entre el minuto 25 y el 46,48,18 pasao' las 11 de la mañana, sólo los días 24 y 28-30.

- `36-55 14-16 14 4-8 0-6/2`
  - **en**: At every minute from 36 through 55 past hour 14 on day-of-month 14 on every 2nd day-of-week from Sunday through Saturday in every month from April through August.
  - **es**: Cada minuto del 36 al 55 después de la hora 14 los días 14 del mes cada segundo día de la semana del domingos al sábados de cada mes desde abril hasta agosto.
  - **es-CL-Flaite**: La weá corre entre el minuto 36 y el 55 pasao' las 14 de la mañana, sólo los días 14 cada 2 día de la semana del domingo al sábado, terrible específico en desde abril hasta agosto.

- `35 */4 15 4,3,10-12 3-4 2029`
  - **en**: At minute 35 past every 4th hour on day-of-month 15 on every day-of-week from Wednesday through Thursday in April and March and every month from October through December in 2029.
  - **es**: At minute 35 past every cuarto hour los días 15 del mes cada día de la semana del miércoles al jueves de abril y marzo y cada mes desde octubre hasta diciembre en 2029.
  - **es-CL-Flaite**: At minute 35 past every 4 hour, sólo los días 15 del miércoles al jueves en abril, marzo y desde, octubre hasta diciembre en 2029.

- `* 4 15-20 11-12 *`
  - **en**: At every minute past hour 4 on every day-of-month from 15 through 20 in every month from November through December.
  - **es**: Cada minuto después de la hora 4 cada día del mes del 15 al 20 de cada mes desde noviembre hasta diciembre.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 4 cada día del mes del 15 al 20, terrible específico en desde noviembre hasta diciembre.

- `* 12-18 * */2 *`
  - **en**: At every minute past hour 12 in every 2nd month.
  - **es**: Cada minuto después de la hora 12 de cada segundo mes.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 12 en cada 2 mes.

- `9,25 * */5 9-11 0-6/4`
  - **en**: At minute 9 on day-of-month \*/5 on every 4th day-of-week from Sunday through Saturday in every month from September through November.
  - **es**: Al minuto 9 los días \*/5 del mes cada cuarto día de la semana del domingos al sábados de cada mes desde septiembre hasta noviembre.
  - **es-CL-Flaite**: La weá corre al minuto 9, sólo los días \*/5 cada 4 día de la semana del domingo al sábado, terrible específico en desde septiembre hasta noviembre.

- `* 5-18 21 5,8-11 0-4`
  - **en**: At every minute past hour 5 on day-of-month 21 on every day-of-week from Sunday through Thursday in May and every month from August through November.
  - **es**: Cada minuto después de la hora 5 los días 21 del mes cada día de la semana del domingos al jueves de mayo y cada mes desde agosto hasta noviembre.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 5, sólo los días 21 del domingo al jueves en mayo o desde agosto hasta noviembre.

- `35,0-39 * 10-25 12,1-11 *`
  - **en**: At minute 35 on every day-of-month from 10 through 25 in December and every month from January through November.
  - **es**: Al minuto 35 cada día del mes del 10 al 25 de diciembre y cada mes desde enero hasta noviembre.
  - **es-CL-Flaite**: La weá corre al minuto 35 cada día del mes del 10 al 25, terrible específico en diciembre o desde enero hasta noviembre.

- `19 */5 16-24 7 5-6`
  - **en**: At minute 19 past every 5th hour on every day-of-month from 16 through 24 on every day-of-week from Friday through Saturday in July.
  - **es**: At minute 19 past every quinto hour cada día del mes del 16 al 24 cada día de la semana del viernes al sábados de julio.
  - **es-CL-Flaite**: At minute 19 past every 5 hour cada día del mes del 16 al 24, terrible específico del viernes al sábado en julio.

- `0-9,20,25-40 */4 22-29,12-20,4 5,7-8 3-4,0-6 2028-2030,2024-2026,2028`
  - **en**: At minute 0 past every 4th hour on day-of-month 22-29 and 12-20 and 4 and on Wednesday and Sunday in May and every month from July through August in 2028-2030,2024-2026,2028.
  - **es**: At minute 0 past every cuarto hour los días 22-29 y 12-20 y 4 del mes y los miércoles y domingos de mayo y cada mes desde julio hasta agosto en 2028-2030,2024-2026,2028.
  - **es-CL-Flaite**: At minute 0 past every 4 hour, sólo los días 22-29 o 12-20 o 4, y encima tiene que caer miércoles o domingo… en mayo o desde julio hasta agosto en 2028-2030,2024-2026,2028.

- `*/4 17 15-19,25 11-12 1-5`
  - **en**: At every 4th minute past hour 17 on day-of-month 15-19 and 25 on every day-of-week from Monday through Friday in every month from November through December.
  - **es**: At every cuarto minute past hour 17 los días 15-19 y 25 del mes cada día de la semana del lunes al viernes de cada mes desde noviembre hasta diciembre.
  - **es-CL-Flaite**: At every 4 minute past hour 17, sólo los días 15-19 o 25 del lunes al viernes en desde noviembre hasta diciembre.

- `24 * 1-20 * 1-3`
  - **en**: At minute 24 on every day-of-month from 1 through 20 on every day-of-week from Monday through Wednesday.
  - **es**: Al minuto 24 cada día del mes del 1 al 20 cada día de la semana del lunes al miércoles.
  - **es-CL-Flaite**: La weá corre al minuto 24 cada día del mes del 1 al 20, terrible específico del lunes al miércoles.

- `* 6-12 26 2 0-1,0-1,0`
  - **en**: At every minute past hour 6 on day-of-month 26 and on Sunday and Sunday and Sunday in February.
  - **es**: Cada minuto después de la hora 6 los días 26 del mes y los domingos y domingos y domingos de febrero.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 6, sólo los días 26, y encima tiene que caer domingo o domingo o domingo… en febrero.

- `* * 1,5-28,24-26 */2 *`
  - **en**: At every minute on day-of-month 1 and 5-28 and 24-26 in every 2nd month.
  - **es**: Cada minuto los días 1 y 5-28 y 24-26 del mes de cada segundo mes.
  - **es-CL-Flaite**: La weá corre cada minuto, sólo los días 1 y 5-28 o 24-26 en cada 2 mes.

- `26-59 20-22 */3 8,9,9 2-6,3`
  - **en**: At every minute from 26 through 59 past hour 20 on day-of-month \*/3 and on Tuesday and Wednesday in August and September and September.
  - **es**: Cada minuto del 26 al 59 después de la hora 20 los días \*/3 del mes y los martes y miércoles de agosto y septiembre y septiembre.
  - **es-CL-Flaite**: La weá corre entre el minuto 26 y el 59 pasao' las 20 de la mañana, sólo los días \*/3, y encima tiene que caer martes o miércoles… en agosto, septiembre y septiembre,.

- `* 22,19,14 */2 9-12 5-6,2-5,3`
  - **en**: At minute _ past hour 22 and 19 and 14 on day-of-month _/2 and on Friday and Tuesday and Wednesday in every month from September through December.
  - **es**: Al minuto _ después de la hora 22 y 19 y 14 los días _/2 del mes y los viernes y martes y miércoles de cada mes desde septiembre hasta diciembre.
  - **es-CL-Flaite**: La weá corre al minuto _ pasao' las 22 o 19 o 14, sólo los días _/2, y encima tiene que caer viernes o martes o miércoles… en desde septiembre hasta diciembre.

- `5-20,6-9,18 22-23,22 */2 3 3-5`
  - **en**: At every minute from 5 through 20,6 past hour 22 on day-of-month \*/2 on every day-of-week from Wednesday through Friday in March.
  - **es**: Cada minuto del 5 al 20,6 después de la hora 22 los días \*/2 del mes cada día de la semana del miércoles al viernes de marzo.
  - **es-CL-Flaite**: La weá corre entre el minuto 5 y el 20,6 pasao' las 22 de la mañana, sólo los días \*/2 del miércoles al viernes en marzo.

- `50 1-12 26 9,2-12,4-7 0-6/5`
  - **en**: At 01:50 on day-of-month 26 on every 5th day-of-week from Sunday through Saturday in September and every month from February through December and every month from April through July.
  - **es**: A las 01:50 los días 26 del mes cada quinto día de la semana del domingos al sábados de septiembre y cada mes desde febrero hasta diciembre y cada mes desde abril hasta julio.
  - **es-CL-Flaite**: La weá corre a las 01:50, sólo los días 26 cada 5 día de la semana del domingo al sábado, terrible específico en septiembre o desde febrero hasta diciembre o desde abril hasta julio.

- `* 23 7-11 4 1,0,0-3 2024,2025,2026-2030`
  - **en**: At every minute past hour 23 on every day-of-month from 7 through 11 and on Monday and Sunday and Sunday in April in 2024,2025,2026-2030.
  - **es**: Cada minuto después de la hora 23 cada día del mes del 7 al 11 y los lunes y domingos y domingos de abril en 2024,2025,2026-2030.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 23 cada día del mes del 7 al 11, terrible específico, y encima tiene que caer lunes o domingo o domingo… en abril en 2024,2025,2026-2030.

- `* * 6-13 11,11,6 4`
  - **en**: At every minute on every day-of-month from 6 through 13 and on Thursday in November and November and June.
  - **es**: Cada minuto cada día del mes del 6 al 13 y los jueves de noviembre y noviembre y junio.
  - **es-CL-Flaite**: La weá corre cada minuto cada día del mes del 6 al 13, terrible específico, y encima tiene que caer jueves… en noviembre, noviembre y junio,.

- `26-30 * 17-20,7-18 * 1-6`
  - **en**: At minute 26 on day-of-month 17-20 and 7-18 on every day-of-week from Monday through Saturday.
  - **es**: Al minuto 26 los días 17-20 y 7-18 del mes cada día de la semana del lunes al sábados.
  - **es-CL-Flaite**: La weá corre al minuto 26, sólo los días 17-20 o 7-18 del lunes al sábado.

- `* 21-22,18,16 12,15 3-7 2`
  - **en**: At minute \* past hour 21-22 and 18 and 16 on day-of-month 12 and 15 and on Tuesday in every month from March through July.
  - **es**: Al minuto \* después de la hora 21-22 y 18 y 16 los días 12 y 15 del mes y los martes de cada mes desde marzo hasta julio.
  - **es-CL-Flaite**: La weá corre al minuto \* pasao' las 21-22 o 18 o 16, sólo los días 12 y 15, y encima tiene que caer martes… en desde marzo hasta julio.

- `55-57 13,15-23 7-9,8-29,26-29 */4 4,2,0-6`
  - **en**: At every minute from 55 through 57 past hour 13 on day-of-month 7-9 and 8-29 and 26-29 and on Thursday and Tuesday and Sunday in every 4th month.
  - **es**: Cada minuto del 55 al 57 después de la hora 13 los días 7-9 y 8-29 y 26-29 del mes y los jueves y martes y domingos de cada cuarto mes.
  - **es-CL-Flaite**: La weá corre entre el minuto 55 y el 57 pasao' las 13 de la mañana, sólo los días 7-9 o 8-29 o 26-29, y encima tiene que caer jueves o martes o domingo… en cada 4 mes.

- `0 */5 9 3,12 5-6`
  - **en**: At minute 0 past every 5th hour on day-of-month 9 on every day-of-week from Friday through Saturday in March and December.
  - **es**: At minute 0 past every quinto hour los días 9 del mes cada día de la semana del viernes al sábados de marzo y diciembre.
  - **es-CL-Flaite**: At minute 0 past every 5 hour, sólo los días 9 del viernes al sábado en marzo o diciembre.

- `* 11-20,19-21,17-21 9 */2 6 2025-2026,2026-2030,2029`
  - **en**: At minute \* past hour 11-20 and 19-21 and 17-21 on day-of-month 9 and on Saturday in every 2nd month in 2025-2026,2026-2030,2029.
  - **es**: Al minuto \* después de la hora 11-20 y 19-21 y 17-21 los días 9 del mes y los sábados de cada segundo mes en 2025-2026,2026-2030,2029.
  - **es-CL-Flaite**: La weá corre al minuto \* pasao' las 11-20 o 19-21 o 17-21, sólo los días 9, y encima tiene que caer sábado… en cada 2 mes en 2025-2026,2026-2030,2029.

- `33-43,40,36-47 * */4 8 5-6`
  - **en**: At minute 33 on day-of-month \*/4 on every day-of-week from Friday through Saturday in August.
  - **es**: Al minuto 33 los días \*/4 del mes cada día de la semana del viernes al sábados de agosto.
  - **es-CL-Flaite**: La weá corre al minuto 33, sólo los días \*/4 del viernes al sábado en agosto.

- `57 */2 24 11-12 *`
  - **en**: At minute 57 past every 2nd hour on day-of-month 24 in every month from November through December.
  - **es**: At minute 57 past every segundo hour los días 24 del mes de cada mes desde noviembre hasta diciembre.
  - **es-CL-Flaite**: At minute 57 past every 2 hour, sólo los días 24 en desde noviembre hasta diciembre.

- `30-33 * * * 0-6/3`
  - **en**: At minute 30 on every 3rd day-of-week from Sunday through Saturday.
  - **es**: Al minuto 30 cada tercer día de la semana del domingos al sábados.
  - **es-CL-Flaite**: La weá corre al minuto 30 cada 3 día de la semana del domingo al sábado, terrible específico.

- `* 10 3-18,4-31 6,2-3,7 1-5,5-6`
  - **en**: At every minute past hour 10 on day-of-month 3-18 and 4-31 and on Monday and Friday in June and every month from February through March and July.
  - **es**: Cada minuto después de la hora 10 los días 3-18 y 4-31 del mes y los lunes y viernes de junio y cada mes desde febrero hasta marzo y julio.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las 10, sólo los días 3-18 o 4-31, y encima tiene que caer lunes o viernes… en junio o desde febrero hasta marzo o julio.

- `*/5 14-15 16,9 */2 1`
  - **en**: At every 5th minute past hour 14 on day-of-month 16 and 9 and on Monday in every 2nd month.
  - **es**: At every quinto minute past hour 14 los días 16 y 9 del mes y los lunes de cada segundo mes.
  - **es-CL-Flaite**: At every 5 minute past hour 14, sólo los días 16 y 9, y encima tiene que caer lunes… en cada 2 mes.

- `55 20-22 15-25,8-16,1 3,1,9-12 5-6`
  - **en**: At 20:55 on day-of-month 15-25 and 8-16 and 1 on every day-of-week from Friday through Saturday in March and January and every month from September through December.
  - **es**: A las 20:55 los días 15-25 y 8-16 y 1 del mes cada día de la semana del viernes al sábados de marzo y enero y cada mes desde septiembre hasta diciembre.
  - **es-CL-Flaite**: La weá corre a las 20:55, sólo los días 15-25 o 8-16 o 1 del viernes al sábado en marzo, enero y desde, septiembre hasta diciembre.

- `*/4 7-20 * */4 0-2`
  - **en**: At every 4th minute past hour 7 on every day-of-week from Sunday through Tuesday in every 4th month.
  - **es**: At every cuarto minute past hour 7 cada día de la semana del domingos al martes de cada cuarto mes.
  - **es-CL-Flaite**: At every 4 minute past hour 7 del domingo al martes en cada 4 mes.

- `1 9 * */2 4`
  - **en**: At 09:01 on Thursday in every 2nd month.
  - **es**: A las 09:01 los jueves de cada segundo mes.
  - **es-CL-Flaite**: La weá corre a las 09:01 los jueves en cada 2 mes.

- `31 * */4 11-12 0-6/4`
  - **en**: At minute 31 on day-of-month \*/4 on every 4th day-of-week from Sunday through Saturday in every month from November through December.
  - **es**: Al minuto 31 los días \*/4 del mes cada cuarto día de la semana del domingos al sábados de cada mes desde noviembre hasta diciembre.
  - **es-CL-Flaite**: La weá corre al minuto 31, sólo los días \*/4 cada 4 día de la semana del domingo al sábado, terrible específico en desde noviembre hasta diciembre.

- `* */5 3-9 4-11 0-5`
  - **en**: At every minute past hour NaN on every day-of-month from 3 through 9 on every day-of-week from Sunday through Friday in every month from April through November.
  - **es**: Cada minuto después de la hora NaN cada día del mes del 3 al 9 cada día de la semana del domingos al viernes de cada mes desde abril hasta noviembre.
  - **es-CL-Flaite**: La weá corre cada minuto pasao' las NaN cada día del mes del 3 al 9, terrible específico del domingo al viernes en desde abril hasta noviembre.

- `* 9,10,14-22 */4 7,7-11 5-6`
  - **en**: At minute _ past hour 9 and 10 and 14-22 on day-of-month _/4 on every day-of-week from Friday through Saturday in July and every month from July through November.
  - **es**: Al minuto _ después de la hora 9 y 10 y 14-22 los días _/4 del mes cada día de la semana del viernes al sábados de julio y cada mes desde julio hasta noviembre.
  - **es-CL-Flaite**: La weá corre al minuto _ pasao' las 9 o 10 o 14-22, sólo los días _/4 del viernes al sábado en julio o desde julio hasta noviembre.

- `*/4 4 * 2,2-11,5 3-4`
  - **en**: At every 4th minute past hour 4 on every day-of-week from Wednesday through Thursday in February and every month from February through November and May.
  - **es**: At every cuarto minute past hour 4 cada día de la semana del miércoles al jueves de febrero y cada mes desde febrero hasta noviembre y mayo.
  - **es-CL-Flaite**: At every 4 minute past hour 4 del miércoles al jueves en febrero o desde febrero hasta noviembre o mayo.
