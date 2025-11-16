export const CronRandom = (withYear: boolean = true): string => {
  // Shortcuts especiales
  const shortcuts = ["@yearly", "@monthly", "@weekly", "@daily", "@hourly"];

  // 20% de probabilidad de retornar un shortcut
  if (Math.random() < 0.2) {
    return shortcuts[Math.floor(Math.random() * shortcuts.length)];
  }

  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomChoice = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const generateField = (min: number, max: number): string => {
    const type = randomInt(1, 5);

    switch (type) {
      case 1: // Valor único
        return randomInt(min, max).toString();

      case 2: // Lista de valores
        const count = randomInt(2, 3);
        const values = Array.from({ length: count }, () => randomInt(min, max));
        return [...new Set(values)].sort((a, b) => a - b).join(",");

      case 3: // Rango
        const start = randomInt(min, max - 1);
        const end = randomInt(start + 1, max);
        return `${start}-${end}`;

      case 4: // Step
        const base = randomChoice([
          "*",
          `${randomInt(min, max - 1)}-${randomInt(min + 1, max)}`,
        ]);
        const step = randomInt(2, Math.min(6, max - min));
        return `${base}/${step}`;

      default: // Wildcard
        return "*";
    }
  };

  // Generar campos: minuto hora día mes día-semana [año]
  const minute = generateField(0, 59);
  const hour = generateField(0, 23);
  const dayOfMonth = generateField(1, 31);
  const month = generateField(1, 12);
  const dayOfWeek = generateField(0, 6);

  let cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  if (withYear) {
    const year = generateField(2024, 2030);
    cron += ` ${year}`;
  }

  return cron;
};
