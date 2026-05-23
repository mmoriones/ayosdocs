/**
 * SEEDING UTILITY
 * 
 * This script populates the database with initial government office data and guide engagement stats.
 * 
 * Usage:
 * 1. Automatic: Triggered by hitting the GET /api/offices endpoint 
 *    if the GovernmentOffice collection is empty.
 * 2. Manual: Import seedOffices and call it within a temporary route 
 *     or administrative script.
 * 
 * Note: It includes a safety check (count === 0) to prevent duplicate 
 * seeding in development/production environments.
 */

import connectDB from "@/lib/mongodb";
import GovernmentOffice from "@/models/GovernmentOffice";
import GuideStats from "@/models/GuideStats";

const initialOffices = [
  {
    name: 'DFA Manila Aseana',
    agency: 'DFA',
    branchType: 'Main',
    address: 'Aseana Business Park, Bradco Ave, Parañaque, Metro Manila',
    city: 'Parañaque',
    province: 'Metro Manila',
    region: 'NCR',
    slug: 'dfa-manila-aseana',
    stats: {
      avgRating: 4.3,
      totalReports: 182,
      avgWaitTime: 'medium',
      appointmentDifficulty: 'moderate'
    },
    isActive: true
  },
  {
    name: 'PSA Quezon City Main Office',
    agency: 'PSA',
    branchType: 'Main',
    address: 'East Ave, Diliman, Quezon City, Metro Manila',
    city: 'Quezon City',
    province: 'Metro Manila',
    region: 'NCR',
    slug: 'psa-quezon-city-main',
    stats: {
      avgRating: 4.5,
      totalReports: 156,
      avgWaitTime: 'medium',
      appointmentDifficulty: 'easy'
    },
    isActive: true
  },
  {
    name: 'NBI Clearance Center - UN Avenue',
    agency: 'NBI',
    branchType: 'Main',
    address: 'NBI Building, Taft Ave, Ermita, Manila',
    city: 'Manila',
    province: 'Metro Manila',
    region: 'NCR',
    slug: 'nbi-clearance-un-avenue',
    stats: {
      avgRating: 4.1,
      totalReports: 98,
      avgWaitTime: 'slow',
      appointmentDifficulty: 'moderate'
    },
    isActive: true
  },
  {
    name: 'DFA NCR East - Megamall',
    agency: 'DFA',
    branchType: 'Mall-based',
    address: '7th Floor, SM Megamall Building C, EDSA cor. Julia Vargas Ave., Mandaluyong City',
    city: 'Mandaluyong',
    province: 'Metro Manila',
    region: 'NCR',
    slug: 'dfa-ncr-east-megamall',
    stats: {
      avgRating: 4.4,
      totalReports: 120,
      avgWaitTime: 'medium',
      appointmentDifficulty: 'difficult'
    },
    isActive: true
  },
  {
    name: 'SSS Diliman Branch',
    agency: 'SSS',
    branchType: 'Regional',
    address: 'SSS Bldg., East Ave., Diliman, Quezon City',
    city: 'Quezon City',
    province: 'Metro Manila',
    region: 'NCR',
    slug: 'sss-diliman-branch',
    stats: {
      avgRating: 3.8,
      totalReports: 75,
      avgWaitTime: 'slow',
      appointmentDifficulty: 'moderate'
    },
    isActive: true
  }
];

const initialGuideStats = [
  { slug: 'passport-appointment', views: 5240, bookmarks: 842 },
  { slug: 'nbi-clearance', views: 4850, bookmarks: 620 },
  { slug: 'psa-birth-certificate', views: 4210, bookmarks: 512 },
  { slug: 'sss-registration', views: 3890, bookmarks: 430 },
  { slug: 'national-id', views: 3100, bookmarks: 390 },
  { slug: 'driver-license-renewal', views: 2800, bookmarks: 310 },
  { slug: 'pag-ibig-housing-loan', views: 2400, bookmarks: 280 }
];

export async function seedOffices() {
  try {
    await connectDB();
    
    // Check if offices already exist
    const count = await GovernmentOffice.countDocuments();
    if (count === 0) {
      await GovernmentOffice.insertMany(initialOffices);
      console.log('Successfully seeded initial government offices.');
    }
  } catch (error) {
    console.error('Error seeding offices:', error);
  }
}

export async function seedGuideStats() {
  try {
    await connectDB();
    
    const count = await GuideStats.countDocuments();
    if (count === 0) {
      await GuideStats.insertMany(initialGuideStats);
      console.log('Successfully seeded initial guide statistics.');
    }
  } catch (error) {
    console.error('Error seeding guide stats:', error);
  }
}
