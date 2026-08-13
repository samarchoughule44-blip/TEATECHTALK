import { PrismaClient } from '@/src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? '' })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const questions = [
  // Web / JavaScript
  {
    question: 'What does DOM stand for?',
    optionA: 'Document Object Model',
    optionB: 'Data Object Management',
    optionC: 'Digital Object Model',
    optionD: 'Document Oriented Method',
    correctOption: 'A',
    category: 'Web',
    difficulty: 'easy',
  },
  {
    question: 'Which keyword is used to declare a block-scoped variable in JavaScript?',
    optionA: 'var',
    optionB: 'let',
    optionC: 'define',
    optionD: 'const',
    correctOption: 'B',
    category: 'JavaScript',
    difficulty: 'easy',
  },
  {
    question: 'What is the output of typeof null in JavaScript?',
    optionA: '"null"',
    optionB: '"undefined"',
    optionC: '"object"',
    optionD: '"boolean"',
    correctOption: 'C',
    category: 'JavaScript',
    difficulty: 'medium',
  },
  {
    question: 'Which HTTP method is used to send data to create a new resource?',
    optionA: 'GET',
    optionB: 'PUT',
    optionC: 'PATCH',
    optionD: 'POST',
    correctOption: 'D',
    category: 'Web',
    difficulty: 'easy',
  },
  {
    question: 'What does CSS stand for?',
    optionA: 'Cascading Style Sheets',
    optionB: 'Computer Style Sheets',
    optionC: 'Creative Style System',
    optionD: 'Colorful Style Scripts',
    correctOption: 'A',
    category: 'Web',
    difficulty: 'easy',
  },
  // Data Structures
  {
    question: 'Which data structure operates on a LIFO (Last In First Out) principle?',
    optionA: 'Queue',
    optionB: 'Stack',
    optionC: 'Linked List',
    optionD: 'Tree',
    correctOption: 'B',
    category: 'Data Structures',
    difficulty: 'easy',
  },
  {
    question: 'What is the time complexity of binary search?',
    optionA: 'O(n)',
    optionB: 'O(n²)',
    optionC: 'O(log n)',
    optionD: 'O(1)',
    correctOption: 'C',
    category: 'Algorithms',
    difficulty: 'medium',
  },
  {
    question: 'Which sorting algorithm has the best average-case time complexity?',
    optionA: 'Bubble Sort',
    optionB: 'Insertion Sort',
    optionC: 'Merge Sort',
    optionD: 'Selection Sort',
    correctOption: 'C',
    category: 'Algorithms',
    difficulty: 'medium',
  },
  // Networking
  {
    question: 'What does IP stand for in networking?',
    optionA: 'Internet Protocol',
    optionB: 'Internal Processor',
    optionC: 'Integrated Platform',
    optionD: 'Input Package',
    correctOption: 'A',
    category: 'Networking',
    difficulty: 'easy',
  },
  {
    question: 'Which port number is used by HTTPS by default?',
    optionA: '80',
    optionB: '21',
    optionC: '443',
    optionD: '8080',
    correctOption: 'C',
    category: 'Networking',
    difficulty: 'medium',
  },
  // Databases
  {
    question: 'What SQL keyword is used to retrieve data from a database?',
    optionA: 'FETCH',
    optionB: 'GET',
    optionC: 'RETRIEVE',
    optionD: 'SELECT',
    correctOption: 'D',
    category: 'Database',
    difficulty: 'easy',
  },
  {
    question: 'Which of the following is a NoSQL database?',
    optionA: 'MySQL',
    optionB: 'PostgreSQL',
    optionC: 'MongoDB',
    optionD: 'SQLite',
    correctOption: 'C',
    category: 'Database',
    difficulty: 'easy',
  },
  // OS / General CS
  {
    question: 'What does RAM stand for?',
    optionA: 'Random Access Memory',
    optionB: 'Read Access Memory',
    optionC: 'Rapid Access Module',
    optionD: 'Runtime Application Memory',
    correctOption: 'A',
    category: 'General',
    difficulty: 'easy',
  },
  {
    question: 'Which layer of the OSI model is responsible for routing?',
    optionA: 'Data Link Layer',
    optionB: 'Transport Layer',
    optionC: 'Network Layer',
    optionD: 'Session Layer',
    correctOption: 'C',
    category: 'Networking',
    difficulty: 'medium',
  },
  {
    question: 'What is a primary key in a relational database?',
    optionA: 'A key used for encryption',
    optionB: 'A unique identifier for each row in a table',
    optionC: 'A key that links two tables',
    optionD: 'A key used to sort records',
    correctOption: 'B',
    category: 'Database',
    difficulty: 'easy',
  },
  // Programming concepts
  {
    question: 'What is the purpose of a constructor in object-oriented programming?',
    optionA: 'To destroy an object',
    optionB: 'To initialize an object when it is created',
    optionC: 'To copy an object',
    optionD: 'To compare two objects',
    correctOption: 'B',
    category: 'OOP',
    difficulty: 'easy',
  },
  {
    question: 'What does API stand for?',
    optionA: 'Application Programming Interface',
    optionB: 'Applied Program Integration',
    optionC: 'Automated Process Interaction',
    optionD: 'Application Process Index',
    correctOption: 'A',
    category: 'General',
    difficulty: 'easy',
  },
  {
    question: 'Which of these is NOT a primitive data type in JavaScript?',
    optionA: 'string',
    optionB: 'number',
    optionC: 'array',
    optionD: 'boolean',
    correctOption: 'C',
    category: 'JavaScript',
    difficulty: 'medium',
  },
  {
    question: 'In version control (Git), what command is used to save changes to the local repository?',
    optionA: 'git save',
    optionB: 'git push',
    optionC: 'git commit',
    optionD: 'git store',
    correctOption: 'C',
    category: 'General',
    difficulty: 'easy',
  },
  {
    question: 'What is the correct HTML element for inserting a line break?',
    optionA: '<lb>',
    optionB: '<break>',
    optionC: '<br>',
    optionD: '<line>',
    correctOption: 'C',
    category: 'Web',
    difficulty: 'easy',
  },
]

async function main() {
  console.log('Seeding quiz questions...')

  // Delete existing questions to avoid duplicates on re-run
  await prisma.roomQuizQuestion.deleteMany()

  const created = await prisma.roomQuizQuestion.createMany({
    data: questions,
  })

  console.log(`✅ Seeded ${created.count} quiz questions.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
