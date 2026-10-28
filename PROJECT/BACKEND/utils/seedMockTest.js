import MockTest from '../models/MockTest.js';

const seedDefaultMockTest = async () => {
  const existing = await MockTest.findOne();
  if (existing) return;

  await MockTest.create({
    title: 'General Aptitude Test',
    duration: 10,
    questions: [
      { question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correct: 1 },
      { question: 'If A=2, B=3 then A² + B² = ?', options: ['10', '13', '15', '12'], correct: 1 },
      { question: 'Odd one out: Circle, Square, Triangle, Volume', options: ['Circle', 'Square', 'Triangle', 'Volume'], correct: 3 },
      { question: 'Train covers 60km in 45min. Speed in km/h?', options: ['70', '75', '80', '90'], correct: 2 },
      { question: 'Next in sequence: 2, 6, 12, 20, __', options: ['28', '30', '32', '36'], correct: 1 }
    ]
  });

  console.log('Default mock test seeded.');
};

export default seedDefaultMockTest;
