// All stats and quotes below were fact-checked in Sept 2026. Numbers that
// couldn't be traced to a real source were replaced with verifiable ones.

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sourceUrl: string;
  sourceLabel: string;
}

export const stats = {
  garageClutter: {
    value: 25,
    suffix: '%',
    label: "of two-car garages have room for a car, after accounting for stored clutter",
    sourceUrl: 'https://newsroom.ucla.edu/magazine/center-everyday-lives-families-suburban-america',
    sourceLabel: 'UCLA Center on Everyday Lives of Families',
  },
  storageUnitRenters: {
    value: 1,
    suffix: ' in 3',
    label: 'Americans have rented a self-storage unit at some point',
    sourceUrl: 'https://www.storagecafe.com/blog/self-storage-demand-and-trends-2025/',
    sourceLabel: 'StorageCafe, 2025',
  },
  nonEssentialSpend: {
    value: 18,
    prefix: '$',
    suffix: 'K',
    label: 'spent on non-essentials every year, per a survey of U.S. adults',
    sourceUrl: 'https://finance.yahoo.com/news/americans-spend-18-000-per-153406769.html',
    sourceLabel: 'OnePoll/Ladder survey via Yahoo Finance',
  },
  selfStorageSpend: {
    value: 45,
    prefix: '$',
    suffix: 'B',
    label: 'spent renting self-storage space in the U.S. every year',
    sourceUrl: 'https://storeganise.com/blog/self-storage-trends',
    sourceLabel: 'Storeganise, 2026 Industry Report',
  },
  screenTimeHours: {
    value: 7,
    suffix: 'hrs',
    label: 'average daily screen time — about 44% of waking hours',
    sourceUrl: 'https://explodingtopics.com/blog/screen-time-stats',
    sourceLabel: 'Exploding Topics, screen time statistics',
  },
  phoneChecks: {
    value: 96,
    suffix: '×',
    label: 'times the average American checked their phone each day, per a 2019 study',
    sourceUrl: 'https://www.asurion.com/press-releases/americans-check-their-phones-96-times-a-day/',
    sourceLabel: 'Asurion, 2019',
  },
  phoneAttachment: {
    value: 46,
    suffix: '%',
    label: "of smartphone owners say they can't imagine daily life without their phone",
    sourceUrl: 'https://news.gallup.com/poll/184085/nearly-half-smartphone-users-imagine-life-without.aspx',
    sourceLabel: 'Gallup',
  },
  lifetimeScreenYears: {
    value: 21,
    suffix: 'yrs',
    label: 'of a lifetime spent looking at screens, at current average use',
    sourceUrl: 'https://eyesafe.com/lifetimeofscreentime/',
    sourceLabel: 'Eyesafe, Lifetime of Screen Time',
  },
  unusedSubscriptions: {
    value: 60,
    suffix: '%',
    label: "of people pay for at least one subscription they've forgotten about or don't use",
    sourceUrl: 'https://yougov.com/articles/50030-subscription-graveyard-how-many-unused-subscriptions-are-consumers-currently-paying-for',
    sourceLabel: 'YouGov, Subscription Graveyard',
  },
  savingsRate: {
    value: 3,
    suffix: '%',
    label: 'U.S. personal savings rate — financial experts recommend saving 20%',
    sourceUrl: 'https://www.bea.gov/data/income-saving/personal-saving-rate',
    sourceLabel: 'U.S. Bureau of Economic Analysis',
  },
  creditCardDebt: {
    value: 6,
    prefix: '$',
    suffix: 'K',
    label: 'average American credit card balance — $6,600 as of 2026',
    sourceUrl: 'https://wallethub.com/edu/cc/average-credit-card-debt/25533',
    sourceLabel: 'WalletHub, citing TransUnion',
  },
  informationOverload: {
    value: 20,
    suffix: '%',
    label: 'of Americans say they feel overwhelmed by the amount of information available to them',
    sourceUrl: 'https://www.pewresearch.org/internet/2016/12/07/information-overload/',
    sourceLabel: 'Pew Research Center',
  },
  physicalStressSymptoms: {
    value: 77,
    suffix: '%',
    label: 'of Americans regularly experience physical symptoms of stress',
    sourceUrl: 'https://www.singlecare.com/blog/news/stress-statistics/',
    sourceLabel: 'SingleCare, citing APA Stress in America',
  },
  dailyInfoConsumption: {
    value: 34,
    suffix: 'GB',
    label: 'of information consumed by the average American every day',
    sourceUrl: 'https://phys.org/news/2009-12-ucsd-experts-americans-consume.html',
    sourceLabel: 'UC San Diego, "How Much Information?" study',
  },
  anxietyDisruption: {
    value: 40,
    suffix: '%',
    label: 'report anxiety that disrupts their daily life',
    sourceUrl: 'https://adaa.org/workplace-stress-anxiety-disorders-survey',
    sourceLabel: 'ADAA Workplace Stress & Anxiety Survey',
  },
} satisfies Record<string, Stat>;

export interface Quote {
  text: string;
  author: string;
  sourceUrl: string;
}

export const quotes = {
  senecaPoor: {
    text: 'It is not the man who has too little, but the man who craves more, that is poor.',
    author: 'Seneca',
    sourceUrl: 'https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_2',
  },
  williamMorris: {
    text: 'Have nothing in your houses that you do not know to be useful, or believe to be beautiful.',
    author: 'William Morris',
    sourceUrl: 'https://en.wikiquote.org/wiki/William_Morris',
  },
  marieKondo: {
    text: 'The objective of cleaning is not just to clean, but to feel happiness living within that environment.',
    author: 'Marie Kondo',
    sourceUrl: 'https://www.goodreads.com/author/quotes/6538026.Marie_Kondo',
  },
  hansHofmann: {
    text: 'The ability to simplify means to eliminate the unnecessary so that the necessary may speak.',
    author: 'Hans Hofmann',
    sourceUrl: 'https://www.becomingminimalist.com/hans-hofmann-on-minimalism/',
  },
  marcusAurelius: {
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius (adapted from Meditations)',
    sourceUrl: 'https://www.gutenberg.org/files/2680/2680-h/2680-h.htm',
  },
  senecaShortness: {
    text: 'It is not that we have a short time to live, but that we waste a great deal of it.',
    author: 'Seneca',
    sourceUrl: 'https://www.gutenberg.org/ebooks/56075',
  },
  bruceLee: {
    text: 'It is not daily increase but daily decrease — hack away the unessential.',
    author: 'Bruce Lee',
    sourceUrl: 'https://brucelee.com/podcast-blog/2017/6/28/52-hack-away-the-unessentials',
  },
  willRogers: {
    text: "Too many people spend money they haven't earned to buy things they don't want to impress people they don't like.",
    author: 'attributed to Will Rogers (origin disputed)',
    sourceUrl: 'https://quoteinvestigator.com/2016/04/21/impress/',
  },
  robertKiyosaki: {
    text: "It's not about how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
    author: 'Robert Kiyosaki',
    sourceUrl: 'https://www.goodreads.com/author/quotes/9424.Robert_T_Kiyosaki',
  },
  senecaEverywhere: {
    text: 'To be everywhere is to be nowhere.',
    author: 'Seneca',
    sourceUrl: 'https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_2',
  },
  calNewportThrive: {
    text: 'The key to thriving in our high-tech world is to spend much less time using technology.',
    author: 'Cal Newport',
    sourceUrl: 'https://www.goodreads.com/work/quotes/63988240-digital-minimalism-choosing-a-focused-life-in-a-noisy-world',
  },
  calNewportShards: {
    text: 'The urge to check Twitter or refresh Reddit becomes a nervous twitch that shatters uninterrupted time into shards too small to support the presence necessary for an intentional life.',
    author: 'Cal Newport',
    sourceUrl: 'https://www.goodreads.com/work/quotes/63988240-digital-minimalism-choosing-a-focused-life-in-a-noisy-world',
  },
} satisfies Record<string, Quote>;
