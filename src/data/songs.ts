import { Song } from '../types';

export const GUITAR_TABS = [
  `e|-----0-----0---|-----1-----1---|
B|---0-----0-----|---1-----1-----|
G|-2---------2---|-2---------2---|
D|---------------|---------------|
A|---------------|---------------|
E|---------------|---------------|`,

  `e|-0-------0-----|-1-------1-----|
B|---1---1---1---|---1---1---1---|
G|-----2-----2---|-----2-----2---|
D|-2-------2-----|-3-------3-----|
A|---------------|---------------|
E|---------------|---------------|`,

  `e|-----3-----3---|-----2-----2---|
B|---3-----3-----|---3-----3-----|
G|-0---------0---|-2---------2---|
D|---------------|-0-------------|
A|-2---------2---|---------------|
E|---------------|---------------|`,

  `e|---3---3---3---3-|---3---3---3---3-|
B|---3---3---3---3-|---3---3---3---3-|
G|-0---0---0---0---|-2---2---2---2---|
D|-----------------|-0---------------|
A|-----------------|-----------------|
E|-3---------------|-----------------|`
];

export const INITIAL_SONGS: Song[] = [
  // User's PDF page 4 "Your songs"
  {
    id: 's-cold',
    title: 'Cold',
    artist: 'Maroon 5',
    key: 'Am',
    bpm: 100,
    hue: 195,
    plays: 28400,
    tabIndex: 1,
    parts: [
      [
        'Chorus',
        [
          '[Am]Cold enough to chill my [F]bones',
          'It feels like [C]I don\'t know you any[G]more',
          'I don\'t under[Am]stand why you\'re so [F]cold to me',
          'With your [C]touch as cold as [G]ice'
        ]
      ],
      [
        'Verse 1',
        [
          '[Am]Are we taking time, or a [F]time out?',
          'I can\'t [C]tell if you\'re still holding on [G]or not',
          '[Am]Sitting on your bed, on the [F]phone now',
          'Looking [C]at you, wondering where the [G]love went'
        ]
      ],
      [
        'Chorus',
        [
          '[Am]Cold enough to chill my [F]bones',
          'It feels like [C]I don\'t know you any[G]more',
          'I don\'t under[Am]stand why you\'re so [F]cold to me',
          'With your [C]touch as cold as [G]ice'
        ]
      ]
    ]
  },
  {
    id: 's-scientist',
    title: 'The Scientist',
    artist: 'Coldplay',
    key: 'Dm',
    bpm: 73,
    hue: 215,
    plays: 34100,
    tabIndex: 0,
    parts: [
      [
        'Verse 1',
        [
          '[Dm7]Come up to meet you, [Bb]tell you I\'m sorry',
          '[F]You don\'t know how lovely [Fsus2]you are',
          '[Dm7]I had to find you, [Bb]tell you I need you',
          '[F]Tell you I set you [Fsus2]apart'
        ]
      ],
      [
        'Chorus',
        [
          '[Bb]Nobody said it was easy',
          '[F]It\'s such a shame for us to [C]part',
          '[Bb]Nobody said it was easy',
          '[F]No one ever said it would be this [C]hard',
          '[C7]Oh, take me back to the [F]start'
        ]
      ],
      [
        'Verse 2',
        [
          '[Dm7]I was just guessing at [Bb]numbers and figures',
          '[F]Pulling your puzzles [Fsus2]apart',
          '[Dm7]Questions of science, [Bb]science and progress',
          '[F]Do not speak as loud as my [Fsus2]heart'
        ]
      ]
    ]
  },

  // User's PDF page 4 "Popular songs"
  {
    id: 's-wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    key: 'Em',
    bpm: 87,
    hue: 35,
    plays: 49200,
    tabIndex: 3,
    parts: [
      [
        'Verse 1',
        [
          '[Em7]Today is gonna be the day that they\'re [G]gonna throw it back to you',
          '[Dsus4]By now you should\'ve somehow realized what you [A7sus4]gotta do',
          '[Em7]I don\'t believe that anybody [G]feels the way I do',
          'About you [Dsus4]now [A7sus4]'
        ]
      ],
      [
        'Chorus',
        [
          'Because [Cadd9]maybe [Em7] [G]',
          'You\'re gonna be the one that [Em7]saves me [Cadd9] [Em7] [G]',
          'And after [Em7]all [Cadd9] [Em7] [G]',
          'You\'re my [Em7]wonder[Cadd9]wall [Em7] [G]'
        ]
      ],
      [
        'Verse 2',
        [
          '[Em7]Backbeat, the word is on the street that the [G]fire in your heart is out',
          '[Dsus4]I\'m sure you\'ve heard it all before, but you [A7sus4]never really had a doubt',
          '[Em7]I don\'t believe that anybody [G]feels the way I do',
          'About you [Dsus4]now [A7sus4]'
        ]
      ]
    ]
  },
  {
    id: 's-shape',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    key: 'C#m',
    bpm: 96,
    hue: 18,
    plays: 41800,
    tabIndex: 1,
    parts: [
      [
        'Verse 1',
        [
          'The club isn\'t the [C#m]best place to find a lover so the [F#m]bar is where I go',
          'Me and my [A]friends at the table doing shots, drinking [B]fast and then we talk slow',
          'Come over and start [C#m]up a conversation with just [F#m]me and trust me I\'ll give it a chance',
          'Took my [A]hand, stop, put Van the Man on the [B]jukebox and then we start to dance'
        ]
      ],
      [
        'Chorus',
        [
          'Girl, you know I [C#m]want your love',
          'Your love was handmade for [F#m]somebody like me',
          'Come on now, [A]follow my lead',
          'I may be crazy, don\'t [B]mind me',
          'Say, boy, let\'s not talk [C#m]too much',
          'Grab on my waist and put that [F#m]body on me',
          'Come on now, [A]follow my lead',
          'I\'m in love with the [B]shape of you'
        ]
      ]
    ]
  },
  {
    id: 's-im-yours',
    title: "I'm Yours",
    artist: 'Jason Mraz',
    key: 'B',
    bpm: 151,
    hue: 48,
    plays: 31200,
    tabIndex: 2,
    parts: [
      [
        'Verse 1',
        [
          'Well, you done done me, and you [B]bet I felt it',
          'I tried to be chill, but you\'re so [F#]hot that I melted',
          'I fell right through the [G#m]cracks',
          'And now I\'m trying to get [E]back'
        ]
      ],
      [
        'Chorus',
        [
          'So I won\'t hesitate [B]no more, no more',
          'It cannot [F#]wait, I\'m yours [G#m] [E]',
          'Open up your mind and see like [B]me',
          'Open up your plans and damn you\'re [F#]free',
          'Look into your heart and you\'ll find [G#m]love, love, love, [E]love'
        ]
      ]
    ]
  },
  {
    id: 's-perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    key: 'G',
    bpm: 63,
    hue: 330,
    plays: 38700,
    tabIndex: 0,
    parts: [
      [
        'Verse 1',
        [
          'I found a [G]love for [Em7]me',
          'Darling, just dive [C]right in and follow my [D]lead',
          'Well, I found a [G]girl, beautiful and [Em7]sweet',
          'Oh, I never [C]knew you were the someone waiting for [D]me'
        ]
      ],
      [
        'Chorus',
        [
          'Baby, I\'m [G]dancing in the [Em7]dark',
          'With you between my [C]arms',
          'Barefoot on the [G]grass',
          'Listening to our [D]favorite song',
          'When you said you looked a [Em7]mess, I whispered [C]underneath my breath',
          'But you heard it, [G]darling, you look [D]perfect tonight [G]'
        ]
      ]
    ]
  },

  // Atmospheric songs from the prototype
  {
    id: 's1',
    title: 'Ночной автобус',
    artist: 'Тихий Вторник',
    key: 'Am',
    bpm: 92,
    hue: 8,
    plays: 19120,
    tabIndex: 0,
    parts: [
      [
        'Куплет 1',
        [
          '[Am]Ночной автобус едет [F]через спящий город',
          '[C]Фонари считают [G]наши долгие дороги',
          '[Am]Я прижался лбом к [F]холодному стеклу',
          '[C]Ты сказала тихо: [G]«Просто посмотри в окно»'
        ]
      ],
      [
        'Припев',
        [
          '[F]Меньше слов, [C]больше звука',
          '[G]Пусть играет [Am]гитара',
          '[F]Меньше слов, [C]больше звука',
          '[G]Мы дойдём до ут[Am]ра'
        ]
      ],
      [
        'Куплет 2',
        [
          '[Am]Кто-то спит на заднем [F]сиденье у двери',
          '[C]Кто-то пишет письма, [G]не отправив никому',
          '[Am]А у нас в рюкзаке [F]только пара струн',
          '[C]И на всю дорогу [G]три простых аккорда'
        ]
      ]
    ]
  },
  {
    id: 's3',
    title: 'Дом у реки',
    artist: 'Северный Ветер',
    key: 'Em',
    bpm: 80,
    hue: 150,
    plays: 14300,
    tabIndex: 2,
    parts: [
      [
        'Куплет',
        [
          '[Em]Дом у реки, где [C]пахнет дымом',
          '[G]Дед растапливает [D]печь',
          '[Em]Тихо скрипит у [C]порога лодка',
          '[G]Ей давно пора [D]прилечь'
        ]
      ],
      [
        'Припев',
        [
          '[C]Возвращайся, [G]пока не стемнело',
          '[D]Чайник уже [Em]поёт',
          '[C]Возвращайся, [G]всё как раньше',
          '[D]Свет в окне [Em]твой'
        ]
      ]
    ]
  },
  {
    id: 's5',
    title: 'Утро без будильника',
    artist: 'Лето в сентябре',
    key: 'C',
    bpm: 100,
    hue: 45,
    plays: 12100,
    tabIndex: 1,
    parts: [
      [
        'Куплет',
        [
          '[C]Солнце на подушке, [Am]чай ещё горячий',
          '[F]Никуда не надо [G]бежать',
          '[C]Я надену старый [Am]свитер без причины',
          '[F]И начну тебе [G]играть'
        ]
      ],
      [
        'Припев',
        [
          '[F]Это утро без будильника',
          '[C]Это утро без забот',
          '[Dm]Пусть планы подождут',
          '[G]Ещё один аккорд'
        ]
      ]
    ]
  },
  {
    id: 's7',
    title: 'Тёплый чай',
    artist: 'Общага FM',
    key: 'D',
    bpm: 110,
    hue: 340,
    plays: 15400,
    tabIndex: 0,
    parts: [
      [
        'Куплет',
        [
          '[D]Пятый этаж, на кухне [G]гитара и смех',
          '[D]Три аккорда на [A]всех',
          '[D]Чайник свистит вместо [G]барабанов',
          '[Bm]А за стеной [A]ждёт сессия'
        ]
      ],
      [
        'Припев',
        [
          '[G]Налей мне тёплого [D]чаю',
          '[A]Сыграем ещё одну',
          '[G]Налей мне тёплого [D]чаю',
          '[A]Пока не уснул [D]дом'
        ]
      ]
    ]
  },
  {
    id: 's-kino',
    title: 'Кукушка',
    artist: 'Кино',
    key: 'Am',
    bpm: 98,
    hue: 12,
    plays: 52100,
    tabIndex: 1,
    parts: [
      [
        'Куплет 1',
        [
          '[Am]Песенок ещё сколько ненаписанных?',
          '[G]Скажи, кукушка, [Dm]пропой',
          '[Am]В городе мне жить или на выселках?',
          '[G]Камнем лежать или [Dm]гореть звездой?'
        ]
      ],
      [
        'Припев',
        [
          '[C]Солнце моё, взгляни [G]на меня',
          '[Am]Моя ладонь превратилась [F]в кулак',
          '[C]И если есть порох, [G]дай огня',
          '[Am]Вот [F]так...'
        ]
      ]
    ]
  },
  {
    id: 's-battery',
    title: 'Батарейка',
    artist: 'Жуки',
    key: 'Em',
    bpm: 104,
    hue: 28,
    plays: 46700,
    tabIndex: 2,
    parts: [
      [
        'Куплет',
        [
          '[Em]Холодный ветер с дождём [D]усилился стократно',
          '[C]Всё говорит об одном, [B7]что нет пути обратно',
          '[Em]Что ты не мой лопушок, [D]а я не твой Андрейка',
          '[C]Что у любви у нашей [B7]села батарейка'
        ]
      ],
      [
        'Припев',
        [
          '[Em]О-о-и-я-и-ё, [D]батарейка!',
          '[C]О-о-и-я-и-ё, [B7]батарейка!'
        ]
      ]
    ]
  }
];
