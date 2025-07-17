import { Locale } from "@/shared/model/Locale";
import { TLocaleLang } from "@/shared/shared/store/localeStore";
import { get } from "../ajaxService";

export async function getLocaleResources(lang?: TLocaleLang) {
  const path = lang ? `i18n/${lang}` : "i18n";
  const res = await get<Locale>(path);
  return res && res.data;
}

export function formatString(value: string, ...args: string[]) {
  let formatted = value;
  for (let i = 0; i < args.length; i++) {
    let regexp = new RegExp("\\{" + i + "\\}", "gi");
    formatted = formatted.replace(regexp, args[i]);
  }
  return formatted;
}
