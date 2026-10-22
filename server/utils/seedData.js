/**
 * Seed script — populates the database with initial demo data.
 * Run with: npm run seed
 *
 * WARNING: This will CLEAR all existing data before seeding.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Facility = require('../models/Facility');
const Plan = require('../models/Plan');
const Membership = require('../models/Membership');
const Enquiry = require('../models/Enquiry');

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // ── Clear all collections ───────────────────────────────────────────
    await Promise.all([
      User.deleteMany(),
      Trainer.deleteMany(),
      Facility.deleteMany(),
      Plan.deleteMany(),
      Membership.deleteMany(),
      Enquiry.deleteMany(),
    ]);
    console.log('All collections cleared.');

    // ── Users ────────────────────────────────────────────────────────────
    const adminSalt = await bcrypt.genSalt(10);
    const userSalt = await bcrypt.genSalt(10);

    await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@fitzone.com',
        password: await bcrypt.hash('admin123', adminSalt),
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('user123', userSalt),
        role: 'user',
      },
    ]);
    console.log('Users seeded.');

    // ── Trainers ─────────────────────────────────────────────────────────
    await Trainer.insertMany([
      {
        name: 'Marcus Rivera',
        specialization: 'Weight Training',
        experience: 8,
        bio: 'Marcus is a certified strength and conditioning specialist with 8 years of experience transforming bodies. He specialises in powerlifting technique, muscle hypertrophy programmes, and injury-prevention strategies for lifters of all levels.',
        image: 'https://via.placeholder.com/300x300?text=Marcus+Rivera',
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        specialization: 'Yoga',
        experience: 10,
        bio: 'Priya is a 500-hour RYT certified yoga instructor with a decade of teaching experience. She blends Hatha and Vinyasa styles to help clients build flexibility, mental clarity, and stress resilience. She also holds a certification in prenatal yoga.',
        image: 'https://via.placeholder.com/300x300?text=Priya+Sharma',
        isActive: true,
      },
      {
        name: 'Jake Thompson',
        specialization: 'Cardio',
        experience: 5,
        bio: 'Jake is a NASM-certified personal trainer who specialises in cardiovascular fitness and endurance training. With a background in competitive running, he designs personalised cardio programmes that improve stamina and accelerate fat loss.',
        image: 'https://via.placeholder.com/300x300?text=Jake+Thompson',
        isActive: true,
      },
      {
        name: 'Sofia Mendes',
        specialization: 'CrossFit',
        experience: 6,
        bio: 'Sofia is a Level-2 CrossFit trainer and former collegiate athlete. She delivers high-intensity functional training sessions that combine Olympic lifting, gymnastics, and metabolic conditioning to push clients beyond their limits safely.',
        image: 'https://via.placeholder.com/300x300?text=Sofia+Mendes',
        isActive: true,
      },
    ]);
    console.log('Trainers seeded.');

    // ── Facilities ───────────────────────────────────────────────────────
    await Facility.insertMany([
      {
        name: 'Gym Floor',
        description:
          'Our 5,000 sq ft main gym floor is equipped with free weights, barbells, squat racks, cable machines, and a full range of resistance machines — everything you need to build strength and muscle.',
        image: 'https://via.placeholder.com/600x400?text=Gym+Floor',
        isActive: true,
      },
      {
        name: 'Swimming Pool',
        description:
          'An Olympic-length heated indoor pool open year-round. Ideal for lap swimming, aqua aerobics, and active recovery. Lane reservations available for all Pro and Elite members.',
        image: 'https://via.placeholder.com/600x400?text=Swimming+Pool',
        isActive: true,
      },
      {
        name: 'Yoga Studio',
        description:
          'A serene, mirrored studio with hardwood floors, premium yoga mats, bolsters, and blocks. Hosts daily group yoga and meditation classes led by our certified instructors.',
        image: 'https://via.placeholder.com/600x400?text=Yoga+Studio',
        isActive: true,
      },
      {
        name: 'Cardio Zone',
        description:
          'Our dedicated cardio zone features the latest treadmills, ellipticals, rowing machines, stationary bikes, and stair climbers, all with integrated entertainment screens to keep you motivated.',
        image: 'https://via.placeholder.com/600x400?text=Cardio+Zone',
        isActive: true,
      },
    ]);
    console.log('Facilities seeded.');

    // ── Plans ────────────────────────────────────────────────────────────
    await Plan.insertMany([
      {
        name: 'Basic',
        price: 29,
        durationInDays: 30,
        features: [
          'Access to gym floor',
          'Locker room access',
          '1 group class/week',
        ],
        isPopular: false,
      },
      {
        name: 'Pro',
        price: 59,
        durationInDays: 30,
        features: [
          'All Basic features',
          'Unlimited group classes',
          'Pool access',
          '2 PT sessions/month',
        ],
        isPopular: true,
      },
      {
        name: 'Elite',
        price: 99,
        durationInDays: 30,
        features: [
          'All Pro features',
          'Personal trainer 3x/week',
          'Nutrition consultation',
          'Spa access',
        ],
        isPopular: false,
      },
    ]);
    console.log('Plans seeded.');

    console.log('\n✅ Seed data imported successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
