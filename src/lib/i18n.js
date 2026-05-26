import { useSettings } from './settings.jsx'

// UI string dictionary. These are interface labels (not scripture), so they
// are translated. {placeholders} are filled by the t() helper.
export const STRINGS = {
  en: {
    'tab.home': 'Home', 'tab.adhkar': 'Adhkar', 'tab.duas': 'Duʼa', 'tab.tasbih': 'Tasbih', 'tab.settings': 'Settings',

    'greeting.dawn': 'A blessed dawn', 'greeting.day': 'A peaceful day', 'greeting.dusk': 'A gentle evening', 'greeting.night': 'A restful night',
    'home.peace': 'Peace be upon you',
    'home.morning': 'Morning remembrance', 'home.evening': 'Evening remembrance',
    'home.adhkarSub': 'Adhkar as-Sabah wal-Masa · {n} duʼas',
    'home.featured': 'Remembrance of the day',
    'home.foot': 'Made as a sadaqah jariyah.',

    'prayer.title': 'Prayer times', 'prayer.enable': 'Enable', 'prayer.locating': 'Locating…',
    'prayer.share': 'Share your location to see today’s prayer times.',
    'prayer.denied': 'Location was blocked. Allow it in your browser to see prayer times.',
    'prayer.error': "Couldn't get your location — try again.",
    'prayer.next': 'Next prayer', 'prayer.in': 'in {t}',
    'p.fajr': 'Fajr', 'p.sunrise': 'Sunrise', 'p.dhuhr': 'Dhuhr', 'p.asr': 'Asr', 'p.maghrib': 'Maghrib', 'p.isha': 'Isha',

    'adhkar.title': 'Morning & Evening',
    'adhkar.tapDone': 'Tap when done', 'adhkar.tapN': 'Tap {n}×', 'adhkar.tapNext': 'Tap the ring or → for the next',
    'adhkar.accept': 'May Allah accept it from you.', 'adhkar.done': 'You’ve completed the morning & evening remembrance.',
    'adhkar.again': 'Begin again',

    'duas.title': 'Duʼa', 'duas.subtitle': 'Supplications for the moments of the day.',
    'duas.count': '{n} duʼa', 'duas.countP': '{n} duʼas',

    'tasbih.title': 'Tasbih', 'tasbih.subtitle': 'Tap to count your dhikr.',
    'tasbih.reset': 'Reset {x}', 'tasbih.today': 'Today, all dhikr: {n}',
    'tasbih.ofCycle': 'of {c}', 'tasbih.cycles': '{n} × {c}', 'tasbih.shukr': 'Moment of shukr',

    'ref.hisn': 'Hisn al-Muslim',

    'set.title': 'Settings',
    'set.theme': 'Theme', 'set.themeSub': 'Follows your device by default',
    'theme.system': 'System', 'theme.light': 'Light', 'theme.dark': 'Dark',
    'set.language': 'Language', 'set.languageSub': 'App interface language',
    'lang.en': 'English', 'lang.ar': 'العربية',
    'set.translation': 'Translation', 'set.translationSub': 'Show English under the Arabic',
    'set.transOff': 'Off', 'set.transOn': 'On',
    'set.size': 'Arabic size',
    'set.prayer': 'Prayer times', 'set.location': 'Location',
    'set.locSet': 'Location set', 'set.locNot': 'Not set', 'set.locUse': 'Use my location', 'set.locUpdate': 'Update',
    'set.calc': 'Calculation method', 'set.calcSub': 'How prayer times are computed',
    'set.asr': 'Asr (madhhab)', 'set.asrSub': 'Hanafi makes Asr later', 'asr.standard': 'Standard', 'asr.hanafi': 'Hanafi',
    'set.reminders': 'Reminders',
    'set.remPrayer': 'Prayer reminders', 'set.remPrayerSub': 'A notification at each prayer time',
    'set.remDhikr': 'Daily dhikr nudge', 'set.remDhikrSub': 'A gentle reminder each evening',
    'set.test': 'Send a test notification', 'set.testSent': 'Sent — check your notifications',
    'set.remNote': 'Reminders fire in the installed app. On the web they’re saved but won’t notify.',
    'set.aboutText': 'All Arabic and English come verbatim from Hisn al-Muslim (Fortress of the Muslim), compiled by Saʼid bin Ali al-Qahtani. Nothing in the adhkar or duʼa is generated or paraphrased.',
    'set.madeAs': 'Made as a sadaqah jariyah. May it benefit you.',
    'set.privacy': 'Privacy', 'set.on': 'On', 'set.off': 'Off',
  },
  ar: {
    'tab.home': 'الرئيسية', 'tab.adhkar': 'الأذكار', 'tab.duas': 'الأدعية', 'tab.tasbih': 'التسبيح', 'tab.settings': 'الإعدادات',

    'greeting.dawn': 'فجرٌ مبارك', 'greeting.day': 'يومٌ مبارك', 'greeting.dusk': 'مساءٌ طيّب', 'greeting.night': 'ليلةٌ هانئة',
    'home.peace': 'ورحمة الله وبركاته',
    'home.morning': 'أذكار الصباح', 'home.evening': 'أذكار المساء',
    'home.adhkarSub': 'أذكار الصباح والمساء · {n} ذكرًا',
    'home.featured': 'ذِكر اليوم',
    'home.foot': 'صُنع صدقةً جارية.',

    'prayer.title': 'مواقيت الصلاة', 'prayer.enable': 'تفعيل', 'prayer.locating': 'جارٍ تحديد الموقع…',
    'prayer.share': 'شارك موقعك لعرض مواقيت الصلاة اليوم.',
    'prayer.denied': 'تم حظر الموقع. فعّله في المتصفح لعرض المواقيت.',
    'prayer.error': 'تعذّر تحديد الموقع — حاول مرة أخرى.',
    'prayer.next': 'الصلاة القادمة', 'prayer.in': 'بعد {t}',
    'p.fajr': 'الفجر', 'p.sunrise': 'الشروق', 'p.dhuhr': 'الظهر', 'p.asr': 'العصر', 'p.maghrib': 'المغرب', 'p.isha': 'العشاء',

    'adhkar.title': 'الصباح والمساء',
    'adhkar.tapDone': 'انقر عند الانتهاء', 'adhkar.tapN': 'كرّر {n} مرات', 'adhkar.tapNext': 'انقر الدائرة أو ← للتالي',
    'adhkar.accept': 'تقبّل الله منك.', 'adhkar.done': 'أتممتَ أذكار الصباح والمساء.',
    'adhkar.again': 'ابدأ من جديد',

    'duas.title': 'الأدعية', 'duas.subtitle': 'أدعية لأوقات اليوم.',
    'duas.count': '{n} دعاء', 'duas.countP': '{n} أدعية',

    'tasbih.title': 'التسبيح', 'tasbih.subtitle': 'انقر لتعدّ ذِكرك.',
    'tasbih.reset': 'تصفير {x}', 'tasbih.today': 'اليوم، مجموع الأذكار: {n}',
    'tasbih.ofCycle': 'من {c}', 'tasbih.cycles': '{n} × {c}', 'tasbih.shukr': 'لحظة شُكر',

    'ref.hisn': 'حصن المسلم',

    'set.title': 'الإعدادات',
    'set.theme': 'المظهر', 'set.themeSub': 'يتبع جهازك تلقائيًا',
    'theme.system': 'تلقائي', 'theme.light': 'فاتح', 'theme.dark': 'داكن',
    'set.language': 'اللغة', 'set.languageSub': 'لغة واجهة التطبيق',
    'lang.en': 'English', 'lang.ar': 'العربية',
    'set.translation': 'الترجمة', 'set.translationSub': 'إظهار الإنجليزية تحت العربية',
    'set.transOff': 'إيقاف', 'set.transOn': 'تشغيل',
    'set.size': 'حجم الخط العربي',
    'set.prayer': 'مواقيت الصلاة', 'set.location': 'الموقع',
    'set.locSet': 'تم تحديد الموقع', 'set.locNot': 'غير محدّد', 'set.locUse': 'استخدم موقعي', 'set.locUpdate': 'تحديث',
    'set.calc': 'طريقة الحساب', 'set.calcSub': 'كيفية حساب مواقيت الصلاة',
    'set.asr': 'العصر (المذهب)', 'set.asrSub': 'المذهب الحنفي يؤخّر العصر', 'asr.standard': 'الجمهور', 'asr.hanafi': 'حنفي',
    'set.reminders': 'التنبيهات',
    'set.remPrayer': 'تنبيهات الصلاة', 'set.remPrayerSub': 'تنبيه عند كل وقت صلاة',
    'set.remDhikr': 'تذكير الذِّكر اليومي', 'set.remDhikrSub': 'تذكير لطيف كل مساء',
    'set.test': 'إرسال تنبيه تجريبي', 'set.testSent': 'تم الإرسال — تحقّق من التنبيهات',
    'set.remNote': 'تعمل التنبيهات في التطبيق المثبَّت. على الويب تُحفظ التفضيلات دون إرسال تنبيهات.',
    'set.aboutText': 'جميع النصوص العربية والإنجليزية منقولة حرفيًّا من «حصن المسلم» لسعيد بن علي القحطاني. لا شيء في الأذكار أو الأدعية مُولّد أو مُعاد صياغته.',
    'set.madeAs': 'صُنع صدقةً جارية. نفع الله به.',
    'set.privacy': 'الخصوصية', 'set.on': 'تشغيل', 'set.off': 'إيقاف',
  },
}

export function useT() {
  const { settings } = useSettings()
  const lang = settings.uiLang === 'ar' ? 'ar' : 'en'
  const dict = STRINGS[lang]
  const t = (key, vars) => {
    let s = dict[key] ?? STRINGS.en[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
    return s
  }
  return { t, lang }
}
