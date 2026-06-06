import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER", description: "Regular user" },
  });

  const trainerRole = await prisma.role.upsert({
    where: { name: "TRAINER" },
    update: {},
    create: { name: "TRAINER", description: "Professional trainer" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Administrator" },
  });

  console.log("✅ Roles created:", { userRole, trainerRole, adminRole });

  // Create exercise categories
  const categories = await Promise.all([
    prisma.exerciseCategory.upsert({
      where: { name: "CHEST" },
      update: {},
      create: {
        name: "CHEST",
        nameAr: "الصدر",
        description: "Chest exercises",
        descriptionAr: "تمارين الصدر",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "BACK" },
      update: {},
      create: {
        name: "BACK",
        nameAr: "الظهر",
        description: "Back exercises",
        descriptionAr: "تمارين الظهر",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "SHOULDERS" },
      update: {},
      create: {
        name: "SHOULDERS",
        nameAr: "الكتفين",
        description: "Shoulder exercises",
        descriptionAr: "تمارين الكتفين",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "BICEPS" },
      update: {},
      create: {
        name: "BICEPS",
        nameAr: "العضلة ذات الرأسين",
        description: "Bicep exercises",
        descriptionAr: "تمارين العضلة ذات الرأسين",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "TRICEPS" },
      update: {},
      create: {
        name: "TRICEPS",
        nameAr: "العضلة ثلاثية الرؤوس",
        description: "Tricep exercises",
        descriptionAr: "تمارين العضلة ثلاثية الرؤوس",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "LEGS" },
      update: {},
      create: {
        name: "LEGS",
        nameAr: "الأرجل",
        description: "Leg exercises",
        descriptionAr: "تمارين الأرجل",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "ABS" },
      update: {},
      create: {
        name: "ABS",
        nameAr: "البطن",
        description: "Abdominal exercises",
        descriptionAr: "تمارين البطن",
      },
    }),
    prisma.exerciseCategory.upsert({
      where: { name: "CARDIO" },
      update: {},
      create: {
        name: "CARDIO",
        nameAr: "تمارين القلب",
        description: "Cardio exercises",
        descriptionAr: "تمارين اللياقة القلبية",
      },
    }),
  ]);

  console.log("✅ Exercise categories created:", categories.length);

  // Create sample exercises
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        name: "Push Up",
        nameAr: "تمرين الضغط",
        description: "Classic push-up exercise",
        descriptionAr: "تمرين الضغط الكلاسيكي",
        categoryId: categories[0].id, // CHEST
        difficulty: "BEGINNER",
        equipment: "BODYWEIGHT",
        caloriesBurned: 7,
        duration: 10,
        instructions: "1. Get in plank position\n2. Lower your body\n3. Push back up",
        instructionsAr: "1. ابدأ بوضعية الألواح\n2. اخفض جسمك\n3. ادفع نفسك للأعلى",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Bench Press",
        nameAr: "تمرين الضغط على المقعد",
        description: "Bench press with barbell",
        descriptionAr: "تمرين الضغط على المقعد بالحديد",
        categoryId: categories[0].id, // CHEST
        difficulty: "INTERMEDIATE",
        equipment: "BARBELL",
        caloriesBurned: 10,
        duration: 8,
        instructions: "1. Lie on bench\n2. Lower bar to chest\n3. Press upward",
        instructionsAr: "1. استلقِ على المقعد\n2. اخفض الحديد إلى صدرك\n3. ادفع للأعلى",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Squat",
        nameAr: "تمرين السكوات",
        description: "Full body squat exercise",
        descriptionAr: "تمرين السكوات للجسم كامل",
        categoryId: categories[5].id, // LEGS
        difficulty: "INTERMEDIATE",
        equipment: "BARBELL",
        caloriesBurned: 12,
        duration: 8,
        instructions: "1. Stand with feet shoulder-width\n2. Lower hips back\n3. Return to standing",
        instructionsAr: "1. قف مع قدميك بعرض الكتفين\n2. اخفض الوركين للخلف\n3. عد للوقوف",
      },
    }),
  ]);

  console.log("✅ Sample exercises created:", exercises.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Database seeding completed!");
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
