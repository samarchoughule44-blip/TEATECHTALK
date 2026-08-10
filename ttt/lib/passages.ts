// Typing test passage pool — 60+ varied passages
export const PASSAGES: string[] = [
  // Tech & Programming
  "The quick brown fox jumps over the lazy dog. Programming is the art of algorithm design and the craft of debugging errant code. In the realm of high-stakes typing, every keystroke matters and precision is just as crucial as speed. Focus, breathe, and type.",
  "Clean code reads like well-written prose. A function should do one thing, and it should do that thing well. Variable names should reveal intent, and comments should explain why, not what. Write code for humans first and machines second.",
  "Artificial intelligence is transforming every industry on the planet. Machine learning models can now write poetry, compose music, diagnose diseases, and predict stock markets. The future belongs to those who understand and harness these powerful tools effectively.",
  "Version control is not optional in modern software development. Git allows teams to collaborate on massive codebases without stepping on each other's toes. Commit early, commit often, and always write meaningful commit messages that explain your reasoning.",
  "The internet was built on the foundation of open protocols and shared standards. HTTP, DNS, and TCP/IP are the invisible scaffolding that holds the digital world together. Every time you load a webpage, thousands of tiny data packets travel across the globe.",
  "Debugging is twice as hard as writing the code in the first place. If you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. Keep things simple and readable at all costs, even if it takes more lines.",
  "A database is an organized collection of structured information or data, typically stored electronically in a computer system. A database is usually controlled by a database management system, which provides efficient retrieval, insertion, update, and deletion.",
  "JavaScript was originally created in just ten days and has since become the most widely used programming language in the world. It powers everything from interactive websites to server-side applications, mobile apps, and even desktop software.",
  "The cloud has fundamentally changed how we think about computing infrastructure. Instead of owning and maintaining expensive servers, companies can now rent computational power and storage on demand, scaling up or down based on their actual needs.",
  "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money from users, or interrupting normal business processes.",

  // Science & Nature
  "The human brain contains approximately one hundred billion neurons, each connected to thousands of others through synapses. This creates an unimaginably complex network capable of storing memories, processing emotions, and generating conscious thought.",
  "Quantum mechanics describes the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics, including quantum chemistry, quantum field theory, and quantum information science.",
  "Climate change is the long-term alteration of temperature and typical weather patterns in a place. While climate change can refer to a particular location, in recent decades the term increasingly refers to global or planetary scale changes.",
  "The deep ocean remains one of the most mysterious and unexplored places on Earth. Scientists estimate that more than eighty percent of the ocean floor has never been mapped, observed, or even remotely sensed. Strange creatures lurk in the darkness.",
  "DNA is the hereditary material in humans and almost all other organisms. Nearly every cell in a person's body has the same DNA. Most DNA is located in the cell nucleus, but a small amount of DNA can also be found in the mitochondria.",

  // History & Culture
  "The Renaissance was a period of European cultural, artistic, political, and economic rebirth following the Middle Ages. Generally described as taking place from the fourteenth to the seventeenth century, it promoted the rediscovery of classical philosophy.",
  "Ancient Rome was one of the world's greatest civilizations, lasting for over one thousand years. At its peak, the Roman Empire controlled much of Europe, North Africa, and the Middle East. Their engineering, law, and culture still influence us today.",
  "The printing press, invented by Johannes Gutenberg around 1440, revolutionized the way information was spread across Europe. For the first time in history, books could be produced quickly and cheaply, making knowledge accessible to ordinary people.",
  "The Industrial Revolution began in Britain during the late eighteenth century and quickly spread throughout Europe and North America. Steam power, mechanized textile production, and the rise of factories transformed agrarian societies into industrial ones.",
  "The Space Race was a twentieth century competition between two Cold War rivals, the United States and the Soviet Union, for supremacy in spaceflight capability. It had its origins in the nuclear arms race that followed the Second World War.",

  // Motivational & Inspirational
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Every champion was once a contender that refused to give up. The road to success is paved with obstacles, setbacks, and moments of doubt that test your resolve.",
  "The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it. Passion transforms ordinary effort into extraordinary achievement.",
  "In the middle of every difficulty lies opportunity. Your mindset determines whether you see obstacles or stepping stones. Those who achieve great things consistently approach challenges with curiosity, resilience, and an unwavering belief in their own potential.",
  "Time is the most valuable resource you have, and it is the one thing you can never get back. Every minute spent on something that does not move you forward is a minute taken from your future. Invest your time wisely and with great intention.",
  "Knowledge is power, but only when it is applied. Reading books and attending lectures builds potential. Taking action, making mistakes, and learning from them builds mastery. Theory without practice is just words on a page. Go out and do the thing.",

  // General Knowledge
  "The Great Wall of China is one of the most impressive architectural feats in human history. Built over many centuries by successive dynasties, it stretches thousands of miles across northern China and was designed to protect against invasions from the north.",
  "Mount Everest, located in the Himalayan range on the border of Nepal and Tibet, is the highest mountain above sea level on Earth. Its summit reaches an elevation of approximately 8849 meters or 29032 feet above mean sea level.",
  "The Amazon Rainforest is the world's largest tropical rainforest, covering over five and a half million square kilometers across nine countries. It is home to an estimated ten percent of all species on Earth and produces twenty percent of the world's oxygen.",
  "The Olympic Games have a rich history dating back to ancient Greece. Modern Olympics began in 1896 in Athens and have grown into the world's premier international sports competition. Thousands of athletes from over two hundred countries participate.",
  "Music is a universal language that transcends cultural barriers and speaks directly to human emotion. Throughout history, every civilization has developed its own musical traditions, instruments, and forms of expression that reflect their unique cultural identity.",

  // Literature
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness. It was the epoch of belief and the epoch of incredulity. We had everything before us, we had nothing before us, we were all going direct to Heaven.",
  "The measure of intelligence is the ability to change. The important thing is not to stop questioning. Curiosity has its own reason for existing. One cannot help but be in awe when one contemplates the mysteries of eternity, of life, and of the marvelous structure of reality.",
  "To be or not to be, that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. That is the dilemma every thinking person must face.",
  "All animals are equal, but some animals are more equal than others. Power corrupts, and absolute power corrupts absolutely. Beware of leaders who promise equality while quietly consolidating control, for the distance between revolution and tyranny is short.",
  "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife. However, little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of those around.",

  // Technology & Future
  "Blockchain technology creates a distributed ledger that records transactions across many computers so that the record cannot be altered retroactively without the alteration of all subsequent blocks. This makes it highly resistant to fraud and manipulation.",
  "Virtual reality and augmented reality are two technologies that are fundamentally changing how humans interact with digital information. VR immerses users in entirely digital worlds, while AR overlays digital information on top of the physical world.",
  "The Internet of Things connects everyday physical devices to the internet, enabling them to send and receive data. From smart refrigerators to connected streetlights, IoT is creating a world where almost every object can communicate and be controlled remotely.",
  "Self-driving cars use a combination of cameras, radar, lidar, and artificial intelligence to navigate roads without human input. While the technology has advanced significantly, widespread deployment requires solving complex ethical, legal, and safety challenges.",
  "Renewable energy sources like solar, wind, and hydroelectric power are becoming increasingly cost-competitive with fossil fuels. The transition to clean energy is not just an environmental imperative but also a massive economic opportunity for innovation.",

  // Sports & Fitness
  "Regular physical exercise has profound benefits for both body and mind. Studies consistently show that people who exercise regularly have lower rates of depression, anxiety, heart disease, and cognitive decline. Movement is medicine for the human body.",
  "Football is the world's most popular sport, played by over four billion fans across every continent. The beautiful game requires not just physical athleticism but tactical intelligence, teamwork, and the ability to perform under immense pressure.",
  "The science of nutrition is constantly evolving as researchers discover new connections between food and health. What we eat affects not just our physical wellbeing but also our mental clarity, energy levels, mood, and long-term risk of chronic disease.",
  "Swimming is often called the perfect exercise because it works every major muscle group while being gentle on the joints. Olympic swimmers train for hours every day, developing extraordinary cardiovascular fitness, strength, and mental toughness.",
  "Yoga is an ancient practice with roots in Indian philosophy. Modern yoga focuses on physical postures, breathing exercises, and meditation. Regular practice improves flexibility, strength, balance, and mental calmness in practitioners of all fitness levels.",

  // Philosophy & Ethics
  "The unexamined life is not worth living. Philosophy encourages us to question our assumptions, examine our values, and think carefully about what it means to live well. In a world of noise and distraction, the philosophical habit of careful reflection is precious.",
  "Ethical decision making requires us to balance competing values, consider the interests of others, and think about long-term consequences. There are no easy answers in ethics, only the commitment to reason carefully and act with integrity and compassion.",
  "Free will is one of the oldest and most debated questions in philosophy. Do we truly make choices, or are our actions determined by prior causes? The answer matters enormously for how we think about responsibility, punishment, and moral praise.",
  "Justice is giving each person what they are due. But what are people due? This question has occupied philosophers, lawyers, and ordinary citizens for thousands of years. Different theories of justice lead to radically different conclusions about fairness.",
  "Consciousness remains one of the greatest mysteries in science and philosophy. How does subjective experience arise from physical processes in the brain? Why is there something it is like to be you, rather than nothing? These questions haunt us still.",

  // Business & Economics
  "Entrepreneurship is the process of designing, launching, and running a new business, which is often initially a small business. The people who create these businesses are called entrepreneurs. They take on risk in exchange for the possibility of profit.",
  "Supply and demand is the most fundamental concept in economics. When supply exceeds demand, prices fall. When demand exceeds supply, prices rise. This simple mechanism coordinates the actions of millions of buyers and sellers without central planning.",
  "Compound interest is often called the eighth wonder of the world. When you earn interest on your interest, small amounts of money can grow into substantial wealth over long periods of time. Starting early and investing consistently are the keys to financial success.",
  "Leadership is not about being in charge. It is about taking care of those in your charge. Great leaders inspire others to reach their full potential, create environments where people can do their best work, and make decisions that serve the greater good.",
  "Innovation is the engine of economic growth. Companies that continuously improve their products, services, and processes gain competitive advantages that compound over time. Those that stand still are eventually overtaken by more agile competitors.",

  // Random & Fun
  "Coffee is the world's most widely consumed psychoactive substance. Billions of cups are consumed every day across the globe. Beyond its energy-boosting effects, coffee contains hundreds of bioactive compounds and has been linked to various health benefits.",
  "The humble honeybee is responsible for pollinating roughly one third of all the food we eat. Without bees, many fruits, vegetables, and nuts would disappear from our diets. The decline of bee populations worldwide poses a serious threat to food security.",
  "Languages shape how we think about and perceive the world. The Hopi language has no tenses for past, present, or future. Russian speakers have separate words for light blue and dark blue. The words available to us influence how we carve up reality.",
  "Sleep is not a luxury but a biological necessity. During sleep, the brain consolidates memories, clears toxic proteins, and regulates mood and appetite. Chronic sleep deprivation is linked to obesity, diabetes, heart disease, and cognitive decline.",
  "The smell of rain on dry earth has a name: petrichor. It is caused by the combination of plant oils and a compound called geosmin produced by soil bacteria. Humans are extraordinarily sensitive to geosmin and can detect it at concentrations of just a few parts per trillion.",
];

/**
 * Returns a pseudo-random passage that is different for each user
 * and different on each attempt by the same user.
 * Uses current timestamp + userId so results vary continuously.
 */
export function getRandomPassage(userId?: string): string {
  const seed = `${Date.now()}-${userId ?? Math.random()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % PASSAGES.length;
  return PASSAGES[index];
}
