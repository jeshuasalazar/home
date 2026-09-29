"use client";

import { useEffect, useState } from "react";

// Hora local de CDMX, en vivo. Se pinta vacía en el HTML estático para no desfasar.
export default function Clock({ locale }: { locale: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "America/Mexico_City" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [locale]);
  return <span className="min-w-[4.5ch]">{time}</span>;
}
