require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const Country = require('../src/models/country');
const Money = require('../src/models/money');
const { Author, Learner } = require('../src/models/User');
const Course = require('../src/models/Course');
const Lesson = require('../src/models/Lesson');
const { Page } = require('../src/models/Page');
const Wallet = require('../src/models/wallet');

const DEMO_PASSWORD = 'PennyWise-123';
const USD_COUNTRY = 'United States';

const SEED_AUTHORS = [
  {
    email: 'author@pennywise.app',
    displayName: 'Ama Author',
    role: 'author',
  },
  {
    email: 'anotherauthor@pennywise.app',
    displayName: 'Another Author',
    role: 'author',
  },
];

const SEED_USERS = [
  {
    email: 'learn.sara@pennywise.app',
    displayName: 'Sara Ekon',
    role: 'learner',
  },
  {
    email: 'learn.kofi@pennywise.app',
    displayName: 'Kofi Mensah',
    role: 'learner',
  },
];

const USD_COINS = [
  { value: 1, image: '/images/money/usd/coin-1c.png' },
  { value: 5, image: '/images/money/usd/coin-5c.png' },
  { value: 10, image: '/images/money/usd/coin-10c.png' },
  { value: 25, image: '/images/money/usd/coin-25c.png' },
];

const USD_NOTES = [
  { value: 1, image: '/images/money/usd/note-1.png' },
  { value: 5, image: '/images/money/usd/note-5.png' },
  { value: 10, image: '/images/money/usd/note-10.png' },
  { value: 20, image: '/images/money/usd/note-20.png' },
  { value: 50, image: '/images/money/usd/note-50.png' },
  { value: 100, image: '/images/money/usd/note-100.png' },
];

const SEED_COURSES = [
  {
    name: 'Money Basics',
    creatorEmail: 'author@pennywise.app',
    published: true,
    lessons: [
      {
        name: 'What Is Money?',
        description:
          'Learn what money is, where the idea came from, and why we use it every day.',
        estimatedDurationOfCompletionInMinutes: 10,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Money is best described as...',
            options: [
              {
                answerText: 'A way to trade value with others',
                isCorrect: true,
              },
              { answerText: 'Something only adults can use', isCorrect: false },
              { answerText: 'A card you wave at the shop', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each term with its meaning.',
            pairs: [
              { word: 'currency', definition: 'money used by a country' },
              { word: 'coins', definition: 'round metal money' },
              { word: 'notes', definition: 'paper money' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which of these is money?',
            options: [
              { answerText: 'A 10-cent dime', isCorrect: true },
              { answerText: 'A picture of a dollar', isCorrect: false },
              { answerText: 'A toy banknote', isCorrect: false },
            ],
          },
        ],
      },
      {
        name: 'Coins & Notes',
        description: 'Identify each coin and note by its value and name.',
        estimatedDurationOfCompletionInMinutes: 12,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'How much is a coin marked "25" worth?',
            options: [
              { answerText: '25 cents', isCorrect: true },
              { answerText: '5 cents', isCorrect: false },
              { answerText: '$25', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each coin to its value.',
            pairs: [
              { word: 'quarter', definition: '25 cents' },
              { word: 'dime', definition: '10 cents' },
              { word: 'nickel', definition: '5 cents' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which note is worth more, a $20 note or a $5 note?',
            options: [
              { answerText: 'A $20 note', isCorrect: true },
              { answerText: 'A $5 note', isCorrect: false },
              { answerText: 'They are worth the same', isCorrect: false },
            ],
          },
        ],
      },
      {
        name: 'Counting Total Value',
        description:
          'Add up a group of coins and notes to find the total amount.',
        estimatedDurationOfCompletionInMinutes: 15,
        experience: 15,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Two quarters and three dimes add up to...',
            options: [
              { answerText: '80 cents', isCorrect: true },
              { answerText: '60 cents', isCorrect: false },
              { answerText: '$1.00', isCorrect: false },
            ],
          },
          {
            type: 'budgeting',
            text: 'You started with a dollar. Reach your savings goal while buying treats.',
            startingAmount: 100,
            targetSavings: 30,
            availableItems: [
              { name: 'Sticker', cost: 15 },
              { name: 'Pencil', cost: 10 },
              { name: 'Juice box', cost: 25 },
              { name: 'Toy eraser', cost: 20 },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'A $20 note, a $10 note, and a $5 note total...',
            options: [
              { answerText: '$35', isCorrect: true },
              { answerText: '$25', isCorrect: false },
              { answerText: '$40', isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Smart Spending',
    creatorEmail: 'anotherauthor@pennywise.app',
    published: true,
    lessons: [
      {
        name: 'Needs vs Wants',
        description:
          'Sort the things you must have from the things you would like to have.',
        estimatedDurationOfCompletionInMinutes: 10,
        experience: 10,
        pages: [
          {
            type: 'wants_needs',
            text: 'Sort each item into want or need.',
            itemsToSort: [
              { name: 'Bread', correctCategory: 'need' },
              { name: 'Video game', correctCategory: 'want' },
              { name: 'School shoes', correctCategory: 'need' },
              { name: 'Novelty cap', correctCategory: 'want' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which of these is a need?',
            options: [
              { answerText: 'Clean drinking water', isCorrect: true },
              { answerText: 'A tablet', isCorrect: false },
              { answerText: 'A theme-park ticket', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each item to its group.',
            pairs: [
              { word: 'rent', definition: 'need' },
              { word: 'holiday toy', definition: 'want' },
              { word: 'doctor visit', definition: 'need' },
            ],
          },
        ],
      },
      {
        name: 'Making Change',
        description:
          'Figure out the correct change when you pay more than a price.',
        estimatedDurationOfCompletionInMinutes: 12,
        experience: 15,
        pages: [
          {
            type: 'multiple_choice',
            text: 'You pay $5 for a $3 toy. How much change do you get?',
            options: [
              { answerText: '$2', isCorrect: true },
              { answerText: '$1', isCorrect: false },
              { answerText: '$3', isCorrect: false },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'A snack costs 75¢ and you pay $2. Your change is...',
            options: [
              { answerText: '$1.25', isCorrect: true },
              { answerText: '75¢', isCorrect: false },
              { answerText: '$1.75', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each bill to the change returned from a $5 note.',
            pairs: [
              { word: '$3.50 item', definition: '$1.50 change' },
              { word: '$1.00 item', definition: '$4.00 change' },
              { word: '$4.25 item', definition: '75¢ change' },
            ],
          },
        ],
      },
      {
        name: 'Save or Spend?',
        description:
          'Plan a small budget and decide what to buy today versus save for later.',
        estimatedDurationOfCompletionInMinutes: 15,
        experience: 15,
        pages: [
          {
            type: 'budgeting',
            text: 'You have a $5 allowance. Keep some savings and still enjoy a treat.',
            startingAmount: 500,
            targetSavings: 200,
            availableItems: [
              { name: 'Comic book', cost: 150 },
              { name: 'Candy bundle', cost: 100 },
              { name: 'Savings coin', cost: 200 },
              { name: 'Keychain', cost: 75 },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'What is the best move when your target savings is reached early?',
            options: [
              {
                answerText: 'Save the extra for a bigger goal',
                isCorrect: true,
              },
              { answerText: 'Spend everything right away', isCorrect: false },
              { answerText: 'Give it all away immediately', isCorrect: false },
            ],
          },
          {
            type: 'wants_needs',
            text: 'Sort the budget lines into want or need.',
            itemsToSort: [
              { name: 'Lunch', correctCategory: 'need' },
              { name: 'Arcade tokens', correctCategory: 'want' },
              { name: 'Bus fare', correctCategory: 'need' },
            ],
          },
        ],
      },
    ],
  },
];

const WALLETS = [
  {
    email: 'learn.sara@pennywise.app',
    type: 'immediate',
    total: 12.5,
  },
  {
    email: 'learn.sara@pennywise.app',
    type: 'long-term',
    total: 40,
  },
  {
    email: 'learn.kofi@pennywise.app',
    type: 'immediate',
    total: 8,
  },
  {
    email: 'learn.kofi@pennywise.app',
    type: 'long-term',
    total: 25,
  },
];

async function dropLegacyCollections() {
  const legacy = ['learners', 'modules', 'progress'];
  for (const name of legacy) {
    try {
      await mongoose.connection.dropCollection(name);
      console.log(`Dropped legacy collection "${name}"`);
    } catch {
      // collection does not exist - ignore
    }
  }
}

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function seed({ mongoUri } = {}) {
  await connectDB(mongoUri);

  await Promise.all([
    Wallet.deleteMany({}),
    Page.deleteMany({}),
    Lesson.deleteMany({}),
    Course.deleteMany({}),
    Money.deleteMany({}),
  ]);
  await dropLegacyCollections();

  const country = await Country.findOneAndUpdate(
    { name: USD_COUNTRY },
    { name: USD_COUNTRY },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  const money = await Money.create({
    name: 'United States Dollar',
    coins: USD_COINS,
    notes: USD_NOTES,
    country: country._id,
  });

  const usersByEmail = {};
  for (const seedUser of SEED_USERS) {
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const user = await Learner.findOneAndUpdate(
      { email: seedUser.email },
      {
        email: seedUser.email,
        displayName: seedUser.displayName,
        role: seedUser.role,
        passwordHash: passwordHash,
        country: country._id,
        coursesEnrolled: [],
        coursesCreated: [],
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    usersByEmail[seedUser.email] = user;
  }

  const authorsByEmail = {};
  for (const seedAuthor of SEED_AUTHORS) {
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const author = await Author.findOneAndUpdate(
      { email: seedAuthor.email },
      {
        email: seedAuthor.email,
        displayName: seedAuthor.displayName,
        role: seedAuthor.role,
        passwordHash: passwordHash,
        country: country._id,
        coursesEnrolled: [],
        coursesCreated: [],
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    authorsByEmail[seedAuthor.email] = author;
  }

  const courses = [];
  let lessonCount = 0;
  let pageCount = 0;
  for (const courseData of SEED_COURSES) {
    const creator = authorsByEmail[courseData.creatorEmail];
    const course = await Course.create({
      creatorId: creator._id,
      name: courseData.name,
      published: courseData.published,
      lessons: [],
    });

    const lessonIds = [];
    for (const lessonData of courseData.lessons) {
      const lesson = await Lesson.create({
        courseId: course._id,
        name: lessonData.name,
        description: lessonData.description,
        experience: lessonData.experience,
        estimatedDurationOfCompletionInMinutes:
          lessonData.estimatedDurationOfCompletionInMinutes,
        pages: [],
      });

      const pageIds = [];
      for (const pageData of lessonData.pages) {
        const page = await Page.create({
          lessonId: lesson._id,
          text: pageData.text,
          type: pageData.type,
          options: pageData.options,
          pairs: pageData.pairs,
          startingAmount: pageData.startingAmount,
          targetSavings: pageData.targetSavings,
          availableItems: pageData.availableItems,
          itemsToSort: pageData.itemsToSort,
        });
        pageIds.push(page._id);
        pageCount += 1;
      }

      lesson.pages = pageIds;
      await lesson.save();
      lessonIds.push(lesson._id);
      lessonCount += 1;
    }

    course.lessons = lessonIds;
    await course.save();
    courses.push(course);

    // creator.coursesCreated.push(course._id);
    // await creator.save();
  }

  const learners = SEED_USERS.filter((u) => u.role === 'learner').map(
    (u) => usersByEmail[u.email],
  );
  for (const learner of learners) {
    learner.coursesEnrolled = courses.map((c) => c._id);
    await learner.save();
  }

  for (const walletData of WALLETS) {
    await Wallet.create({
      user: usersByEmail[walletData.email]._id,
      total: walletData.total,
      country: country._id,
      denominations: money._id,
      type: walletData.type,
    });
  }

  console.log('Seed complete.');
  console.log(`  Country : ${country.name}`);
  console.log(
    `  Money   : ${money.name} (${money.coins.length} coins, ${money.notes.length} notes)`,
  );
  console.log(`  Users   : ${SEED_USERS.map((u) => u.email).join(', ')}`);
  console.log(`  Author  : ${SEED_AUTHORS.map((u) => u.email).join(', ')}`);
  console.log(`             password: ${DEMO_PASSWORD}`);
  console.log(
    `  Courses : ${courses.map((c) => c.name).join(', ')} (${lessonCount} lessons, ${pageCount} pages)`,
  );
  console.log(`  Wallets : ${WALLETS.length}`);

  await mongoose.connection.close();
  return {
    country,
    money,
    usersByEmail,
    authorsByEmail,
    courses,
    lessonCount,
    pageCount,
    walletCount: WALLETS.length,
  };
}

module.exports = { seed, SEED_USERS, DEMO_PASSWORD };

if (require.main === module) {
  const { MONGODB_URI } = process.env;
  seed({ mongoUri: MONGODB_URI }).catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
