import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher(){
  const { i18n } = useTranslation();
  const toggle = () => i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  return (
    <button onClick={toggle} className="lang-switch">
      {i18n.language === "en" ? "हिंदी" : "EN"}
    </button>
  );
}
