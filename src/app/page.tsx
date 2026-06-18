"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    const supportedLocales = ["es", "en", "fr", "de", "ar", "zh"];
    const defaultLocale = "en";
    
    // Detect browser language
    const browserLang = navigator.language.split("-")[0];
    const targetLocale = supportedLocales.includes(browserLang) ? browserLang : defaultLocale;
    
    window.location.replace(`/${targetLocale}`);
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var supportedLocales = ["es", "en", "fr", "de", "ar", "zh"];
              var defaultLocale = "en";
              var browserLang = navigator.language.split("-")[0];
              var targetLocale = supportedLocales.indexOf(browserLang) !== -1 ? browserLang : defaultLocale;
              window.location.replace("/" + targetLocale);
            })();
          `,
        }}
      />
      <div className="flex items-center justify-center w-full min-h-screen bg-black text-zinc-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-t-white border-zinc-800 rounded-full animate-spin"></div>
          <span className="text-sm tracking-wider uppercase opacity-50 animate-pulse">Loading...</span>
        </div>
      </div>
    </>
  );
}
