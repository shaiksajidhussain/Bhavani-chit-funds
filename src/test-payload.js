// Test payload for customer creation with Base64 photo
// This is a sample payload that demonstrates the correct format

const testPayload = {
  "name": "test",
  "mobile": "7893160318",
  "address": "sainagar 5th cross anantapur, near masjid 12-940",
  "schemeId": "scheme-1",
  "startDate": "2025-09-13",
  "lastDate": "2025-09-15",
  "amountPerDay": 1000,  // Note: Integer, not string
  "duration": 200,       // Note: Integer, not string
  "durationType": "MONTHS",
  "group": "Group A",
  "status": "ACTIVE",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
};

// This is a minimal 1x1 pixel JPEG image in Base64 format
// In a real application, this would be replaced with the actual uploaded image

console.log('Test payload:', JSON.stringify(testPayload, null, 2));

export default testPayload;
