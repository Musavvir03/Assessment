import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Cameras
  const cameras = await prisma.camera.createMany({
    data: [
      { name: 'Shop Floor A', location: 'Ground Floor' },
      { name: 'Vault', location: 'Basement' },
      { name: 'Entrance', location: 'Main Door' },
    ],
  });

  // Get camera IDs
  const allCameras = await prisma.camera.findMany();

  // Helper for timestamps
  const now = new Date();
  function hoursAgo(h: number) {
    const d = new Date(now);
    d.setHours(d.getHours() - h);
    return d;
  }

  // Incidents
  await prisma.incident.createMany({
    data: [
      // Shop Floor A
      { cameraId: allCameras[0].id, type: 'Unauthorised Access', tsStart: hoursAgo(1), tsEnd: hoursAgo(1), thumbnailUrl: '/thumbnails/incident1.jpg', resolved: false },
      { cameraId: allCameras[0].id, type: 'Gun Threat', tsStart: hoursAgo(2), tsEnd: hoursAgo(2), thumbnailUrl: '/thumbnails/incident2.jpg', resolved: false },
      { cameraId: allCameras[0].id, type: 'Face Recognised', tsStart: hoursAgo(3), tsEnd: hoursAgo(3), thumbnailUrl: '/thumbnails/incident3.jpg', resolved: true },
      { cameraId: allCameras[0].id, type: 'Unauthorised Access', tsStart: hoursAgo(4), tsEnd: hoursAgo(4), thumbnailUrl: '/thumbnails/incident4.jpg', resolved: false },
      // Vault
      { cameraId: allCameras[1].id, type: 'Gun Threat', tsStart: hoursAgo(5), tsEnd: hoursAgo(5), thumbnailUrl: '/thumbnails/incident5.jpg', resolved: false },
      { cameraId: allCameras[1].id, type: 'Face Recognised', tsStart: hoursAgo(6), tsEnd: hoursAgo(6), thumbnailUrl: '/thumbnails/incident6.jpg', resolved: true },
      { cameraId: allCameras[1].id, type: 'Unauthorised Access', tsStart: hoursAgo(7), tsEnd: hoursAgo(7), thumbnailUrl: '/thumbnails/incident7.jpg', resolved: false },
      { cameraId: allCameras[1].id, type: 'Gun Threat', tsStart: hoursAgo(8), tsEnd: hoursAgo(8), thumbnailUrl: '/thumbnails/incident8.jpg', resolved: false },
      // Entrance
      { cameraId: allCameras[2].id, type: 'Face Recognised', tsStart: hoursAgo(9), tsEnd: hoursAgo(9), thumbnailUrl: '/thumbnails/incident9.jpg', resolved: false },
      { cameraId: allCameras[2].id, type: 'Unauthorised Access', tsStart: hoursAgo(10), tsEnd: hoursAgo(10), thumbnailUrl: '/thumbnails/incident10.jpg', resolved: false },
      { cameraId: allCameras[2].id, type: 'Gun Threat', tsStart: hoursAgo(11), tsEnd: hoursAgo(11), thumbnailUrl: '/thumbnails/incident11.jpg', resolved: true },
      { cameraId: allCameras[2].id, type: 'Face Recognised', tsStart: hoursAgo(12), tsEnd: hoursAgo(12), thumbnailUrl: '/thumbnails/incident12.jpg', resolved: false },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 